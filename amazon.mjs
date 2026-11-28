// Productos concretos de Amazon.es (datos/amazon.json) con enlace de afiliado, mezclados con el resto de la web:
// cada uno va a su área y subgrupo normal, y si coincide con un material comparado, Amazon sale como una tienda más.
// Sin API no se copian precios ni fotos de Amazon: fila con botón «Ver precio en Amazon», al final de su grupo.
// Con API (herramientas/amazon-api.mjs → datos/amazon-api.json) llevan precio y entran ordenados por precio como los demás.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AMAZON_TAG } from "./guias.mjs";
import { ORDEN } from "./herramientas/subgrupos.mjs";

const aqui = dirname(fileURLToPath(import.meta.url));
const leer = (f, d) => { try { return JSON.parse(readFileSync(join(aqui, "datos", f), "utf8")); } catch { return d; } };
// Áreas de Amazon que no tienen página propia en la web: van al área más cercana (solo mientras el área no exista en ORDEN).
const AREA = { "Domótica": "Electricidad", "Herramientas": "Obra y protección", "Terrazas y patios": "Suelos" };
const areaWeb = (a) => ORDEN.includes(a) ? a : AREA[a] || a;
export const AMAZON = AMAZON_TAG ? (leer("amazon.json", {}).productos || []).map((p) => ({ ...p, area: areaWeb(p.area) })) : [];
// Datos de la API: { asin: { precio, imagen, titulo, fecha } }. Amazon exige mostrar la hora del precio y refrescarlo cada 24 h:
// si el dato tiene más de 24 h, no se muestra.
const API = leer("amazon-api.json", {});
const datoApi = (p) => { const d = API[p.asin]; return d && d.fecha && d.precio && Date.now() - Date.parse(d.fecha) < 24 * 3600e3 ? d : null; };
export const precioAmazon = (p) => datoApi(p)?.precio ?? null;
export const urlAmazon = (asin) => `https://www.amazon.es/dp/${asin}?tag=${encodeURIComponent(AMAZON_TAG)}`;
const hora = (d) => new Date(d.fecha).toLocaleString("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });

export const amazonDeArea = (c) => AMAZON.filter((p) => p.area === c);

// Fila con el mismo formato que la lista de productos (.prod-lista li), para que el filtro por tienda la trate como «Amazon».
// attrF: atributo data-f de los filtros (estilo, color, marca…); foto: miniatura pl-f (la de la API o, si no hay, una foto orientativa propia).
export function filaAmazon(p, { esc, eur, slugify, attrF = "", foto = "" }, mas = false) {
  const d = datoApi(p);
  const img = d && d.imagen ? `<img class="pl-f" src="${esc(d.imagen)}" alt="" loading="lazy" decoding="async" width="64" height="48">` : foto;
  return `<li class="amz-li${mas ? " mas" : ""}"${attrF} data-n="${esc(slugify(p.nombre + " " + (p.marca || "")).replace(/-/g, " "))}">${img}<a href="${esc(urlAmazon(p.asin))}" rel="sponsored nofollow noopener" target="_blank"><span class="pl-n">${esc(p.nombre)}</span><span class="pl-t">Amazon · ${d ? `precio de las ${esc(hora(d))}` : "enlace de afiliado"}</span></a>${d ? `<b class="pl-p">${eur(d.precio)}</b>` : ""}<a class="t-add peq amz-ir" href="${esc(urlAmazon(p.asin))}" rel="sponsored nofollow noopener" target="_blank">${d ? "Ver en Amazon" : "Ver precio en Amazon"}</a></li>`;
}

// Fila de Amazon como una tienda más en la tabla de un material comparado.
export function filasAmazonMaterial(slug, { esc, eur }) {
  return AMAZON.filter((p) => p.material === slug).map((p) => { const d = datoApi(p); return `<tr class="amz-fila">
  <th scope="row">Amazon</th>
  <td>${esc(p.nombre)}<small>Enlace de afiliado</small></td>
  <td class="num">${d ? `${eur(d.precio)}<small>Precio de las ${esc(hora(d))}. Puede cambiar.</small>` : "<small>Precio en Amazon</small>"}</td>
  <td class="acc-t"><a href="${esc(urlAmazon(p.asin))}" rel="sponsored nofollow noopener" target="_blank">Ver precio en Amazon</a></td>
</tr>`; }).join("");
}
