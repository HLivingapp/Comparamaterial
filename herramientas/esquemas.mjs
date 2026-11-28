// Dibujo esquemático de cada producto con sus características (formato, color, acabado, litros…).
// Sustituye a las fotos que no son del producto exacto: no engaña, porque se ve que es un dibujo.
import { area, subgrupo, litros } from "./subgrupos.mjs";

const COLORES = [
  [/\bnegr|\bblack|antracita|grafito/i, "#2b2b2b", "Negro"],
  [/dorad|oro\b|gold|lat[oó]n/i, "#c9a24a", "Dorado"],
  [/inox|acero|steel/i, "#a9b0b6", "Inox"],
  [/cromad|cromo|chrome/i, "#c7ced4", "Cromo"],
  [/m[aá]rmol|marble|calacatta|carrara/i, "#f1efea", "Mármol"],
  [/terracota|barro|cotto/i, "#c06a45", "Terracota"],
  [/\bverde|\bgreen\b|\bsalvia\b/i, "#7f9c7a", "Verde"],
  [/\bazul(?!ej)|\bblue\b|\bnavy\b/i, "#5b7fa6", "Azul"],
  [/\brosa\b|\bpink\b/i, "#e3b3b0", "Rosa"],
  [/\b(beige|crema|cream|arena|sand|hueso|marfil|ivory)\b/i, "#e4d6bd", "Beige"],
  [/roble|oak|madera|wood|nogal|walnut|haya|pino|cerezo/i, "#b98a5a", "Madera"],
  [/\b(gris|grey|gray|cemento|concrete|plata|silver)\b/i, "#9a9d9f", "Gris"],
  [/marr[oó]n|brown|chocolate|tabaco/i, "#7a5236", "Marrón"],
  [/\bblanc|\bwhite\b|\bnieve\b|\bsnow\b/i, "#fbfbfa", "Blanco"],
];
const color = (n, def = "#d9dcde") => { n = String(n).replace(/pasta (blanca|roja)/gi, ""); const c = COLORES.find(([r]) => r.test(n)); return c ? { hex: c[1], et: c[2] } : { hex: def, et: "" }; };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const num = (s) => parseFloat(String(s).replace(",", "."));
function formato(n) {
  const m = String(n).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*\d+(?:[.,]\d+)?)?\s*(mm|cm)?/i);
  if (!m) return null;
  let a = num(m[1]), b = num(m[2]);
  if ((m[3] || "").toLowerCase() === "mm") { a /= 10; b /= 10; } else { if (a > 400) a /= 10; if (b > 400) b /= 10; }
  return a > 0 && b > 0 ? { a, b } : null;
}
// Medidas y datos clave que trae el nombre: formato, grosor, Ø, litros, potencia, peso, superficie, clase…
export function medidas(n) {
  n = String(n); const out = [];
  const f3 = n.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*(\d+(?:[.,]\d+)?))?\s*(mm|cm|m\b)?/i);
  if (f3) { const u = (f3[4] || "").toLowerCase(); let v = [f3[1], f3[2], f3[3]].filter(Boolean).map(num); if (u === "mm") v = v.map((x) => x / 10); else if (!u) v = v.map((x) => (x > 400 ? x / 10 : x)); else if (u === "m") v = v.map((x) => x * 100); out.push(v.map(cm).join("×") + " cm"); }
  const d = n.match(/[øØ]\s*(\d+(?:[.,]\d+)?)\s*(mm|cm)?/); if (d) out.push(`Ø ${d[1].replace(".", ",")} ${d[2] || "cm"}`);
  const mm = !f3 && n.match(/(\d+(?:[.,]\d+)?)(?:\s*\+\s*\d+)?\s*mm\b/i); if (mm) out.push(`${mm[1].replace(".", ",")} mm`);
  const l = n.match(/(\d+(?:[.,]\d+)?)\s*(l|litros)\b/i); if (l) out.push(`${l[1].replace(".", ",")} L`);
  const kg = n.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i); if (kg) out.push(`${kg[1].replace(".", ",")} kg`);
  const fr = n.match(/(\d{3,5})\s*(frigor[ií]as|fg)\b/i); if (fr) out.push(`${fr[1]} frigorías`);
  const kw = n.match(/(\d+(?:[.,]\d+)?)\s*kw\b/i); if (kw) out.push(`${kw[1].replace(".", ",")} kW`);
  const w = !kw && n.match(/(\d+(?:[.,]\d+)?)\s*w\b/i); if (w) out.push(`${w[1].replace(".", ",")} W`);
  const m2 = n.match(/(\d+(?:[.,]\d+)?)\s*m(²|2)\b/i); if (m2) out.push(`${m2[1].replace(".", ",")} m²`);
  const ml = !f3 && n.match(/(\d+(?:[.,]\d+)?)\s*(m|metros)(?![a-záéíóúñ²0-9])/i); if (ml) out.push(`${ml[1].replace(".", ",")} m`);
  const ac = n.match(/\bac ?([3-6])\b/i); if (ac) out.push(`AC${ac[1]}`);
  const k = n.match(/(\d{4})\s*k\b/i); if (k) out.push(`${k[1]} K`);
  const ip = n.match(/\bip ?(\d{2})\b/i); if (ip) out.push(`IP${ip[1]}`);
  return [...new Set(out)];
}
const cm = (x) => (Math.round(x * 10) / 10).toString().replace(".", ",");
const brillo = (n) => /brill|pulid|polished|gloss|lappat/i.test(n) ? "Brillo" : /mate|matt|antidesliz/i.test(n) ? "Mate" : "";
const oscuro = (hex) => { const v = parseInt(hex.slice(1), 16); return ((v >> 16) * 0.3 + ((v >> 8) & 255) * 0.59 + (v & 255) * 0.11) < 120; };

// Lienzo 240×180: dibujo arriba, etiquetas de características abajo.
let EXTRA = [];
// Etiquetas grandes para que se lean también en miniatura; si no caben en una fila, se pasan a una segunda.
function lienzo(dibujo, etiquetas) {
  const clave = (e) => e.toLowerCase().replace(/litros/, "l").replace(/\s+/g, "");
  const vistos = new Set(); const t = [etiquetas[0], ...EXTRA, ...etiquetas.slice(1)].filter((e) => e && !vistos.has(clave(e)) && vistos.add(clave(e))).slice(0, 4);
  let x = 6, y = 146; const chips = t.map((e) => { const w = Math.min(228, 16 + e.length * 9.3); if (x + w > 234) { x = 6; y -= 30; } const s = `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="#ffffff" stroke="#c9cfd3"/><text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1f2529">${esc(e)}</text>`; x += w + 4; return s; }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -8 240 188" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"><rect y="-8" width="240" height="188" fill="#f4f6f7"/>${dibujo}${chips}</svg>`;
}

function azulejo(n) {
  const f = formato(n), c = color(n, "#e9e6e0"), b = brillo(n);
  // Pieza a escala dentro de una caja de 200×118 (120 cm = ancho completo).
  let w = 70, h = 70;
  if (f) { const k = Math.min(180 / Math.max(f.a, 1), 108 / Math.max(f.b, 1), 180 / 120); w = Math.max(14, f.a * k); h = Math.max(14, f.b * k); if (w > 180 || h > 108) { const r = Math.min(180 / w, 108 / h); w *= r; h *= r; } }
  const x = 116 - w / 2, y = 80 - h / 2;
  const vetas = /m[aá]rmol|marble|calacatta|carrara/i.test(n) ? `<path d="M${x + w * 0.1} ${y + h * 0.2} C ${x + w * 0.4} ${y + h * 0.5}, ${x + w * 0.5} ${y + h * 0.1}, ${x + w * 0.9} ${y + h * 0.7}" stroke="#b9b6b0" stroke-width="1.2" fill="none"/>` : "";
  const madera = /roble|oak|madera|wood|nogal/i.test(n) ? [0.25, 0.5, 0.75].map((p) => `<line x1="${x}" y1="${y + h * p}" x2="${x + w}" y2="${y + h * p + 3}" stroke="#8d6440" stroke-opacity=".35"/>`).join("") : "";
  const luz = b === "Brillo" ? `<path d="M${x} ${y + h * 0.35} L${x + w * 0.35} ${y} L${x + w * 0.55} ${y} L${x} ${y + h * 0.6} Z" fill="#fff" opacity=".45"/>` : "";
  // Si es pequeño, varias piezas para que se vea el despiece.
  const reps = f && f.a <= 20 && f.b <= 20 ? [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([i, j]) => `<rect x="${x + i * (w + 3)}" y="${y + j * (h + 3)}" width="${w}" height="${h}" fill="${c.hex}" stroke="#c7ccd0" opacity=".55"/>`).join("") : "";
  const hid = /hidr[aá]ulic|encaustic|patchwork|decorad/i.test(n) ? `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${Math.min(w, h) * 0.32}" fill="none" stroke="#5b7fa6" stroke-width="2"/><path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="#c06a45" stroke-opacity=".6"/>` : "";
  const cota = f && !reps ? `<g stroke="#6b7378" fill="#6b7378" font-size="10"><line x1="${x}" y1="${y - 6}" x2="${x + w}" y2="${y - 6}"/><line x1="${x}" y1="${y - 9}" x2="${x}" y2="${y - 3}"/><line x1="${x + w}" y1="${y - 9}" x2="${x + w}" y2="${y - 3}"/><text x="${x + w / 2}" y="${y - 9}" text-anchor="middle" stroke="none">${cm(f.a)}</text><line x1="${x + w + 6}" y1="${y}" x2="${x + w + 6}" y2="${y + h}"/><text x="${x + w + 9}" y="${y + h / 2 + 3}" stroke="none">${cm(f.b)}</text></g>` : "";
  return lienzo(`${reps}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c.hex}" stroke="#aab1b6" stroke-width="1.2"/>${hid}${vetas}${madera}${luz}${cota}`,
    [f ? `${cm(f.a)}×${cm(f.b)} cm` : "", c.et, b]);
}

function laminado(n) {
  const c = color(n, "#b98a5a"), ac = (n.match(/\bac ?([3-6])\b/i) || [])[1], mm = (n.match(/(\d+(?:[.,]\d+)?)(?:\s*\+\s*\d+)?\s*mm/i) || [])[1];
  const tablas = [0, 1, 2, 3].map((i) => { const off = i % 2 ? 50 : 0; return `<rect x="${20 - off}" y="${30 + i * 26}" width="120" height="24" fill="${c.hex}" stroke="#7d5a3a" stroke-opacity=".5"/><rect x="${142 - off}" y="${30 + i * 26}" width="120" height="24" fill="${c.hex}" stroke="#7d5a3a" stroke-opacity=".5"/>`; }).join("");
  return lienzo(`<clipPath id="c"><rect x="20" y="30" width="200" height="102" rx="4"/></clipPath><g clip-path="url(#c)">${tablas}</g><rect x="20" y="30" width="200" height="102" rx="4" fill="none" stroke="#aab1b6"/>`,
    [ac ? `AC${ac}` : "", mm ? `${mm.replace(".", ",")} mm` : "", /agua|aqua|hidr/i.test(n) ? "Resiste agua" : c.et]);
}

function grifo(n, g) {
  const c = color(n, "#c7ced4"), emp = /empotr|empotrable|encastr/i.test(n), coc = /cocina|fregadero/i.test(n + g);
  const k = c.hex, sombra = oscuro(k) ? "#000" : "#6b7378";
  let d;
  if (emp) d = `<rect x="60" y="22" width="120" height="120" rx="14" fill="${k}" stroke="${sombra}" stroke-opacity=".4"/><circle cx="120" cy="82" r="20" fill="none" stroke="${sombra}" stroke-opacity=".5" stroke-width="3"/><rect x="116" y="50" width="8" height="34" rx="4" fill="${sombra}" fill-opacity=".55"/>`;
  else if (coc) d = `<rect x="104" y="40" width="16" height="96" rx="6" fill="${k}" stroke="${sombra}" stroke-opacity=".4"/><path d="M112 44 C 112 10, 180 10, 180 44 L 180 62" stroke="${k}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M112 44 C 112 10, 180 10, 180 44 L 180 62" stroke="${sombra}" stroke-opacity=".25" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="60" y="134" width="120" height="6" rx="3" fill="#cfd4d7"/>`;
  else d = `<rect x="100" y="60" width="28" height="76" rx="8" fill="${k}" stroke="${sombra}" stroke-opacity=".4"/><path d="M106 72 L 70 72 Q 62 72 62 80" stroke="${k}" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="110" y="34" width="44" height="10" rx="5" fill="${k}" stroke="${sombra}" stroke-opacity=".4" transform="rotate(-12 114 40)"/><rect x="40" y="134" width="160" height="6" rx="3" fill="#cfd4d7"/>`;
  return lienzo(d, [emp ? "Empotrado" : coc ? "Cocina" : "Monomando", c.et, /termost/i.test(n) ? "Termostático" : ""]);
}

function termo(n) {
  const l = litros(n);
  return lienzo(`<rect x="88" y="16" width="64" height="122" rx="30" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/><rect x="104" y="58" width="32" height="18" rx="4" fill="#e7ecef" stroke="#9aa3a8"/><line x1="108" y1="138" x2="108" y2="146" stroke="#9aa3a8" stroke-width="4"/><line x1="132" y1="138" x2="132" y2="146" stroke="#9aa3a8" stroke-width="4"/><text x="120" y="110" text-anchor="middle" font-size="18" font-weight="700" fill="#33393d">${l ? l + " L" : ""}</text>`,
    [l ? `${l} L` : "", /bomba|aerot/i.test(n) ? "Bomba de calor" : /gas/i.test(n) ? "Gas" : "Eléctrico", /wifi/i.test(n) ? "WiFi" : ""]);
}

function puerta(n) {
  const c = color(n, "#fbfbfa"), mold = /moldur|2c|4c|cuarter|lola|provenzal|cl[aá]sic/i.test(n), vid = /vidri|cristal|acristal/i.test(n), ran = /ranura|rayad|\bvt\b|line\b|lineas?/i.test(n);
  const st = oscuro(c.hex) ? "#000" : "#8b9399";
  let det = "";
  if (vid) det = `<rect x="98" y="28" width="44" height="70" rx="2" fill="#cfe3ee" stroke="${st}" stroke-opacity=".5"/>`;
  else if (mold) det = `<rect x="96" y="26" width="48" height="50" fill="none" stroke="${st}" stroke-opacity=".55" stroke-width="2"/><rect x="96" y="84" width="48" height="48" fill="none" stroke="${st}" stroke-opacity=".55" stroke-width="2"/>`;
  else if (ran) det = [0, 1, 2, 3].map((i) => `<line x1="94" y1="${40 + i * 24}" x2="146" y2="${40 + i * 24}" stroke="${st}" stroke-opacity=".5" stroke-width="1.5"/>`).join("");
  const an = (n.match(/\b(62,5|72,5|82,5|92,5|60,5|70,5|80,5|625|725|825|925|60|70|72|80|82|90|92)\s*(?:cm)?(?![\d,])/i) || [])[1];
  const cotaP = an ? `<g stroke="#6b7378" fill="#6b7378" font-size="10"><line x1="80" y1="9" x2="160" y2="9"/><text x="120" y="6" text-anchor="middle" stroke="none">${an.replace(/^(\d\d)(\d)$/, "$1,$2")}</text><line x1="168" y1="12" x2="168" y2="144"/><text x="172" y="82" stroke="none">203</text></g>` : "";
  return lienzo(`${cotaP}<rect x="80" y="12" width="80" height="132" fill="${c.hex}" stroke="${st}" stroke-opacity=".6" stroke-width="2"/>${det}<circle cx="150" cy="82" r="3.5" fill="${st}" fill-opacity=".7"/>`,
    [vid ? "Con vidrio" : mold ? "Con molduras" : ran ? "Con ranuras" : "Lisa", c.et, an ? `${an.replace(/^(\d\d)(\d)$/, "$1,$2")} cm` : ""]);
}

function ventilador(n) {
  const luz = /con luz|led|l[aá]mpara/i.test(n) && !/sin luz/i.test(n), c = color(n, "#fbfbfa"), w = (n.match(/(\d+)\s*w\b/i) || [])[1], d = (n.match(/[øØ]\s*(\d+)/) || n.match(/(\d{2,3})\s*cm/i) || [])[1];
  const aspas = [0, 120, 240].map((a) => `<ellipse cx="120" cy="40" rx="13" ry="38" fill="${c.hex === "#fbfbfa" ? "#e9ecee" : c.hex}" stroke="#9aa3a8" transform="rotate(${a} 120 78)"/>`).join("");
  return lienzo(`<line x1="120" y1="4" x2="120" y2="60" stroke="#9aa3a8" stroke-width="3"/>${aspas}<circle cx="120" cy="78" r="16" fill="${luz ? "#fff6cf" : "#ffffff"}" stroke="#9aa3a8" stroke-width="2"/>`,
    [luz ? "Con luz" : "Sin luz", d ? `Ø ${d} cm` : "", w ? `${w} W` : ""]);
}

function luz(n, g) {
  const w = (n.match(/(\d+(?:[.,]\d+)?)\s*w\b/i) || [])[1], k = (n.match(/(\d{4})\s*k\b/i) || [])[1], c = color(n, "#ffffff");
  let d;
  if (/colgante|l[aá]mpara|aplique|decorativ/i.test(g + n)) d = `<line x1="120" y1="4" x2="120" y2="52" stroke="#6b7378" stroke-width="2"/><path d="M84 96 Q 120 40 156 96 Z" fill="${c.hex === "#ffffff" ? "#e9ecee" : c.hex}" stroke="#6b7378"/><ellipse cx="120" cy="100" rx="14" ry="7" fill="#fff3b0"/>`;
  else if (/tira|perfil/i.test(g + n)) d = `<rect x="20" y="64" width="200" height="16" rx="8" fill="#ffffff" stroke="#9aa3a8"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${28 + i * 21}" y="68" width="8" height="8" rx="2" fill="#ffe27a"/>`).join("")}`;
  else if (/foco|carril/i.test(g + n)) d = `<rect x="40" y="20" width="160" height="10" rx="3" fill="#cfd4d7"/><rect x="104" y="30" width="10" height="20" fill="#6b7378"/><rect x="92" y="46" width="34" height="50" rx="8" fill="${c.hex === "#ffffff" ? "#ffffff" : c.hex}" stroke="#6b7378" transform="rotate(-18 109 50)"/>`;
  else d = `<circle cx="120" cy="74" r="50" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/><circle cx="120" cy="74" r="34" fill="#fff6cf"/>`;
  const tipo = /colgante|l[aá]mpara|aplique|decorativ/i.test(g + n) ? "Decorativa" : /tira|perfil/i.test(g + n) ? "Tira LED" : /foco|carril/i.test(g + n) ? "Foco" : /plaf/i.test(g + n) ? "Plafón" : "Empotrado";
  return lienzo(d, [tipo, w ? `${w.replace(".", ",")} W` : "", k ? `${k} K` : ""]);
}

// Dibujo genérico con medidas: saco (kg), rollo (m), pieza con cotas (formato) o paquete.
function generico(n) {
  const f = formato(n);
  if (/\bsaco|\d\s*kg\b/i.test(n) && !f) return lienzo(`<path d="M78 22 L162 22 L170 128 Q120 140 70 128 Z" fill="#efe9dc" stroke="#9aa3a8" stroke-width="2"/><line x1="78" y1="34" x2="162" y2="34" stroke="#9aa3a8"/>`, []);
  if (/rollo|bobina|\d\s*(m|metros)(?![a-záéíóúñ²0-9])/i.test(n) && !f) return lienzo(`<ellipse cx="90" cy="70" rx="26" ry="44" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/><ellipse cx="90" cy="70" rx="8" ry="14" fill="#e7ecef" stroke="#9aa3a8"/><path d="M90 26 L190 26 L190 114 L90 114" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/>`, []);
  if (f) { const k = Math.min(170 / f.a, 96 / f.b); const w = Math.max(16, f.a * k), h = Math.max(16, f.b * k), x = 110 - w / 2, y = 64 - h / 2;
    return lienzo(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/><g stroke="#6b7378" fill="#6b7378" font-size="12" font-weight="600"><line x1="${x}" y1="${y - 6}" x2="${x + w}" y2="${y - 6}"/><text x="${x + w / 2}" y="${y - 9}" text-anchor="middle" stroke="none">${cm(f.a)}</text><line x1="${x + w + 6}" y1="${y}" x2="${x + w + 6}" y2="${y + h}"/><text x="${x + w + 9}" y="${y + h / 2 + 4}" stroke="none">${cm(f.b)}</text></g>`, []); }
  return lienzo(`<path d="M70 40 L120 18 L170 40 L170 104 L120 126 L70 104 Z" fill="#ffffff" stroke="#9aa3a8" stroke-width="2"/><path d="M70 40 L120 62 L170 40 M120 62 L120 126" fill="none" stroke="#9aa3a8" stroke-width="2"/>`, []);
}

// Devuelve el SVG del producto (dibujo + datos clave y medidas), o null si no hay datos útiles.
export function esquema(categoria, nombre) {
  EXTRA = medidas(nombre);
  const svg = esquemaTipo(categoria, nombre);
  return svg || (EXTRA.length ? generico(nombre) : null);
}
function esquemaTipo(categoria, nombre) {
  const a = area(categoria, nombre), g = subgrupo(a, nombre) || "";
  if (/recambio|accesorio|driver|conector|manilla|pomo|rodapi|perfil de|adhesivo|cemento|mortero|junta/i.test(g) && !/tira/i.test(g)) return null;
  if (a === "Cerámica y colocación" || /porcel[aá]nico|azulejo|baldos/i.test(g)) return /azulejo|porcel|gres|baldos|cer[aá]mic|pavimento|revestimiento|mosaico|\d\s*[x×]\s*\d/i.test(nombre) ? azulejo(nombre) : null;
  if (/laminado|vin[ií]lico|parquet|madera/i.test(g) && a === "Suelos") return laminado(nombre);
  if (/grifer/i.test(g)) return grifo(nombre, g);
  if (/^termos?/i.test(g) || /\btermo\b|calentador el/i.test(nombre)) return termo(nombre);
  if (a === "Puertas" && /puerta/i.test(nombre) && !/armario/i.test(nombre)) return puerta(nombre);
  if (a === "Ventiladores" && /ventilador/i.test(nombre)) return ventilador(nombre);
  if (a === "Iluminación" && !/bombilla|driver|conector/i.test(g + nombre)) return luz(nombre, g);
  return null;
}
