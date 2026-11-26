// Genera la web estática del comparador de materiales de obra.
// Uso: node comparador-materiales/generar.mjs [carpeta-salida]
// Variables opcionales:
//   SITE_URL      URL pública final (canonical, sitemap). Sin barra final.
//   REGISTRO_URL  Página de alta de reformistas en ReformaMejor.
//   NOMBRE_WEB    Nombre de la web.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
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
// Catálogo amplio: un producto por tienda, leído de las páginas de categoría (datos/catalogo.json).
let catalogo = [];
try { catalogo = JSON.parse(readFileSync(join(aqui, "datos", "catalogo.json"), "utf8")).productos || []; } catch {}
// Fotos con licencia libre (Wikimedia Commons), opcionales: slug → {miniatura, pagina, autor, licencia}.
let imagenes = {};
try { imagenes = JSON.parse(readFileSync(join(aqui, "datos", "imagenes.json"), "utf8")); } catch {}

// Iconos propios por categoría, para los materiales que aún no tienen foto.
const ICONOS = {
  "Albañilería y morteros": '<path d="M14 22h36l-4 30H18z"/><path d="M14 22c4-6 32-6 36 0"/><path d="M22 34h20M22 42h20"/>',
  "Tabiquería seca": '<rect x="12" y="10" width="26" height="44" rx="1"/><path d="M44 10v44M50 10v44M44 16h6M44 48h6"/>',
  "Cerámica y colocación": '<rect x="10" y="10" width="20" height="20"/><rect x="34" y="10" width="20" height="20"/><rect x="10" y="34" width="20" height="20"/><rect x="34" y="34" width="20" height="20"/>',
  "Electricidad": '<rect x="14" y="14" width="36" height="36" rx="6"/><circle cx="26" cy="32" r="2.5"/><circle cx="38" cy="32" r="2.5"/><path d="M32 14v-6M32 56v-6"/>',
  "Fontanería y saneamiento": '<path d="M10 26h22a8 8 0 0 1 8 8v20"/><path d="M10 34h18v20"/><path d="M40 20h14v8H40z"/>',
  "Pintura": '<rect x="12" y="12" width="34" height="14" rx="3"/><path d="M46 19h6v12H30v8"/><rect x="26" y="39" width="8" height="15" rx="2"/>',
  "Baño y cocina": '<path d="M10 32h44v6a12 12 0 0 1-12 12H22a12 12 0 0 1-12-12z"/><path d="M16 32V16a5 5 0 0 1 10 0"/><path d="M22 50l-2 6M42 50l2 6"/>',
  "Suelos": '<path d="M8 44l24-12 24 12-24 12z"/><path d="M8 36l24-12 24 12"/><path d="M20 38l24 12M20 30l24 12" opacity=".6"/>',
  "Puertas y ventanas": '<rect x="16" y="8" width="32" height="48" rx="1"/><circle cx="41" cy="33" r="2"/><path d="M8 56h48"/>',
  "Climatización y agua caliente": '<rect x="8" y="14" width="48" height="18" rx="4"/><path d="M14 26h36M18 40c0 4 4 4 4 8s-4 4-4 8M32 40c0 4 4 4 4 8s-4 4-4 8M46 40c0 4 4 4 4 8s-4 4-4 8"/>',
  "Aislamiento": '<rect x="8" y="20" width="48" height="24" rx="2"/><path d="M8 28c6-6 10 6 16 0s10 6 16 0 10 6 16 0M8 36c6-6 10 6 16 0s10 6 16 0 10 6 16 0"/>',
  "Obra y protección": '<path d="M12 48h40M18 48V30l14-14 14 14v18"/><path d="M26 48V36h12v12"/>',
};
const icono = (c) => `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${ICONOS[c] || ICONOS["Obra y protección"]}</svg>`;
function imagen(m, raiz, grande = false) {
  const f = imagenes[m.slug];
  if (!f) return `<div class="foto sinfoto">${icono(m.categoria)}</div>`;
  return `<div class="foto"><img src="${esc(/^https?:/.test(f.miniatura) ? f.miniatura : raiz + f.miniatura)}" alt="${esc(m.nombre)}" loading="lazy" decoding="async"${grande ? "" : ' width="480" height="360"'}></div>`;
}
function credito(m) {
  const f = imagenes[m.slug];
  if (!f) return "";
  return `<p class="credito">Foto: <a href="${esc(f.pagina)}" rel="nofollow noopener" target="_blank">${esc(f.autor || "Wikimedia Commons")}</a>, ${f.licenciaUrl ? `<a href="${esc(f.licenciaUrl)}" rel="nofollow noopener" target="_blank">${esc(f.licencia)}</a>` : esc(f.licencia)}, vía Wikimedia Commons (recortada y reducida). Imagen orientativa, no es el producto exacto.</p>`;
}


const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const eur = (n) => n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const [anio, mes, dia] = fecha.split("-").map(Number);
const fechaTexto = `${dia} de ${MESES[mes - 1]} de ${anio}`;
const mesTexto = `${MESES[mes - 1]} ${anio}`;

const slugify = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const categorias = [...new Set(materiales.map((m) => m.categoria))];
// Nombres en mayúsculas de algunas tiendas → frase normal.
const bonito = (t) => (t.replace(/[^A-ZÁÉÍÓÚÑ]/g, "").length > t.replace(/[^a-záéíóúñ]/g, "").length ? t.toLowerCase().replace(/^./, (x) => x.toUpperCase()) : t);
const FORMATO = { "m²": "Precio por m²", lote: "Lote", ud: "Unidad", caja: "Caja", rollo: "Rollo", m: "Precio por metro" };
const usados = new Set();
const productos = catalogo.filter((p) => categorias.includes(p.categoria) && p.tienda in tiendas).map((p) => {
  const id = (p.enlace.match(/-(\d+)\.html$/) || [, ""])[1];
  let slug = "p/" + slugify(bonito(p.nombre)).slice(0, 60).replace(/-$/, "") + "-" + id.slice(-6);
  while (usados.has(slug)) slug += "x";
  usados.add(slug);
  return { slug, nombre: bonito(p.nombre), categoria: p.categoria, formato: FORMATO[p.unidad] || "Unidad", catalogo: true, fechaPrecio: p.fecha,
    ofertas: [{ tienda: p.tienda, producto: p.nombre, precio: p.precio, ...(p.precioM2 ? { porUnidad: eur(p.precioM2).replace(" €", " €/m²") } : {}), enlace: p.enlace }] };
});
const todos = [...materiales, ...productos];
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

const ALIAS = [
  [/Tabiquería seca/, "pladur"], [/yeso laminado|pyl/i, "pladur"], [/inodoro|cisterna/i, "wc vater water"],
  [/azulejo|porcel|cerámic|gres/i, "baldosa"], [/laminado|vinílico|parquet|tarima/i, "tarima suelo parquet"],
  [/termo|calentador|aerotermo/i, "agua caliente calentador"], [/split|aire acondicionado/i, "aire acondicionado climatizacion"],
  [/cable|manguera/i, "cableado electricidad"], [/plato de ducha|mampara|columna/i, "ducha"], [/pintura|esmalte|imprimación/i, "pintar"],
];
const alias = (m) => ALIAS.filter(([r]) => r.test(m.nombre + " " + m.categoria)).map(([, a]) => a).join(" ");
const indiceJSON = JSON.stringify(todos.map((m) => ({ s: m.slug, n: m.nombre, f: m.formato, c: m.categoria, a: alias(m), p: eur(Math.min(...m.ofertas.map((o) => o.precio))), ...(m.catalogo ? { x: 1, t: tiendaCorta(m.ofertas[0].tienda) } : {}) })));
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
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
${GSC ? `<meta name="google-site-verification" content="${esc(GSC)}">\n` : ""}
<style>${css}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body>
<header class="barra"><div class="ancho">
  <a class="marca" href="${raiz}"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1f5fd6"/><path d="M8 20l5-9 4 6 3-4 4 7z" fill="#ffc93c"/><path d="M8 23h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>${esc(NOMBRE)}</a>
  <span class="lema">Compara precios de materiales de obra en ${esc(zona)}</span>
  <form class="busca" role="search" action="${raiz}cesta/" method="get" autocomplete="off"><label class="oculto" for="busca-q">Buscar material</label><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="busca-q" name="q" type="search" placeholder="¿Qué material necesitas? Ej.: cemento, cable, pintura…"><button type="submit">Buscar</button><div class="busca-res" hidden></div></form>
  <a class="mi-cesta" href="${raiz}cesta/"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h11l2-8H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>Mi cesta <span class="cesta-n" hidden></span></a>
</div>
<nav class="cats" aria-label="Categorías"><div class="ancho"><a class="destacado" href="${raiz}comparativa/">Comparar tiendas</a>${categorias.map((c) => `<a href="${raiz}${rutaCat(c)}">${esc(c)}</a>`).join("")}</div></nav>
</header>
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
<script>
(function(){var c={};try{c=JSON.parse(localStorage.getItem("cm-cesta")||"{}")}catch(e){}
var n=0;for(var k in c)n+=c[k]>0?1:0;document.querySelectorAll(".cesta-n").forEach(function(e){e.textContent=n;e.hidden=!n});
var el={};try{el=JSON.parse(localStorage.getItem("cm-cesta-tienda")||"{}")}catch(e){}
var pintaAdd=function(){document.querySelectorAll("[data-add]").forEach(function(b){var s=b.getAttribute("data-add"),t=b.getAttribute("data-tienda");if(t)b.textContent=c[s]&&el[s]===t?"✓ En tu cesta ("+c[s]+")":"+ Añadir a la cesta";else b.textContent=c[s]?"✓ En tu cesta ("+c[s]+")":"+ Añadir a mi cesta"})};pintaAdd();
document.querySelectorAll("[data-add]").forEach(function(b){var s=b.getAttribute("data-add"),t=b.getAttribute("data-tienda");
b.addEventListener("click",function(){try{c=JSON.parse(localStorage.getItem("cm-cesta")||"{}")}catch(x){}try{el=JSON.parse(localStorage.getItem("cm-cesta-tienda")||"{}")}catch(x){}c[s]=(c[s]||0)+1;if(t)el[s]=t;try{localStorage.setItem("cm-cesta",JSON.stringify(c));localStorage.setItem("cm-cesta-tienda",JSON.stringify(el))}catch(e){}pintaAdd();var n=0;for(var k in c)n+=c[k]>0?1:0;document.querySelectorAll(".cesta-n").forEach(function(e){e.textContent=n;e.hidden=!n})})});
var R="${raiz}",I=[],cargando=null;
var nor=function(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")};
var carga=function(){if(!cargando)cargando=fetch(R+"indice.json").then(function(r){return r.json()}).then(function(d){I=d;I.forEach(function(m){m.nk=nor(m.n+" "+(m.a||""));m.k=nor(m.n+" "+m.f+" "+m.c+" "+(m.a||""))})}).catch(function(){});return cargando};
var busca=function(t){var w=nor(t).split(/\s+/).filter(Boolean);if(!w.length)return[];var r=I.filter(function(m){return w.every(function(x){return m.k.indexOf(x)>=0})});var en=function(m){return w.every(function(x){return m.nk.indexOf(x)>=0})?0:2};r.sort(function(a,b){return (en(a)+(a.x?1:0))-(en(b)+(b.x?1:0))});return r.slice(0,10)};
var cuenta=function(){var n=0;for(var k in c)n+=c[k]>0?1:0;document.querySelectorAll(".cesta-n").forEach(function(e){e.textContent=n;e.hidden=!n})};
document.querySelectorAll(".busca").forEach(function(f){var q=f.querySelector("input"),res=f.querySelector(".busca-res");
var pinta=function(){if(!I.length){carga().then(function(){if(I.length)pinta()});return}var r=busca(q.value);if(!q.value.trim()){res.hidden=true;return}
res.innerHTML=r.length?r.map(function(m){return '<div class="br"><a href="'+R+m.s+'/"><b>'+m.n+'</b><small>'+m.f+' · desde '+m.p+'</small></a><button type="button" data-s="'+m.s+'">'+(c[m.s]?"✓ En cesta":"+ Cesta")+'</button></div>'}).join("")+'<a class="br-todo" href="'+R+'cesta/?q='+encodeURIComponent(q.value)+'">Ver mi cesta y comparar tiendas →</a>':'<p class="br-nada">No tenemos «'+q.value.replace(/[<>&"]/g,"")+'» todavía. Prueba con otra palabra.</p>';res.hidden=false};
q.addEventListener("input",pinta);q.addEventListener("focus",pinta);
res.addEventListener("click",function(e){var b=e.target.closest("button[data-s]");if(!b)return;var s=b.getAttribute("data-s");try{c=JSON.parse(localStorage.getItem("cm-cesta")||"{}")}catch(x){}c[s]=(c[s]||0)+1;try{localStorage.setItem("cm-cesta",JSON.stringify(c))}catch(x){}b.textContent="✓ En cesta";cuenta();document.dispatchEvent(new Event("cm-cesta"))});
f.addEventListener("submit",function(e){if(!I.length)return;var r=busca(q.value);if(r.length===1){e.preventDefault();location.href=R+r[0].s+"/"}});
document.addEventListener("click",function(e){if(!f.contains(e.target))res.hidden=true});
q.addEventListener("keydown",function(e){if(e.key==="Escape")res.hidden=true});
});
document.querySelectorAll("[data-buscar]").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();var g=document.querySelector(".busca.grande input");g.value=a.getAttribute("data-buscar");g.focus();g.dispatchEvent(new Event("input"))})});
})();
</script>
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

function filaOferta(o, ganador, slug) {
  const t = tiendas[o.tienda];
  const gana = ganador && ganador === o;
  return `<tr${gana ? ' class="gana"' : ""}>
  <th scope="row">${esc(t.nombre)}${gana ? ' <span class="chip">Más barato</span>' : ""}</th>
  <td>${esc(o.producto)}${o.nota ? `<small>${esc(o.nota)}</small>` : ""}</td>
  <td class="num">${eur(o.precio)}${o.porUnidad ? `<small>${esc(o.porUnidad)}</small>` : ""}</td>
  <td class="acc-t">${slug ? `<button type="button" class="t-add peq" data-add="${esc(slug)}" data-tienda="${esc(o.tienda)}">+ Añadir a la cesta</button>` : ""}<a href="${esc(o.enlace)}" rel="nofollow noopener" target="_blank">Ver en la web</a></td>
</tr>`;
}

function tarjeta(m, raiz) {
  const g = mejor(m);
  const min = Math.min(...m.ofertas.map((o) => o.precio));
  return `<li class="tarjeta"><a href="${raiz}${m.slug}/">
  ${imagen(m, raiz)}
  <span class="t-nombre">${esc(m.nombre)}</span>
  <span class="t-formato">${esc(m.formato)}</span>
  <span class="t-precio">${m.comparable === false ? `<small>Formatos distintos</small>` : `<small>desde</small> ${eur(min)}`}</span>
  ${g ? `<span class="t-gana">Más barato en ${esc(tiendaCorta(g.tienda))} · −${ahorroPct(m)}&nbsp;%</span>` : `<span class="t-gana neutro">${m.ofertas.length} ${m.ofertas.length === 1 ? "almacén" : "almacenes"}</span>`}
</a><button type="button" class="t-add" data-add="${esc(m.slug)}">+ Añadir a mi cesta</button></li>`;
}
const rejilla = (ms, raiz) => `<ul class="rejilla">${ms.map((m) => tarjeta(m, raiz)).join("")}</ul>`;

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
<section class="ficha">
<div class="ficha-foto">${imagen(m, raiz, true)}${credito(m)}</div>
<div class="ficha-info">
<h1>${esc(m.nombre)}</h1>
<p class="sub">${esc(m.formato)} · precios con IVA en ${esc(zona)} · ${fechaTexto}</p>
<p class="ficha-precio">${m.comparable === false ? `<small>Formatos distintos</small>` : `<small>desde</small> ${eur(Math.min(...precios))}`}</p>
${g ? `<p class="resumen">El más barato hoy es <b>${esc(tiendas[g.tienda].nombre)}</b> con <b>${eur(g.precio)}</b>${pct ? `, un ${pct} % menos que el más caro` : ""}.</p>` : m.comparable === false ? `<p class="resumen">Los formatos no son iguales entre almacenes, así que aquí no marcamos ganador: compara por lo que cubre cada uno.</p>` : m.ofertas.length > 1 ? `<p class="resumen">Hoy cuesta lo mismo en los dos almacenes: <b>${eur(m.ofertas[0].precio)}</b>. Fíjate en lo que incluye cada uno.</p>` : `<p class="resumen">Solo hemos encontrado precio público en un almacén para este producto.</p>`}
<div class="acciones">${g ? `<a class="boton" href="${esc(g.enlace)}" rel="nofollow noopener" target="_blank">Ver en ${esc(tiendaCorta(g.tienda))} →</a>` : ""}<button type="button" class="boton secundario" data-add="${esc(m.slug)}">+ Añadir a mi cesta</button><a class="ver-cesta" href="${raiz}cesta/">Ver mi cesta</a></div>
</div>
</section>
<h2>Mejor precio de ${esc(nombreMin)} hoy${hayOferta ? " (con oferta)" : ""}</h2>
<div class="tabla"><table class="ofertas">
<thead><tr><th>Almacén</th><th>Producto</th><th>Precio</th><th></th></tr></thead>
<tbody>
${m.ofertas.map((o) => filaOferta(o, g, m.slug)).join("\n")}
</tbody></table></div>
<section class="consejo"><h2>Cuánto necesitas</h2><p>${esc(m.consejo)} <span class="nota">Dato orientativo: tu reformista lo ajusta a tu obra.</span></p></section>
${ctaReformista()}
<section class="faq"><h2>Preguntas frecuentes</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>
${otros.length ? `<section><h2>Más precios de ${esc(m.categoria.toLowerCase())}</h2>${rejilla(otros, raiz)}</section>` : ""}
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
  const descripcion = `Compara el precio de ${materiales.length} materiales de obra y reforma en ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}: albañilería, electricidad, fontanería, pintura, cerámica y más. Precios con IVA, actualizados cada semana, con enlace a cada producto.`;

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
  <form class="busca grande" role="search" action="cesta/" method="get" autocomplete="off"><label class="oculto" for="busca-portada">Buscar material</label><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="busca-portada" name="q" type="search" placeholder="Escribe el material que necesitas…"><button type="submit">Buscar</button><div class="busca-res" hidden></div></form>
  <p class="sugerencias">Lo más buscado: ${["cemento", "pladur", "cable", "azulejo", "pintura", "plato de ducha", "inodoro", "laminado"].map((t) => `<a href="cesta/?q=${encodeURIComponent(t)}" data-buscar="${t}">${t}</a>`).join("")}</p>
  <p class="sub">${materiales.length} materiales básicos de reforma en ${Object.values(tiendas).map((t) => t.nombre).join(" y ")}. Precios públicos con IVA, consultados el ${fechaTexto}.</p>
  <div class="cifras">
    <div><b>${victorias[0][1]} de ${comparables.length}</b><span>materiales en los que ${esc(tiendaCorta(victorias[0][0]))} tiene el mejor precio. ${victorias.slice(1).map(([t, n]) => `${esc(tiendaCorta(t))} gana en ${n}`).join(", ")}.</span></div>
    <div><b>${(materiales.length + productos.length).toLocaleString("es-ES")}</b><span>productos con precio y enlace directo a la ficha de cada tienda${productos.length ? `: ${materiales.length} comparados entre tiendas y ${productos.length.toLocaleString("es-ES")} más en el catálogo` : ""}.</span></div>
  </div>
</section>
<div class="avisos"><a class="aviso-comp" href="comparativa/"><b>¿Qué tienda es más barata?</b><span>Comparativa entre almacenes por categorías y con la cesta completa →</span></a><a class="aviso-comp" href="cesta/"><b>Haz tu cesta de la compra</b><span>Elige materiales y cantidades y te decimos dónde te sale más barata →</span></a></div>
<nav class="atajos">${categorias.map((c) => `<a href="${rutaCat(c)}">${icono(c)}<span>${esc(c)}</span></a>`).join("")}</nav>
${categorias.map((c, i) => `<section class="bloque"><div class="bloque-cab"><h2>${esc(c)}</h2><a href="${rutaCat(c)}">Ver todo →</a></div>${rejilla(materiales.filter((m) => m.categoria === c), "")}</section>${i === 2 ? ctaReformista() : ""}`).join("\n")}
<section class="consejo">
  <h2>Cómo leemos los precios</h2>
  <ul>
    <li>Tomamos el precio que muestra la web de cada almacén, con IVA, el día indicado. Cada almacén pide elegir tienda y el precio puede variar entre tiendas.</li>
    <li>En Obramat algunos precios son de compra por cantidad; comprando el palé completo se ahorra un 5 % adicional.</li>
    <li>Saltoki solo muestra precios a clientes profesionales con cuenta, por eso no aparece. Brico Depôt está pendiente de añadir.</li>
    <li>Cuando el producto no es idéntico, indicamos marca y formato para que compares lo mismo.</li>
    <li>El catálogo amplio recoge el precio que muestra cada tienda en sus páginas de categoría. A veces la ficha del producto tiene una oferta más reciente: confirma siempre el precio en el enlace.</li>
  </ul>
</section>
`;
  return pagina({ titulo, descripcion, ruta: "", cuerpo, jsonld: [web, lista], raiz: "./" });
}

function paginaComparativa() {
  const ids = Object.keys(tiendas);
  const raiz = "../";
  const ruta = "comparativa/";
  const nombres = ids.map(tiendaCorta);
  // Solo materiales comparables con precio en todos los almacenes.
  const ambos = materiales.filter((m) => m.comparable !== false && ids.every((t) => m.ofertas.some((o) => o.tienda === t)));
  const precio = (m, t) => m.ofertas.find((o) => o.tienda === t).precio;
  const ganador = (m) => { const ps = ids.map((t) => precio(m, t)); const min = Math.min(...ps); return ps.filter((p) => p === min).length > 1 ? null : ids[ps.indexOf(min)]; };
  const resumen = (ms) => {
    const r = { n: ms.length, gana: Object.fromEntries(ids.map((t) => [t, 0])), empates: 0, total: Object.fromEntries(ids.map((t) => [t, 0])), optimo: 0 };
    for (const m of ms) { const g = ganador(m); g ? r.gana[g]++ : r.empates++; for (const t of ids) r.total[t] += precio(m, t); r.optimo += Math.min(...ids.map((t) => precio(m, t))); }
    return r;
  };
  const tot = resumen(ambos);
  const orden = [...ids].sort((a, b) => tot.total[a] - tot.total[b]);
  const barata = orden[0], cara = orden[orden.length - 1];
  const pctCesta = Math.round(((tot.total[cara] - tot.total[barata]) / tot.total[cara]) * 100);
  const lider = [...ids].sort((a, b) => tot.gana[b] - tot.gana[a])[0];
  const barra = (r) => `<div class="barra-gana" role="img" aria-label="${ids.map((t) => `${tiendaCorta(t)} gana en ${r.gana[t]}`).join(", ")}${r.empates ? `, ${r.empates} empates` : ""}">${ids.map((t, i) => r.gana[t] ? `<span class="t${i}" style="flex:${r.gana[t]}">${r.gana[t]}</span>` : "").join("")}${r.empates ? `<span class="emp" style="flex:${r.empates}">${r.empates}</span>` : ""}</div>`;
  const filasCat = categorias.map((c) => {
    const ms = ambos.filter((m) => m.categoria === c);
    if (!ms.length) return "";
    const r = resumen(ms);
    const o = [...ids].sort((a, b) => r.total[a] - r.total[b]);
    const pct = Math.round(((r.total[o[o.length - 1]] - r.total[o[0]]) / r.total[o[o.length - 1]]) * 100);
    return `<tr><th scope="row"><a href="${raiz}${rutaCat(c)}">${esc(c)}</a><small>${r.n} materiales</small></th>${ids.map((t) => `<td class="num">${eur(r.total[t])}</td>`).join("")}<td>${pct ? `<b>${esc(tiendaCorta(o[0]))}</b> <small>${pct} % más barata</small>` : "Prácticamente igual"}</td><td class="col-barra">${barra(r)}</td></tr>`;
  }).join("\n");
  const filasMat = ambos.map((m) => {
    const g = ganador(m);
    const ps = ids.map((t) => precio(m, t));
    const dif = Math.max(...ps) - Math.min(...ps);
    return `<tr><th scope="row"><a href="${raiz}${m.slug}/">${esc(m.nombre)}</a><small>${esc(m.formato)}</small></th>${ids.map((t) => `<td class="num${g === t ? " barato" : ""}">${eur(precio(m, t))}</td>`).join("")}<td class="num">${dif ? eur(dif) : "—"}</td><td>${g ? esc(tiendaCorta(g)) : "Empate"}</td></tr>`;
  }).join("\n");
  const titulo = `${nombres.join(" vs ")}: ¿dónde son más baratos los materiales de obra? (${mesTexto})`;
  const descripcion = `Comparativa de precios entre ${nombres.join(" y ")} en ${zona} con ${ambos.length} materiales de reforma: quién gana en cada categoría, cesta de la compra y diferencia material a material.`;
  const migas = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: "Comparativa de almacenes", item: SITE + "/" + ruta }] };
  const faq = [
    [`¿Qué es más barato, ${nombres.join(" u ")}?`, `En nuestra comparativa de ${ambos.length} materiales de obra en ${zona}, ${tiendaCorta(lider)} tiene el mejor precio en ${tot.gana[lider]}. Comprando la misma cesta, ${tiendaCorta(barata)} sale un ${pctCesta} % más barata (${eur(tot.total[barata])} frente a ${eur(tot.total[cara])}).`],
    [`¿Merece la pena comprar en los dos almacenes?`, `Si compras cada material donde está más barato, la cesta cuesta ${eur(tot.optimo)}: ${eur(tot.total[barata] - tot.optimo)} menos que comprándolo todo en ${tiendaCorta(barata)}. Para compras pequeñas suele compensar más ir a un solo almacén.`],
  ];
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › Comparativa de almacenes</nav>
<section class="hero">
  <h1>${esc(nombres.join(" vs "))}: ¿dónde es más barato reformar?</h1>
  <p class="sub">${ambos.length} materiales con precio en los dos almacenes de ${esc(zona)}. Precios públicos con IVA, consultados el ${fechaTexto}.</p>
  <div class="cifras">
    <div><b>${tot.gana[lider]} de ${ambos.length}</b><span>materiales en los que ${esc(tiendaCorta(lider))} tiene el mejor precio. ${ids.filter((t) => t !== lider).map((t) => `${esc(tiendaCorta(t))} gana en ${tot.gana[t]}`).join(", ")}${tot.empates ? ` y ${tot.empates} empatan` : ""}.</span></div>
    <div><b>${pctCesta} %</b><span>más barata la cesta completa en ${esc(tiendaCorta(barata))}: ${eur(tot.total[barata])} frente a ${eur(tot.total[cara])}.</span></div>
    <div><b>${eur(tot.optimo)}</b><span>si compras cada material en el almacén más barato (${eur(tot.total[barata] - tot.optimo)} menos que todo en ${esc(tiendaCorta(barata))}).</span></div>
  </div>
  <div class="leyenda">${ids.map((t, i) => `<span><i class="t${i}"></i>${esc(tiendaCorta(t))}</span>`).join("")}<span><i class="emp"></i>Empate</span></div>
  ${barra(tot)}
</section>
<section class="bloque"><h2>Quién gana en cada categoría</h2>
<p class="sub">Cesta de la categoría: suma de un formato de cada material comparable. La barra muestra en cuántos materiales gana cada almacén.</p>
<div class="tabla"><table class="comparativa">
<thead><tr><th>Categoría</th>${nombres.map((n) => `<th>${esc(n)}</th>`).join("")}<th>Más barata</th><th>Materiales ganados</th></tr></thead>
<tbody>${filasCat}</tbody></table></div></section>
${ctaReformista()}
<section class="bloque"><h2>Material a material</h2>
<div class="tabla"><table class="comparativa">
<thead><tr><th>Material</th>${nombres.map((n) => `<th>${esc(n)}</th>`).join("")}<th>Diferencia</th><th>Más barato</th></tr></thead>
<tbody>${filasMat}</tbody></table></div></section>
<section class="consejo"><h2>Cómo leer esta comparativa</h2><ul>
  <li>Solo entran los materiales con precio público en los dos almacenes y formatos comparables (${materiales.length - ambos.length} de ${materiales.length} se quedan fuera).</li>
  <li>No siempre es el mismo producto: comparamos el equivalente más parecido de cada almacén, y a veces cambia la marca o la gama. Lo explicamos en la ficha de cada material.</li>
  <li>En Obramat el precio puede variar según la tienda elegida y bajar comprando por palé; en Leroy Merlin, por promociones del día.</li>
  <li>Los materiales grandes (aire acondicionado, calentador, puertas) pesan mucho en la cesta; por eso también contamos en cuántos materiales gana cada uno.</li>
</ul></section>
<section class="faq"><h2>Preguntas frecuentes</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [migas, faqLd], raiz }) };
}

function paginaCesta() {
  const raiz = "../";
  const ruta = "cesta/";
  const ids = Object.keys(tiendas);
  const datosCesta = {
    tiendas: Object.fromEntries(ids.map((t) => [t, tiendaCorta(t)])),
    materiales: todos.map((m) => ({ s: m.slug, n: m.nombre, f: m.formato, c: m.categoria, x: m.comparable === false ? 1 : 0, ...(m.catalogo ? { k: 1 } : {}), o: Object.fromEntries(m.ofertas.map((o) => [o.tienda, [o.precio, o.enlace]])) })),
  };
  const titulo = `Cesta de la compra de materiales de obra: ¿dónde te sale más barata? (${mesTexto})`;
  const descripcion = `Elige los materiales de tu reforma y las cantidades y compara el total en ${ids.map(tiendaCorta).join(" y ")}. Te decimos qué tienda sale más barata y cuánto ahorras comprando cada material en la más barata.`;
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › Mi cesta</nav>
<section class="hero">
  <h1>Tu cesta de la compra de materiales</h1>
  <p class="sub">Añade materiales y cantidades. Calculamos el total en cada tienda con precios con IVA del ${fechaTexto}. La cesta se guarda solo en tu navegador.</p>
</section>
<div class="cesta">
  <section class="cesta-sel" aria-labelledby="t-sel">
    <h2 id="t-sel">Tu cesta</h2>
    <div id="cesta-vacia" class="nota">Todavía no has añadido nada. Busca materiales abajo y pulsa «Añadir».</div>
    <ul id="cesta-lista" class="cesta-lista"></ul>
    <p id="pt-ayuda" class="nota pt-ayuda" hidden>Toca una tienda en cada material para elegir dónde comprarlo.</p>
    <button type="button" id="cesta-vaciar" class="enlace-btn" hidden>Vaciar la cesta</button>
  </section>
  <aside class="cesta-res" aria-live="polite" aria-labelledby="t-res">
    <h2 id="t-res">¿Dónde te sale más barata?</h2>
    <div id="cesta-totales"><p class="nota">Añade materiales para ver el total en cada tienda.</p></div>
  </aside>
</div>
<section class="bloque">
  <div class="bloque-cab"><h2>Añadir materiales</h2></div>
  <label class="buscador"><span>Buscar material</span><input id="cesta-buscar" type="search" placeholder="Ej.: cemento, cable, pintura…" autocomplete="off"></label>
  <div id="cesta-catalogo" class="cesta-catalogo"></div>
</section>
<p class="nota">Los precios son orientativos: cambian según la tienda física elegida y las ofertas del día. Cuando los formatos no son iguales entre tiendas (por ejemplo, rollos de distinta longitud) lo avisamos en la línea.</p>
${ctaReformista()}
<script id="datos-cesta" type="application/json">${JSON.stringify(datosCesta).replace(/</g, "\\u003c")}</script>
<script>
(function(){
var D=JSON.parse(document.getElementById("datos-cesta").textContent);
var M={};D.materiales.forEach(function(m){M[m.s]=m});
var ids=Object.keys(D.tiendas);
var c={};try{c=JSON.parse(localStorage.getItem("cm-cesta")||"{}")}catch(e){}
var el={};try{el=JSON.parse(localStorage.getItem("cm-cesta-tienda")||"{}")}catch(e){}
function guarda(){for(var k in el)if(!c[k])delete el[k];try{localStorage.setItem("cm-cesta",JSON.stringify(c));localStorage.setItem("cm-cesta-tienda",JSON.stringify(el))}catch(e){}var n=0;for(var k in c)n+=c[k]>0?1:0;document.querySelectorAll(".cesta-n").forEach(function(e){e.textContent=n;e.hidden=!n})}
function eur(n){return n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML}
function minT(m){var b=null;ids.forEach(function(t){if(m.o[t]&&(b===null||m.o[t][0]<m.o[b][0]))b=t});return b}
function pinta(){
  var sl=Object.keys(c).filter(function(s){return M[s]&&c[s]>0});
  var L=document.getElementById("cesta-lista");L.innerHTML="";
  document.getElementById("cesta-vacia").hidden=sl.length>0;document.getElementById("cesta-vaciar").hidden=!sl.length;document.getElementById("pt-ayuda").hidden=!sl.length;
  var tot={},falta={},faltan={},mix=0,mixPor={},aviso=false,eTot=0,eN=0,ePor={};ids.forEach(function(t){tot[t]=0;falta[t]=0;faltan[t]=[];mixPor[t]=0});
  sl.forEach(function(s){var m=M[s],q=c[s],b=minT(m);if(m.x)aviso=true;
    ids.forEach(function(t){if(m.o[t])tot[t]+=m.o[t][0]*q;else{falta[t]++;faltan[t].push(m.n)}});
    mix+=m.o[b][0]*q;mixPor[b]++;var e=el[s]&&m.o[el[s]]?el[s]:null;if(e){eN++;eTot+=m.o[e][0]*q;ePor[e]=(ePor[e]||0)+1}else{eTot+=m.o[b][0]*q;ePor[b]=(ePor[b]||0)+1}
    var li=document.createElement("li");
    li.innerHTML='<div><a href="../'+s+'/">'+esc(m.n)+'</a><small>'+esc(m.f)+(m.x?' · formatos distintos según la tienda':'')+'</small><small class="por-tienda">'+ids.map(function(t){return m.o[t]?'<span class="pt-g"><button type="button" data-el="'+t+'" title="Comprar en '+esc(D.tiendas[t])+'" class="pt'+(t===b&&Object.keys(m.o).length>1?' pt-gana':'')+(el[s]===t?' pt-el':'')+'">'+(el[s]===t?'✓ ':'')+esc(D.tiendas[t])+': '+eur(m.o[t][0])+'</button>'+'<a class="pt-ir" href="'+esc(m.o[t][1])+'" target="_blank" rel="nofollow noopener" title="Ver en la web de '+esc(D.tiendas[t])+'">Ver en web ↗</a></span>':'<span class="pt-no">'+esc(D.tiendas[t])+': no lo tiene</span>'}).join('')+'</small></div>'+
      '<div class="cant"><button type="button" aria-label="Quitar uno" data-q="-1">−</button><input type="number" min="0" inputmode="numeric" value="'+q+'" aria-label="Cantidad de '+esc(m.n)+'"><button type="button" aria-label="Añadir uno" data-q="1">+</button></div>';
    li.querySelectorAll("button[data-el]").forEach(function(bt){bt.onclick=function(){var t=bt.dataset.el;if(el[s]===t)delete el[s];else el[s]=t;guarda();pinta()}});
    li.querySelectorAll("button[data-q]").forEach(function(bt){bt.onclick=function(){c[s]=Math.max(0,(c[s]||0)+(+bt.dataset.q));if(!c[s])delete c[s];guarda();pinta()}});
    li.querySelector("input").onchange=function(e){var v=Math.max(0,Math.round(+e.target.value||0));if(v)c[s]=v;else delete c[s];guarda();pinta()};
    L.appendChild(li)});
  var R=document.getElementById("cesta-totales");
  if(!sl.length){R.innerHTML='<p class="nota">Añade materiales para ver el total en cada tienda.</p>';return}
  var completas=ids.filter(function(t){return !falta[t]}).sort(function(a,b){return tot[a]-tot[b]});
  var h='<h3 class="tot-t">Comprándolo todo en una tienda</h3><ul class="totales">';
  ids.slice().sort(function(a,b){return (falta[a]-falta[b])||(tot[a]-tot[b])}).forEach(function(t){
    var gana=completas.length&&completas[0]===t;
    h+='<li class="'+(gana?'gana':'')+(falta[t]===sl.length?' vacia':'')+'"><span>Todo en '+esc(D.tiendas[t])+(gana?' <em>Más barata</em>':'')+(falta[t]?'<small>'+(falta[t]===sl.length?'No tiene ninguno de tus materiales':'Sin '+falta[t]+' de tus '+sl.length+' materiales: '+faltan[t].slice(0,3).map(function(n){return esc(n.length>40?n.slice(0,38)+'…':n)}).join(', ')+(falta[t]>3?'…':''))+'</small>':'<small>Tiene los '+sl.length+' materiales</small>')+'</span><b>'+(falta[t]===sl.length?'—':(falta[t]?'<small>parcial</small> ':'')+eur(tot[t]))+'</b></li>'});
  h+='</ul>';
  if(eN)h+='<h3 class="tot-t">Con las tiendas que has elegido</h3><div class="mixta elegida"><span>'+(eN<sl.length?eN+' de '+sl.length+' materiales en la tienda que elegiste, el resto donde es más barato':'Cada material en la tienda que has elegido')+'<small>'+ids.filter(function(t){return ePor[t]}).map(function(t){return ePor[t]+' en '+esc(D.tiendas[t])}).join(" y ")+'</small></span><b>'+eur(eTot)+'</b></div>';
  h+='<h3 class="tot-t">Mezclando tiendas</h3>';
  var mejorUna=completas.length?tot[completas[0]]:null;
  h+='<div class="mixta"><span>Comprando cada material donde es más barato<small>'+ids.filter(function(t){return mixPor[t]}).map(function(t){return mixPor[t]+' en '+esc(D.tiendas[t])}).join(" y ")+'</small></span><b>'+eur(mix)+'</b></div>';
  if(mejorUna!==null&&mejorUna-mix>0.005)h+='<p class="nota">Repartiendo la compra ahorras '+eur(mejorUna-mix)+' frente a comprarlo todo en '+esc(D.tiendas[completas[0]])+'.</p>';
  if(completas.length>1)h+='<p class="nota">'+esc(D.tiendas[completas[0]])+' te ahorra '+eur(tot[completas[completas.length-1]]-tot[completas[0]])+' frente a '+esc(D.tiendas[completas[completas.length-1]])+'.</p>';
  if(aviso)h+='<p class="nota">Ojo: algún material tiene formatos distintos según la tienda, así que su total no es exactamente comparable.</p>';
  R.innerHTML=h}
function catalogo(q){
  q=(q||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  var C=document.getElementById("cesta-catalogo"),h="",cat="";
  var w=q.split(/\s+/).filter(Boolean),cuantos=0;
  D.materiales.forEach(function(m){if(!w.length&&m.k)return;var txt=(m.n+" "+m.c).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(w.length&&!w.every(function(x){return txt.indexOf(x)>=0}))return;if(++cuantos>120)return;
    if(m.c!==cat){if(cat)h+='</ul>';cat=m.c;h+='<h3>'+esc(cat)+'</h3><ul class="cat-lista">'}
    var b=minT(m);h+='<li><span>'+esc(m.n)+'<small>'+esc(m.f)+' · desde '+eur(m.o[b][0])+'</small></span><button type="button" class="boton secundario peq" data-s="'+m.s+'">Añadir</button></li>'});
  if(cat)h+='</ul>';C.innerHTML=h||'<p class="nota">No hay materiales con ese nombre.</p>';
  C.querySelectorAll("button[data-s]").forEach(function(bt){bt.onclick=function(){var s=bt.dataset.s;c[s]=(c[s]||0)+1;guarda();pinta();bt.textContent="✓ Añadido ("+c[s]+")"}})}
document.getElementById("cesta-buscar").oninput=function(e){catalogo(e.target.value)};
document.addEventListener("cm-cesta",function(){try{c=JSON.parse(localStorage.getItem("cm-cesta")||"{}")}catch(e){}pinta()});
document.getElementById("cesta-vaciar").onclick=function(){c={};el={};guarda();pinta()};
catalogo("");pinta();
var q0=new URLSearchParams(location.search).get("q");if(q0){var ib=document.getElementById("cesta-buscar");ib.value=q0;catalogo(q0)}
})();
</script>
`;
  const web = { "@context": "https://schema.org", "@type": "WebPage", name: titulo, url: SITE + "/" + ruta };
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [web], raiz }) };
}

function paginaProducto(m) {
  const o = m.ofertas[0];
  const t = tiendaCorta(o.tienda);
  const ruta = `${m.slug}/`;
  const raiz = "../../";
  const [a, me, d] = m.fechaPrecio.split("-").map(Number);
  const fechaP = `${d} de ${MESES[me - 1]} de ${a}`;
  const titulo = `${m.nombre}: precio en ${t} (${MESES[me - 1]} ${a})`;
  const descripcion = `${m.nombre} a ${eur(o.precio)} con IVA en ${t}. Compáralo con productos parecidos de otras tiendas y con los ${materiales.filter((x) => x.categoria === m.categoria).length} materiales de ${m.categoria.toLowerCase()} que comparamos en ${zona}.`;
  const pal = new Set(slugify(m.nombre).split("-").filter((x) => x.length > 2 && !/^\d+$/.test(x)));
  const parecido = (x) => slugify(x.nombre).split("-").filter((y) => pal.has(y)).length;
  const alternativas = productos.filter((x) => x.categoria === m.categoria && x.ofertas[0].tienda !== o.tienda).map((x) => [x, parecido(x)]).filter(([, n]) => n > 0).sort((p, q) => q[1] - p[1] || p[0].ofertas[0].precio - q[0].ofertas[0].precio).slice(0, 8).map(([x]) => x);
  const comparados = materiales.filter((x) => x.categoria === m.categoria).map((x) => [x, parecido(x)]).sort((p, q) => q[1] - p[1]).slice(0, 4).map(([x]) => x);
  const producto = { "@context": "https://schema.org", "@type": "Product", name: m.nombre, category: m.categoria, description: descripcion,
    offers: { "@type": "Offer", price: o.precio.toFixed(2), priceCurrency: "EUR", url: o.enlace, seller: { "@type": "Organization", name: tiendas[o.tienda].nombre } } };
  const migas = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: m.categoria, item: SITE + "/" + rutaCat(m.categoria) },
    { "@type": "ListItem", position: 3, name: m.nombre, item: SITE + "/" + ruta }] };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › <a href="${raiz}${rutaCat(m.categoria)}">${esc(m.categoria)}</a></nav>
<section class="ficha">
<div class="ficha-foto">${imagen(m, raiz, true)}</div>
<div class="ficha-info">
<h1>${esc(m.nombre)}</h1>
<p class="sub">${esc(tiendas[o.tienda].nombre)} · ${esc(m.formato)} · precio con IVA consultado el ${fechaP}</p>
<p class="ficha-precio">${eur(o.precio)}${o.porUnidad ? `<small> · ${esc(o.porUnidad)}</small>` : ""}</p>
<p class="resumen">Precio público de la web de ${esc(t)}. Puede cambiar según la tienda elegida; confírmalo en el enlace antes de comprar.</p>
<div class="acciones"><a class="boton" href="${esc(o.enlace)}" rel="nofollow noopener" target="_blank">Ver en ${esc(t)} →</a><button type="button" class="boton secundario" data-add="${esc(m.slug)}">+ Añadir a mi cesta</button><a class="ver-cesta" href="${raiz}cesta/">Ver mi cesta</a></div>
</div>
</section>
${alternativas.length ? `<section><h2>Parecidos en otras tiendas</h2>${listaProductos(alternativas, raiz)}</section>` : ""}
${comparados.length ? `<section><h2>Materiales de ${esc(m.categoria.toLowerCase())} comparados entre tiendas</h2>${rejilla(comparados, raiz)}</section>` : ""}
${ctaReformista()}
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [producto, migas], raiz }) };
}

function listaProductos(ps, raiz) {
  return `<ul class="prod-lista">${ps.map((m) => { const o = m.ofertas[0]; return `<li data-n="${esc(slugify(m.nombre).replace(/-/g, " "))}"><a href="${raiz}${m.slug}/"><span class="pl-n">${esc(m.nombre)}</span><span class="pl-t">${esc(tiendaCorta(o.tienda))} · ${esc(m.formato)}</span></a><b class="pl-p">${eur(o.precio)}</b><button type="button" class="t-add peq" data-add="${esc(m.slug)}">+ Cesta</button></li>`; }).join("")}</ul>`;
}

function paginaCategoria(c) {
  const ms = materiales.filter((m) => m.categoria === c);
  const ps = productos.filter((m) => m.categoria === c).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const ruta = rutaCat(c);
  const raiz = "../../";
  const cMin = c[0].toLowerCase() + c.slice(1);
  const titulo = `Materiales de ${cMin} baratos: comparar precios y ofertas en ${zona} (${mesTexto})`;
  const descripcion = `${ms.length} ${ms.length === 1 ? "material" : "materiales"} de ${cMin} comparados en ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}: ${ms.slice(0, 5).map((m) => m.nombre.toLowerCase()).join(", ")} y más. Con IVA y enlace a cada producto.`;
  const lista = { "@context": "https://schema.org", "@type": "ItemList", name: titulo, itemListElement: ms.map((m, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/${m.slug}/`, name: m.nombre })) };
  const migas = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: c, item: SITE + "/" + ruta }] };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › ${esc(c)}</nav>
<h1>Materiales de ${esc(cMin)} baratos en ${esc(zona)}: precios y ofertas</h1>
<p class="resumen">Te decimos dónde comprar cada material de ${esc(cMin)} al mejor precio entre ${Object.keys(tiendas).map(tiendaCorta).join(" y ")}, con el enlace a cada producto.</p>
<p class="sub">${ms.length} materiales comparados${ps.length ? ` y <a href="#todos">${ps.length} productos más</a>` : ""} · precios con IVA · ${fechaTexto}</p>
${rejilla(ms, raiz)}
${ps.length ? `<section class="bloque" id="todos"><div class="bloque-cab"><h2>Todos los productos de ${esc(cMin)} (${ps.length})</h2></div>
<p class="sub">Precios públicos con IVA de cada tienda. Filtra por nombre o por tienda.</p>
<div class="filtro-prod"><input type="search" placeholder="Filtrar: ej. 13 mm, hidrófuga, 25 kg…" aria-label="Filtrar productos" data-filtro><span class="filtro-t">${Object.keys(tiendas).filter((t) => ps.some((p) => p.ofertas[0].tienda === t)).map((t) => `<label><input type="checkbox" checked value="${esc(tiendaCorta(t))}"> ${esc(tiendaCorta(t))}</label>`).join("")}</span></div>
${listaProductos(ps, raiz)}</section>
<script>(function(){var f=document.querySelector("[data-filtro]"),cs=document.querySelectorAll(".filtro-t input"),ls=document.querySelectorAll(".prod-lista li");
function n(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function a(){var w=n(f.value).split(/\s+/).filter(Boolean),on=[].filter.call(cs,function(c){return c.checked}).map(function(c){return c.value});
ls.forEach(function(l){var t=l.querySelector(".pl-t").textContent.split(" · ")[0];var txt=l.getAttribute("data-n")+" "+n(l.querySelector(".pl-n").textContent);l.hidden=on.indexOf(t)<0||!w.every(function(x){return txt.indexOf(x)>=0})})}
f.addEventListener("input",a);cs.forEach(function(c){c.addEventListener("change",a)})})();</script>` : ""}
${ctaReformista()}
<section><h2>Otras categorías</h2><ul class="lista">${categorias.filter((x) => x !== c).map((x) => `<li><a href="${raiz}${rutaCat(x)}">Precios de ${esc(x[0].toLowerCase() + x.slice(1))}</a></li>`).join("")}</ul></section>
`;
  return { ruta, html: pagina({ titulo, descripcion, ruta, cuerpo, jsonld: [lista, migas], raiz }) };
}

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });
if (existsSync(join(aqui, "img"))) cpSync(join(aqui, "img"), join(salida, "img"), { recursive: true });
writeFileSync(join(salida, "index.html"), portada());
const rutas = [""];
for (const m of materiales) {
  const { ruta, html } = paginaMaterial(m);
  mkdirSync(join(salida, ruta), { recursive: true });
  writeFileSync(join(salida, ruta, "index.html"), html);
  rutas.push(ruta);
}
for (const m of productos) {
  const { ruta, html } = paginaProducto(m);
  mkdirSync(join(salida, ruta), { recursive: true });
  writeFileSync(join(salida, ruta, "index.html"), html);
  rutas.push(ruta);
}
writeFileSync(join(salida, "indice.json"), indiceJSON);
for (const f of [paginaComparativa, paginaCesta]) {
  const { ruta, html } = f();
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
