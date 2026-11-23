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

const slugify = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categorias = [...new Set(materiales.map((m) => m.categoria))];
const rutaCat = (c) => `categoria/${slugify(c)}/`;
const tiendaCorta = (t) => tiendas[t].nombre.split(" (")[0];
const GSC = process.env.GSC_VERIFICACION || "";

function mejor(m) {
  if (m.comparable === false || m.ofertas.length < 2) return null;
  const precios = m.ofertas.map((o) => o.precio);
  if (Math.min(...precios) === Math.max(...precios)) return null;
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
${GSC ? `<meta name="google-site-verification" content="${esc(GSC)}">\n` : ""}
<style>${css}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body>
<header class="barra"><div class="ancho">
  <a class="marca" href="${raiz}">${esc(NOMBRE)}</a>
  <span class="lema">Precios de materiales de obra en ${esc(zona)}</span>
  <nav class="cats">${categorias.map((c) => `<a href="${raiz}${rutaCat(c)}">${esc(c)}</a>`).join("")}</nav>
</div></header>
<a class="banda" href="${esc(REGISTRO)}" rel="noopener"><span class="ancho">
  <span class="banda-txt"><b>¿Eres reformista? Hay clientes que te buscan para hacerles la obra.</b>
  <span>En ReformaMejor ven tu presupuesto al momento, calculado con tus tarifas, y te eligen para la visita.</span></span>
  <span class="banda-btn">Suscríbete y recibe clientes →</span>
</span></a>
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
  <a class="boton" href="${esc(REGISTRO)}" rel="noopener">Suscríbete y recibe clientes</a>
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
  const nombreMin = m.nombre[0].toLowerCase() + m.nombre.slice(1);
  const titulo = `${m.nombre}: mejor precio y ofertas, ${m.ofertas.map((o) => tiendaCorta(o.tienda)).join(" vs ")} (${mesTexto})`;
  const hayOferta = m.ofertas.some((o) => /oferta|antes \d/i.test(o.nota || ""));
  const descripcion = g
    ? `¿Buscas ${nombreMin} barato? Desde ${eur(g.precio)} en ${tiendaCorta(g.tienda)}. Comparamos precios y ofertas con IVA de ${m.ofertas.length} almacenes en ${zona}, actualizado ${mesTexto}.`
    : `${m.nombre}, ${m.formato.toLowerCase()}: precios con IVA en almacenes de ${zona}, con enlace a cada producto. Actualizado ${mesTexto}.`;
  const min = Math.min(...m.ofertas.map((o) => o.precio)), max = Math.max(...m.ofertas.map((o) => o.precio));
  const faq = [
    [`¿Cuánto cuesta ${nombreMin}?`, m.ofertas.length > 1 ? `En ${zona}, ${m.formato.toLowerCase()} cuesta entre ${eur(min)} y ${eur(max)} con IVA en los almacenes que comparamos (${fechaTexto}).` : `En ${zona}, ${m.formato.toLowerCase()} cuesta ${eur(min)} con IVA en ${tiendaCorta(m.ofertas[0].tienda)} (${fechaTexto}).`],
    ...(g ? [[`¿Dónde comprar ${nombreMin} más barato?`, `Hoy el mejor precio está en ${tiendaCorta(g.tienda)}, con ${eur(g.precio)}${pct ? `, un ${pct} % menos que en el almacén más caro` : ""}. Confirma el precio en tu tienda, porque puede variar entre tiendas.`]] : []),
    [`¿Hay ofertas de ${nombreMin}?`, hayOferta ? `Sí: ${m.ofertas.filter((o) => /oferta|antes \d/i.test(o.nota || "")).map((o) => { const antes = (o.nota.match(/antes (\d[\d.,]*\s?€)/i) || [])[1]; return `${tiendaCorta(o.tienda)} lo tiene en oferta a ${eur(o.precio)}${antes ? ` (antes ${antes})` : ""}`; }).join("; ")}. Revisamos los precios cada semana.` : `Esta semana no hay ofertas destacadas en los almacenes que comparamos. El mejor precio es ${eur(min)}. Revisamos los precios cada semana, así que vuelve a mirar antes de comprar.`],
    [`¿Cuánto necesito para mi obra?`, m.consejo],
  ];
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
      { "@type": "ListItem", position: 2, name: m.categoria, item: SITE + "/" + rutaCat(m.categoria) },
      { "@type": "ListItem", position: 3, name: m.nombre, item: SITE + "/" + ruta },
    ],
  };

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › <a href="${raiz}${rutaCat(m.categoria)}">${esc(m.categoria)}</a></nav>
<h1>${esc(m.nombre)}</h1>
<p class="sub">${esc(m.formato)} · precios con IVA en ${esc(zona)} · ${fechaTexto}</p>
${g ? `<p class="resumen">El más barato hoy es <b>${esc(tiendas[g.tienda].nombre)}</b> con <b>${eur(g.precio)}</b>${pct ? `, un ${pct} % menos que el más caro` : ""}.</p>` : m.comparable === false ? `<p class="resumen">Los formatos no son iguales entre almacenes, así que aquí no marcamos ganador: compara por lo que cubre cada uno.</p>` : m.ofertas.length > 1 ? `<p class="resumen">Hoy cuesta lo mismo en los dos almacenes: <b>${eur(m.ofertas[0].precio)}</b>. Fíjate en lo que incluye cada uno.</p>` : `<p class="resumen">Solo hemos encontrado precio público en un almacén para este producto.</p>`}
<h2>Mejor precio de ${esc(nombreMin)} hoy${hayOferta ? " (con oferta)" : ""}</h2>
<div class="tabla"><table class="ofertas">
<thead><tr><th>Almacén</th><th>Producto</th><th>Precio</th><th></th></tr></thead>
<tbody>
${m.ofertas.map((o) => filaOferta(o, g)).join("\n")}
</tbody></table></div>
<section class="consejo"><h2>Cuánto necesitas</h2><p>${esc(m.consejo)} <span class="nota">Dato orientativo: tu reformista lo ajusta a tu obra.</span></p></section>
${ctaReformista()}
<section class="faq"><h2>Preguntas frecuentes</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>
${otros.length ? `<section><h2>Más precios de ${esc(m.categoria.toLowerCase())}</h2><ul class="lista">${otros.map((x) => `<li><a href="../${x.slug}/">Precio de ${esc(x.nombre[0].toLowerCase() + x.nombre.slice(1))}</a> <span>${esc(x.formato)}</span></li>`).join("")}</ul></section>` : ""}
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [producto, migas, faqLd], raiz }) };
}

function portada() {
  const comparables = materiales.filter((m) => mejor(m));
  const cesta = {};
  for (const t of Object.keys(tiendas)) cesta[t] = 0;
  const cestaItems = comparables.filter((m) => m.ofertas.every((o) => o.tienda in tiendas) && m.ofertas.length === Object.keys(tiendas).length);
  for (const m of cestaItems) for (const o of m.ofertas) cesta[o.tienda] += o.precio;
  const ordenCesta = Object.entries(cesta).sort((a, b) => a[1] - b[1]);
  const [barata, cara] = [ordenCesta[0], ordenCesta[ordenCesta.length - 1]];
  const victorias = Object.keys(tiendas).map((t) => [t, comparables.filter((m) => mejor(m).tienda === t).length]).sort((a, b) => b[1] - a[1]);

  const titulo = `Comparar precios de materiales de obra: mejor precio y ofertas en ${zona} (${mesTexto})`;
  const descripcion = `Compara el precio de ${materiales.length} materiales de obra y reforma (${categorias.join(", ").toLowerCase()}) en ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}. Precios con IVA, actualizados cada semana, con enlace a cada producto.`;

  const tabla = categorias.map((c) => `
<tr class="cat"><th colspan="4" scope="colgroup"><a href="${rutaCat(c)}">${esc(c)}</a></th></tr>
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
  <h1>Materiales de obra al mejor precio en ${esc(zona)}</h1>
  <p class="sub">${materiales.length} materiales básicos de reforma en ${Object.values(tiendas).map((t) => t.nombre).join(" y ")}. Precios públicos con IVA, consultados el ${fechaTexto}.</p>
  <div class="cifras">
    <div><b>${victorias[0][1]} de ${comparables.length}</b><span>materiales en los que ${esc(tiendaCorta(victorias[0][0]))} tiene el mejor precio. ${victorias.slice(1).map(([t, n]) => `${esc(tiendaCorta(t))} gana en ${n}`).join(", ")}.</span></div>
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

function paginaCategoria(c) {
  const ms = materiales.filter((m) => m.categoria === c);
  const ruta = rutaCat(c);
  const raiz = "../../";
  const cMin = c[0].toLowerCase() + c.slice(1);
  const titulo = `Materiales de ${cMin} baratos: comparar precios y ofertas en ${zona} (${mesTexto})`;
  const descripcion = `${ms.length} ${ms.length === 1 ? "material" : "materiales"} de ${cMin} comparados en ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}: ${ms.slice(0, 5).map((m) => m.nombre.toLowerCase()).join(", ")} y más. Con IVA y enlace a cada producto.`;
  const filas = ms.map((m) => {
    const g = mejor(m);
    const min = Math.min(...m.ofertas.map((o) => o.precio));
    return `<tr><th scope="row"><a href="${raiz}${m.slug}/">${esc(m.nombre)}</a></th><td>${esc(m.formato)}</td><td class="num">${m.comparable === false ? "Varios" : "desde " + eur(min)}</td><td>${g ? `${esc(tiendaCorta(g.tienda))} <small>−${ahorroPct(m)} %</small>` : "—"}</td></tr>`;
  }).join("\n");
  const lista = { "@context": "https://schema.org", "@type": "ItemList", name: titulo, itemListElement: ms.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/${m.slug}/`, name: m.nombre })) };
  const migas = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: c, item: SITE + "/" + ruta }] };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › ${esc(c)}</nav>
<h1>Materiales de ${esc(cMin)} baratos en ${esc(zona)}: precios y ofertas</h1>
<p class="resumen">Te decimos dónde comprar cada material de ${esc(cMin)} al mejor precio entre ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}, con el enlace a cada producto.</p>
<p class="sub">${ms.length} materiales comparados · precios con IVA · ${fechaTexto}</p>
<div class="tabla"><table>
<thead><tr><th>Material</th><th>Formato</th><th>Precio</th><th>Más barato</th></tr></thead>
<tbody>${filas}</tbody></table></div>
${ctaReformista()}
<section><h2>Otras categorías</h2><ul class="lista">${categorias.filter((x) => x !== c).map((x) => `<li><a href="${raiz}${rutaCat(x)}">Precios de ${esc(x[0].toLowerCase() + x.slice(1))}</a></li>`).join("")}</ul></section>
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [lista, migas], raiz }) };
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
for (const c of categorias) {
  const { ruta, html } = paginaCategoria(c);
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
