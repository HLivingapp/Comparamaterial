// Productos concretos de Amazon.es (datos/amazon.json) con enlace de afiliado.
// Sin API no se copian precios ni fotos de Amazon: tarjeta con icono propio y botón «Ver precio en Amazon».
// Con API (herramientas/amazon-api.mjs → datos/amazon-api.json) se muestran precio, foto y fecha que da la API.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AMAZON_TAG } from "./guias.mjs";

const aqui = dirname(fileURLToPath(import.meta.url));
const leer = (f, d) => { try { return JSON.parse(readFileSync(join(aqui, "datos", f), "utf8")); } catch { return d; } };
export const AMAZON = AMAZON_TAG ? (leer("amazon.json", {}).productos || []) : [];
// Datos de la API: { asin: { precio, imagen, titulo, fecha } }. Amazon exige mostrar la hora del precio y refrescarlo cada 24 h:
// si el dato tiene más de 24 h, no se muestra.
const API = leer("amazon-api.json", {});
const fresco = (d) => d && d.fecha && Date.now() - Date.parse(d.fecha) < 24 * 3600e3;

export const urlAmazon = (asin) => `https://www.amazon.es/dp/${asin}?tag=${encodeURIComponent(AMAZON_TAG)}`;
const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function tarjetasAmazon(lista, { esc, eur, icono }) {
  return `<ul class="amz-rejilla">${lista.map((p) => {
    const d = fresco(API[p.asin]) ? API[p.asin] : null;
    return `<li class="amz-t"><a href="${esc(urlAmazon(p.asin))}" rel="sponsored nofollow noopener" target="_blank">
  <span class="amz-foto">${d && d.imagen ? `<img src="${esc(d.imagen)}" alt="" loading="lazy">` : icono(p.area)}</span>
  ${p.marca ? `<span class="amz-marca">${esc(p.marca)}</span>` : ""}
  <span class="amz-nombre">${esc(p.nombre)}</span>
  ${d && d.precio ? `<span class="amz-precio">${eur(d.precio)}<small>Precio en Amazon el ${esc(new Date(d.fecha).toLocaleString("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }))}. Puede cambiar.</small></span>` : ""}
  <span class="amz-btn">Ver precio en Amazon →</span>
</a></li>`; }).join("")}</ul>`;
}

const aviso = (esc) => `<p class="g-aviso">Enlaces de afiliado de Amazon: si compras, Amazon nos paga una pequeña comisión y a ti te cuesta lo mismo. Precio, envío y opiniones, en Amazon.</p>`;

// Bloque para el final de cada página de área.
// Áreas de Amazon sin página propia en la web: se muestran también en un área cercana.
const EXTRA = { "Electricidad": ["Domótica"], "Obra y protección": ["Herramientas"] };
// Orden de la página /amazon/ (lo que pidió el usuario primero).
const ORDEN_AMZ = ["Baño", "Electricidad", "Domótica", "Iluminación", "Puertas", "Calefacción y agua caliente", "Herramientas", "Cocina", "Pintura", "Suelos", "Decoración y revestimientos", "Obra y protección"];
export function bloqueAmazonArea(area, raiz, ctx) {
  const ps = AMAZON.filter((p) => p.area === area || (EXTRA[area] || []).includes(p.area));
  if (!ps.length) return "";
  const grupos = [...new Set(ps.map((p) => p.grupo))];
  return `<section class="bloque amz" id="amazon"><div class="bloque-cab"><h2>También en Amazon <small>(${ps.length})</small></h2><a href="${raiz}amazon/#${slug(area)}">Ver todo en Amazon →</a></div>
${grupos.map((g) => `<h3 class="amz-g">${ctx.esc(g)}</h3>${tarjetasAmazon(ps.filter((p) => p.grupo === g), ctx)}`).join("")}
${aviso(ctx.esc)}</section>`;
}

// Página /amazon/ con todos los productos por área y grupo.
export function generarAmazon(ctx) {
  if (!AMAZON.length) return;
  const { salida, rutas, pagina, esc, SITE, mesTexto, rutaCat, categorias } = ctx;
  const ruta = "amazon/", raiz = "../";
  const areas = [...new Set(AMAZON.map((p) => p.area))].sort((a, b) => (ORDEN_AMZ.indexOf(a) + 1 || 99) - (ORDEN_AMZ.indexOf(b) + 1 || 99));
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › Selección en Amazon</nav>
<h1>Selección de productos para tu reforma en Amazon</h1>
<p class="resumen">Mamparas, mecanismos, domótica, griferías, inodoros, termos, iluminación, herrajes y herramientas que elegimos por marca y uso real en obra. El precio lo ves en Amazon, que lo cambia a menudo.</p>
<nav class="subgrupos" aria-label="Áreas">${areas.map((a) => `<a href="#${slug(a)}">${esc(a)} <small>${AMAZON.filter((p) => p.area === a).length}</small></a>`).join("")}</nav>
${areas.map((a) => { const ps = AMAZON.filter((p) => p.area === a); return `<section class="bloque" id="${slug(a)}"><div class="bloque-cab"><h2>${esc(a)} <small>(${ps.length})</small></h2>${categorias.includes(a) ? `<a href="${raiz}${rutaCat(a)}">Comparar precios de ${esc(a.toLowerCase())} en almacenes →</a>` : ""}</div>
${[...new Set(ps.map((p) => p.grupo))].map((g) => `<h3 class="amz-g">${esc(g)}</h3>${tarjetasAmazon(ps.filter((p) => p.grupo === g), ctx)}`).join("")}</section>`; }).join("\n")}
${aviso(esc)}
`;
  const lista = { "@context": "https://schema.org", "@type": "ItemList", name: "Selección de productos para reformas en Amazon", numberOfItems: AMAZON.length };
  mkdirSync(join(salida, ruta), { recursive: true });
  writeFileSync(join(salida, ruta, "index.html"), pagina({ titulo: `Productos para reformas en Amazon: mamparas, mecanismos, domótica, grifería y más (${mesTexto})`, descripcion: "Selección de mamparas, mecanismos eléctricos, domótica, grifería, inodoros, termos, iluminación y herramientas en Amazon.es, elegidos por marca y uso en obra.", ruta, cuerpo, jsonld: [lista], raiz }));
  rutas.push(ruta);
}
