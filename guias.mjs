// Genera /guias/ y una página por guía de compra (contenido en datos/guias.mjs).
// Enlaces de Amazon solo si existe AMAZON_TAG (ID de afiliado, p. ej. «comparamat-21»).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import GUIAS from "./datos/guias.mjs";

export const AMAZON_TAG = (process.env.AMAZON_TAG || "").trim();
export const AVISO_AMAZON = "En calidad de Afiliado de Amazon, Comparamaterial obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables. Comparamaterial participa en el Programa de Afiliados de Amazon EU.";
export const guiasMenu = GUIAS.map((g) => ({ slug: g.slug, corto: g.corto }));

const amazonUrl = (k) => `https://www.amazon.es/s?k=${encodeURIComponent(k)}&tag=${encodeURIComponent(AMAZON_TAG)}`;

// Reparte la selección por todo el rango de precios (no solo los más baratos).
function muestra(lista, n) {
  const ord = [...lista].sort((a, b) => a.ofertas[0].precio - b.ofertas[0].precio);
  if (ord.length <= n) return ord;
  return Array.from({ length: n }, (_, i) => ord[Math.round((i * (ord.length - 1)) / (n - 1))]);
}

export function generarGuias(ctx) {
  const { salida, rutas, pagina, esc, SITE, materiales, productos, rejilla, listaProductos, ctaReformista, fechaTexto, mesTexto } = ctx;
  const porSlug = new Map(materiales.map((m) => [m.slug, m]));

  for (const g of GUIAS) {
    const ruta = `guias/${g.slug}/`;
    const raiz = "../../";
    const comparados = g.materiales.map((s) => porSlug.get(s)).filter(Boolean);
    const usados = new Set();
    const selecciones = g.filtros.map((f) => {
      const ps = productos.filter((p) => p.categoria === f.categoria && f.nombre.test(p.nombre) && !usados.has(p.slug));
      const sel = muestra(ps, f.n);
      sel.forEach((p) => usados.add(p.slug));
      return sel;
    }).filter((s) => s.length);
    const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
    const art = { "@context": "https://schema.org", "@type": "Article", headline: g.titulo, description: g.descripcion, inLanguage: "es-ES", dateModified: ctx.fecha, author: { "@type": "Organization", name: "Comparamaterial" }, mainEntityOfPage: SITE + "/" + ruta };
    const migas = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Materiales", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Guías de compra", item: SITE + "/guias/" },
      { "@type": "ListItem", position: 3, name: g.corto, item: SITE + "/" + ruta }] };
    const indice = [["elegir", "Elige rápido"], ...g.secciones.map(([h], i) => [`s${i}`, h]), ...(comparados.length || selecciones.length ? [["precios", "Precios comparados"]] : []), ...(AMAZON_TAG && g.amazon.length ? [["amazon", "En Amazon"]] : []), ["faq", "Preguntas frecuentes"]];
    const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › <a href="${raiz}guias/">Guías de compra</a> › ${esc(g.corto)}</nav>
<article class="guia">
<h1>${esc(g.titulo)}</h1>
<p class="sub">Guía de compra · actualizada el ${fechaTexto} · precios públicos con IVA</p>
<p class="resumen">${esc(g.intro)}</p>
<nav class="g-indice" aria-label="En esta guía"><b>En esta guía:</b> ${indice.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join("")}</nav>
<section id="elegir"><h2>Elige rápido</h2>
<div class="g-tabla"><table><thead><tr><th scope="col">Tu caso</th><th scope="col">Recomendado</th><th scope="col">Por qué</th></tr></thead><tbody>
${g.elegir.map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td><b>${esc(b)}</b></td><td>${esc(c)}</td></tr>`).join("\n")}
</tbody></table></div></section>
${g.secciones.map(([h, ps], i) => `<section id="s${i}"><h2>${esc(h)}</h2>${ps.map((p) => `<p>${p}</p>`).join("")}</section>`).join("\n")}
${comparados.length || selecciones.length ? `<section id="precios"><h2>Precios comparados (${esc(mesTexto)})</h2>
<p class="sub">Precios públicos con IVA de la web de cada tienda. Pulsa para ver el detalle y el enlace a la tienda.</p>
${comparados.length ? rejilla(comparados, raiz) : ""}
${selecciones.map((s) => listaProductos(s, raiz)).join("")}
</section>` : ""}
${AMAZON_TAG && g.amazon.length ? `<section id="amazon" class="g-amazon"><h2>También en Amazon</h2>
<p class="sub">Búsquedas en Amazon.es de los productos de esta guía. Mira el precio y las opiniones allí antes de comprar.</p>
<ul>${g.amazon.map(([t, k]) => `<li><a href="${esc(amazonUrl(k))}" rel="sponsored nofollow noopener" target="_blank">${esc(t)} <span>Ver en Amazon →</span></a></li>`).join("")}</ul>
<p class="g-aviso">Enlaces de afiliado. ${esc(AVISO_AMAZON)} El precio para ti es el mismo.</p></section>` : ""}
<section id="faq"><h2>Preguntas frecuentes</h2>${g.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>
<section><h2>Otras guías</h2><ul class="lista">${g.relacionadas.map((s) => GUIAS.find((x) => x.slug === s)).filter(Boolean).map((x) => `<li><a href="${raiz}guias/${x.slug}/">${esc(x.titulo)}</a></li>`).join("")}</ul></section>
</article>
${ctaReformista()}
`;
    mkdirSync(join(salida, ruta), { recursive: true });
    writeFileSync(join(salida, ruta, "index.html"), pagina({ titulo: `${g.titulo} (${mesTexto})`, descripcion: g.descripcion, ruta, cuerpo, jsonld: [art, faq, migas], raiz }));
    rutas.push(ruta);
  }

  const ruta = "guias/";
  const raiz = "../";
  const lista = { "@context": "https://schema.org", "@type": "ItemList", name: "Guías de compra de materiales", itemListElement: GUIAS.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/guias/${g.slug}/`, name: g.titulo })) };
  const cuerpo = `
<nav class="migas"><a href="${raiz}">Materiales</a> › Guías de compra</nav>
<h1>Guías de compra para tu reforma</h1>
<p class="resumen">Qué mirar antes de comprar termos, calderas, aerotermia, placas solares o herramientas, explicado por gente que hace obras, con precios públicos comparados entre tiendas.</p>
<ul class="g-lista">${GUIAS.map((g) => `<li><a href="${raiz}guias/${g.slug}/"><b>${esc(g.titulo)}</b><span>${esc(g.descripcion)}</span></a></li>`).join("")}</ul>
${ctaReformista()}
`;
  mkdirSync(join(salida, ruta), { recursive: true });
  writeFileSync(join(salida, ruta, "index.html"), pagina({ titulo: `Guías de compra de materiales de obra (${mesTexto})`, descripcion: "Guías para elegir termo eléctrico, caldera de condensación, aerotermia, placas solares y herramientas, con precios reales comparados entre tiendas.", ruta, cuerpo, jsonld: [lista], raiz }));
  rutas.push(ruta);
}
