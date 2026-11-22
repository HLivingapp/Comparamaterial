// Genera la web estática del comparador de materiales de obra.
// Uso: node comparador-materiales/generar.mjs [carpeta-salida]
// Variables opcionales:
//   SITE_URL      URL pública final (canonical, sitemap). Sin barra final.
//   REGISTRO_URL  Página de alta de reformistas en ReformaMejor.
//   NOMBRE_WEB    Nombre de la web.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const salida = process.argv[2] || join(aqui, "dist");
const SITE = (process.env.SITE_URL || "https://comparamaterial.com").replace(/\/$/, "");
const REGISTRO = process.env.REGISTRO_URL || "https://hlivingapp.github.io/Aplicaci-n-reformas/reformistas/";
const NOMBRE = process.env.NOMBRE_WEB || "Comparamaterial";
// Solo se deja indexar en el dominio definitivo (INDEXAR=1), para no duplicar contenido con la vista previa.
const INDEXAR = process.env.INDEXAR === "1";

const datos = JSON.parse(readFileSync(join(aqui, "datos", "precios.json"), "utf8"));
const { fecha, zona, tiendas, materiales } = datos;
const css = readFileSync(join(aqui, "estilos.css"), "utf8");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const eur = (n) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const [anio, mes, dia] = fecha.split("-").map(Number);
const fechaTexto = `${dia} de ${MESES[mes - 1]} de ${anio}`;
const mesTexto = `${MESES[mes - 1]} ${anio}`;

function mejor(m) {
  if (m.comparable === false || m.ofertas.length < 2) return null;
  return m.ofertas.reduce((a, b) => (b.precio < a.precio ? b : a));
}
function ahorroPct(m) {
  if (m.comparable === false || m.ofertas.length < 2) return null;
  const precios = m.ofertas.map((o) => o.precio);
  const max = Math.max(...precios), min = Math.min(...precios);
  return Math.round(((max - min) / max) * 100);
}

function pagina({ titulo, descripcion, ruta, cuerpo, jsonld, raiz }) {
  const canonical = SITE + "/" + ruta;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
${INDEXAR ? "" : '<meta name="robots" content="noindex, follow">\n'}<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="es_ES">
<meta name="theme-color" content="#2f6b4f">
<style>${css}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body>
<header class="barra"><div class="ancho">
  <a class="marca" href="${raiz}">${esc(NOMBRE)}</a>
  <span class="lema">Precios de materiales de obra en ${esc(zona)}</span>
</div></header>
<main class="ancho">
${cuerpo}
</main>
<footer class="pie"><div class="ancho">
  <p>Precios públicos de las webs de cada almacén, IVA incluido, consultados el ${fechaTexto}. Pueden cambiar según la tienda elegida y las ofertas del día. Confirma siempre el precio en el enlace antes de comprar.</p>
  <p>${esc(NOMBRE)} no vende materiales ni cobra a los almacenes. Las marcas citadas pertenecen a sus dueños.</p>
</div></footer>
</body>
</html>
`;
}

function ctaReformista() {
  return `<aside class="cta">
  <div>
    <h2>¿Eres reformista?</h2>
    <p>En ReformaMejor los clientes ven al momento tu presupuesto calculado con tus tarifas y te eligen para la visita. Pagas por visita y al firmar.</p>
  </div>
  <a class="boton" href="${esc(REGISTRO)}" rel="noopener">Darme de alta como reformista</a>
</aside>`;
}

function filaOferta(o, ganador) {
  const t = tiendas[o.tienda];
  const gana = ganador && ganador === o;
  return `<tr${gana ? ' class="gana"' : ""}>
  <th scope="row">${esc(t.nombre)}${gana ? ' <span class="chip">Más barato</span>' : ""}</th>
  <td>${esc(o.producto)}${o.nota ? `<small>${esc(o.nota)}</small>` : ""}</td>
  <td class="num">${eur(o.precio)}${o.porUnidad ? `<small>${esc(o.porUnidad)}</small>` : ""}</td>
  <td><a href="${esc(o.enlace)}" rel="nofollow noopener" target="_blank">Ver en la web</a></td>
</tr>`;
}

function paginaMaterial(m) {
  const g = mejor(m);
  const pct = ahorroPct(m);
  const precios = m.ofertas.map((o) => o.precio);
  const titulo = `Precio de ${m.nombre[0].toLowerCase() + m.nombre.slice(1)} (${m.formato.toLowerCase()}) en ${zona} | ${m.ofertas.map((o) => tiendas[o.tienda].nombre.split(" (")[0]).join(" vs ")}, ${mesTexto}`;
  const descripcion = g
    ? `${m.nombre}, ${m.formato.toLowerCase()}: desde ${eur(g.precio)} en ${tiendas[g.tienda].nombre.split(" (")[0]}. Comparamos precios con IVA de ${m.ofertas.length} almacenes en ${zona}, actualizado ${mesTexto}.`
    : `${m.nombre}, ${m.formato.toLowerCase()}: precios con IVA en almacenes de ${zona}, con enlace a cada producto. Actualizado ${mesTexto}.`;
  const ruta = `${m.slug}/`;
  const raiz = "../";
  const otros = materiales.filter((x) => x.categoria === m.categoria && x.slug !== m.slug);

  const producto = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${m.nombre} · ${m.formato}`,
    category: m.categoria,
    description: descripcion,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: Math.min(...precios).toFixed(2),
      highPrice: Math.max(...precios).toFixed(2),
      offerCount: m.ofertas.length,
      offers: m.ofertas.map((o) => ({
        "@type": "Offer",
        price: o.precio.toFixed(2),
        priceCurrency: "EUR",
        url: o.enlace,
        seller: { "@type": "Organization", name: tiendas[o.tienda].nombre },
      })),
    },
  };
  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: m.nombre, item: SITE + "/" + ruta },
    ],
  };

  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › ${esc(m.categoria)}</nav>
<h1>${esc(m.nombre)}</h1>
<p class="sub">${esc(m.formato)} · precios con IVA en ${esc(zona)} · ${fechaTexto}</p>
${g ? `<p class="resumen">El más barato hoy es <b>${esc(tiendas[g.tienda].nombre)}</b> con <b>${eur(g.precio)}</b>${pct ? `, un ${pct} % menos que el más caro` : ""}.</p>` : m.comparable === false ? `<p class="resumen">Los formatos no son iguales entre almacenes, así que aquí no marcamos ganador: compara por lo que cubre cada uno.</p>` : `<p class="resumen">Solo hemos encontrado precio público en un almacén para este producto.</p>`}
<div class="tabla"><table class="ofertas">
<thead><tr><th>Almacén</th><th>Producto</th><th>Precio</th><th></th></tr></thead>
<tbody>
${m.ofertas.map((o) => filaOferta(o, g)).join("\n")}
</tbody></table></div>
<section class="consejo"><h2>Cuánto necesitas</h2><p>${esc(m.consejo)} <span class="nota">Dato orientativo: tu reformista lo ajusta a tu obra.</span></p></section>
${ctaReformista()}
${otros.length ? `<section><h2>Más precios de ${esc(m.categoria.toLowerCase())}</h2><ul class="lista">${otros.map((x) => `<li><a href="../${x.slug}/">${esc(x.nombre)}</a> <span>${esc(x.formato)}</span></li>`).join("")}</ul></section>` : ""}
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [producto, migas], raiz }) };
}

function portada() {
  const categorias = [...new Set(materiales.map((m) => m.categoria))];
  const comparables = materiales.filter((m) => mejor(m));
  const cesta = {};
  for (const t of Object.keys(tiendas)) cesta[t] = 0;
  const cestaItems = comparables.filter((m) => m.ofertas.every((o) => o.tienda in tiendas) && m.ofertas.length === Object.keys(tiendas).length);
  for (const m of cestaItems) for (const o of m.ofertas) cesta[o.tienda] += o.precio;
  const ordenCesta = Object.entries(cesta).sort((a, b) => a[1] - b[1]);
  const [barata, cara] = [ordenCesta[0], ordenCesta[ordenCesta.length - 1]];
  const pctCesta = Math.round(((cara[1] - barata[1]) / cara[1]) * 100);

  const titulo = `Precios de materiales de obra en ${zona}: comparativa de almacenes (${mesTexto})`;
  const descripcion = `Compara el precio de cemento, yeso, placa de yeso laminado, cemento cola, cable, multicapa, porcelánico y pintura en Leroy Merlin y Obramat. Precios con IVA y enlace a cada producto.`;

  const tabla = categorias.map((c) => `
<tr class="cat"><th colspan="4" scope="colgroup">${esc(c)}</th></tr>
${materiales.filter((m) => m.categoria === c).map((m) => {
    const g = mejor(m);
    const min = Math.min(...m.ofertas.map((o) => o.precio));
    return `<tr>
  <th scope="row"><a href="${m.slug}/">${esc(m.nombre)}</a></th>
  <td>${esc(m.formato)}</td>
  <td class="num">${m.comparable === false ? "Varios" : "desde " + eur(min)}</td>
  <td>${g ? `${esc(tiendas[g.tienda].nombre.split(" (")[0])} <small>−${ahorroPct(m)} %</small>` : "—"}</td>
</tr>`;
  }).join("\n")}`).join("\n");

  const lista = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: titulo,
    itemListElement: materiales.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/${m.slug}/`, name: m.nombre })),
  };
  const web = { "@context": "https://schema.org", "@type": "WebSite", name: NOMBRE, url: SITE + "/", inLanguage: "es-ES" };

  const cuerpo = `
<section class="hero">
  <h1>Precios de materiales de obra en ${esc(zona)}, comparados</h1>
  <p class="sub">${materiales.length} materiales básicos de reforma en ${Object.values(tiendas).map((t) => t.nombre).join(" y ")}. Precios públicos con IVA, consultados el ${fechaTexto}.</p>
  <div class="cifras">
    <div><b>−${pctCesta} %</b><span>${esc(tiendas[barata[0]].nombre.split(" (")[0])} sale más barato en una cesta de ${cestaItems.length} productos (${eur(barata[1])} frente a ${eur(cara[1])}).</span></div>
    <div><b>${materiales.length}</b><span>materiales con enlace directo a la ficha de cada almacén.</span></div>
  </div>
</section>
<div class="tabla"><table>
<thead><tr><th>Material</th><th>Formato</th><th>Precio</th><th>Más barato</th></tr></thead>
<tbody>${tabla}</tbody>
</table></div>
${ctaReformista()}
<section class="consejo">
  <h2>Cómo leemos los precios</h2>
  <ul>
    <li>Tomamos el precio que muestra la web de cada almacén, con IVA, el día indicado. Cada almacén pide elegir tienda y el precio puede variar entre tiendas.</li>
    <li>En Obramat algunos precios son de compra por cantidad; comprando el palé completo se ahorra un 5 % adicional.</li>
    <li>Saltoki solo muestra precios a clientes profesionales con cuenta, por eso no aparece. Brico Depôt está pendiente de añadir.</li>
    <li>Cuando el producto no es idéntico, indicamos marca y formato para que compares lo mismo.</li>
  </ul>
</section>
`;
  return pagina({ titulo, descripcion, ruta: "", cuerpo, jsonld: [web, lista], raiz: "./" });
}

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });
writeFileSync(join(salida, "index.html"), portada());
const rutas = [""];
for (const m of materiales) {
  const { ruta, html } = paginaMaterial(m);
  mkdirSync(join(salida, ruta), { recursive: true });
  writeFileSync(join(salida, ruta, "index.html"), html);
  rutas.push(ruta);
}
writeFileSync(join(salida, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map((r) => `  <url><loc>${SITE}/${r}</loc><lastmod>${fecha}</lastmod></url>`).join("\n")}
</urlset>
`);
// En el dominio definitivo, GitHub Pages necesita el archivo CNAME con el dominio.
if (INDEXAR) writeFileSync(join(salida, "CNAME"), new URL(SITE).host + "\n");
writeFileSync(join(salida, "robots.txt"), INDEXAR ? `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n` : `User-agent: *\nDisallow: /\n`);
console.log(`Generadas ${rutas.length} páginas en ${salida}`);
