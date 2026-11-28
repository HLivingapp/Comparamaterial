// Comprueba cada día el precio público de cada producto en la web de su tienda.
// Uso: node herramientas/actualizar-precios.mjs [--limite N] [--tienda id]
//
// - Respeta robots.txt de cada web y deja una pausa entre peticiones a la misma web.
// - Lee el precio de los datos estructurados de la ficha (schema.org Product/Offer en JSON-LD,
//   itemprop="price" o meta product:price:amount). No guarda fotos ni textos.
// - Si lo lee y es razonable, actualiza precio y fecha. Si la ficha ya no existe (404/410),
//   marca el producto como no disponible. Si no se puede leer, deja la fecha antigua:
//   la web marca el precio como «sin comprobar» a los 3 días y lo retira a los 14.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = join(dirname(fileURLToPath(import.meta.url)), "..");
const AGENTE = "ComparamaterialBot/1.0 (+https://comparamaterial.com)";
const PAUSA_MS = Number(process.env.PAUSA_MS || 2500);
const TIEMPO_MS = 20000;
const MAX_CAMBIO = 0.6; // un precio que cambia más de un 60 % no se acepta sin revisión
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const LIMITE = Number(opt("--limite") || Infinity);
const SOLO = opt("--tienda");
const HOY = process.env.HOY || new Date().toISOString().slice(0, 10);
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- robots.txt ----------
export function reglasRobots(texto, agente = AGENTE) {
  const grupos = []; let actual = null, enAgentes = false;
  for (const bruta of texto.split(/\r?\n/)) {
    const l = bruta.replace(/#.*/, "").trim(); if (!l) continue;
    const [k, ...r] = l.split(":"); const clave = k.trim().toLowerCase(); const valor = r.join(":").trim();
    if (clave === "user-agent") { if (!enAgentes) { actual = { agentes: [], reglas: [] }; grupos.push(actual); } actual.agentes.push(valor.toLowerCase()); enAgentes = true; }
    else if ((clave === "allow" || clave === "disallow") && actual) { enAgentes = false; if (valor || clave === "allow") actual.reglas.push([clave === "allow", valor]); }
    else enAgentes = false;
  }
  const nombre = agente.split("/")[0].toLowerCase();
  const propio = grupos.filter((g) => g.agentes.some((a) => a !== "*" && nombre.includes(a)));
  return (propio.length ? propio : grupos.filter((g) => g.agentes.includes("*"))).flatMap((g) => g.reglas);
}
export function permitido(reglas, ruta) {
  let mejor = null;
  for (const [permite, patron] of reglas) {
    const re = new RegExp("^" + patron.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (re.test(ruta) && (!mejor || patron.length > mejor[1].length || (patron.length === mejor[1].length && permite))) mejor = [permite, patron];
  }
  return !mejor || mejor[0];
}

// ---------- lectura del precio ----------
const num = (v) => {
  if (typeof v === "number") return v;
  let s = String(v ?? "").replace(/[^\d.,]/g, "");
  if (!s) return NaN;
  if (s.includes(",") && s.includes(".")) s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (s.includes(",")) s = s.replace(",", ".");
  return parseFloat(s);
};
function ofertasDe(nodo, out = []) {
  if (!nodo || typeof nodo !== "object") return out;
  if (Array.isArray(nodo)) { nodo.forEach((n) => ofertasDe(n, out)); return out; }
  const tipo = [].concat(nodo["@type"] || []).join(" ");
  if (/Offer/.test(tipo)) {
    const p = num(nodo.price ?? nodo.lowPrice ?? nodo.priceSpecification?.price);
    const moneda = nodo.priceCurrency ?? nodo.priceSpecification?.priceCurrency;
    if (p > 0 && (!moneda || moneda === "EUR")) out.push({ p, disponible: !/OutOfStock|Discontinued/i.test(String(nodo.availability || "")) });
  }
  for (const k of Object.keys(nodo)) if (k !== "@type") ofertasDe(nodo[k], out);
  return out;
}
export function leerPrecio(html) {
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const o = ofertasDe(JSON.parse(m[1].trim())); if (o.length) return { precio: Math.min(...o.map((x) => x.p)), disponible: o.some((x) => x.disponible), via: "json-ld" }; } catch {}
  }
  const meta = html.match(/<meta[^>]+(?:property|name)=["'](?:product:price:amount|og:price:amount)["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:product:price:amount|og:price:amount)["']/i);
  if (meta && num(meta[1]) > 0) return { precio: num(meta[1]), disponible: true, via: "meta" };
  const ip = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i) || html.match(/content=["']([^"']+)["'][^>]*itemprop=["']price["']/i);
  if (ip && num(ip[1]) > 0) return { precio: num(ip[1]), disponible: true, via: "itemprop" };
  return null;
}

// ---------- red ----------
async function pedir(url) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), TIEMPO_MS);
  try {
    const r = await fetch(url, { headers: { "user-agent": AGENTE, "accept-language": "es-ES,es;q=0.9", accept: "text/html,application/xhtml+xml" }, redirect: "follow", signal: ctl.signal });
    return { estado: r.status, texto: r.ok ? await r.text() : "" };
  } catch (e) { return { estado: 0, texto: "", error: String(e.message || e) }; } finally { clearTimeout(t); }
}

async function main() {
  const rutaCat = join(aqui, "datos", "catalogo.json"), rutaPre = join(aqui, "datos", "precios.json");
  const cat = JSON.parse(readFileSync(rutaCat, "utf8")), pre = JSON.parse(readFileSync(rutaPre, "utf8"));
  // Todo lo que tiene enlace: productos de catálogo y ofertas de los materiales comparados.
  const items = [...cat.productos.map((p) => ({ obj: p, tienda: p.tienda })),
    ...pre.materiales.flatMap((m) => m.ofertas.map((o) => ({ obj: o, tienda: o.tienda, comparado: true })))]
    .filter((x) => x.obj.enlace && (!SOLO || x.tienda === SOLO));
  // Primero lo que lleva más tiempo sin comprobar.
  items.sort((a, b) => String(a.obj.fecha || "").localeCompare(String(b.obj.fecha || "")));
  const porWeb = new Map();
  for (const it of items) { const h = new URL(it.obj.enlace).host; if (!porWeb.has(h)) porWeb.set(h, []); if (porWeb.get(h).length < LIMITE) porWeb.get(h).push(it); }

  const resumen = {};
  await Promise.all([...porWeb].map(async ([host, lista]) => {
    const r = (resumen[host] = { total: lista.length, ok: 0, igual: 0, cambiado: 0, retirado: 0, sinPrecio: 0, rechazado: 0, bloqueado: 0, error: 0 });
    const rob = await pedir(`https://${host}/robots.txt`);
    if (rob.estado >= 500 || rob.estado === 0) { r.bloqueado = lista.length; r.nota = "robots.txt no accesible"; return; }
    const reglas = rob.estado === 200 ? reglasRobots(rob.texto) : [];
    let fallosSeguidos = 0;
    for (const it of lista) {
      const u = new URL(it.obj.enlace);
      if (!permitido(reglas, u.pathname + u.search)) { r.bloqueado++; continue; }
      if (fallosSeguidos >= 15) { r.error++; continue; } // la web nos está rechazando: no insistir
      const res = await pedir(it.obj.enlace);
      await dormir(PAUSA_MS);
      if (res.estado === 404 || res.estado === 410) { it.obj.noDisponible = HOY; r.retirado++; fallosSeguidos = 0; continue; }
      if (res.estado !== 200) { r.error++; fallosSeguidos++; if (res.estado === 403 || res.estado === 429) await dormir(PAUSA_MS * 4); continue; }
      fallosSeguidos = 0;
      const l = leerPrecio(res.texto);
      if (!l) { r.sinPrecio++; continue; }
      // Precio por m² en el catálogo: solo se acepta si la ficha da el mismo tipo de precio (cambio razonable).
      const antes = it.obj.precio;
      if (antes && Math.abs(l.precio - antes) / antes > MAX_CAMBIO) { r.rechazado++; continue; }
      const nuevo = Math.round(l.precio * 100) / 100;
      if (nuevo !== antes) { r.cambiado++; it.obj.precioAnterior = antes; it.obj.precio = nuevo; if (it.obj.precioM2 && it.obj.unidad === "m²") it.obj.precioM2 = nuevo; } else r.igual++;
      it.obj.fecha = HOY; delete it.obj.noDisponible; r.ok++;
      if (!l.disponible) it.obj.agotado = HOY; else delete it.obj.agotado;
    }
  }));

  writeFileSync(rutaCat, JSON.stringify(cat, null, 2) + "\n");
  writeFileSync(rutaPre, JSON.stringify(pre, null, 2) + "\n");
  writeFileSync(join(aqui, "datos", "estado-actualizacion.json"), JSON.stringify({ fecha: HOY, webs: resumen }, null, 2) + "\n");
  console.table(resumen);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
