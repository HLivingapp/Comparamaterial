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

// Ayudas de dibujo: luz suave arriba a la izquierda, sombra al suelo, caras en perspectiva y cotas de plano.
const tono = (hex, f) => { const v = parseInt(hex.slice(1), 16); return "#" + [v >> 16, (v >> 8) & 255, v & 255].map((x) => Math.round(f < 1 ? x * f : x + (255 - x) * (f - 1))).map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join(""); };
const DEFS = `<defs><filter id="sb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter><filter id="ds" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="1.5" dy="3" stdDeviation="2.5" flood-color="#1f2529" flood-opacity=".22"/></filter>
<linearGradient id="lz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".10"/></linearGradient>
<linearGradient id="met" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f8f9"/><stop offset="1" stop-color="#eceff1"/></linearGradient></defs>`;
const suelo = (cx, y, rx) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${Math.max(3, rx * 0.09)}" fill="#1f2529" opacity=".22" filter="url(#sb)"/>`;
// Caja en perspectiva caballera: frente (x,y,w,h), fondo d hacia arriba a la derecha.
const caja = (x, y, w, h, d, hex, borde = "#59636a") => { const dx = d * 0.7, dy = d * 0.45;
  return `<path d="M${x} ${y} L${x + dx} ${y - dy} L${x + w + dx} ${y - dy} L${x + w} ${y} Z" fill="${tono(hex, 1.12)}" stroke="${borde}" stroke-opacity=".45" stroke-linejoin="round"/>` +
    `<path d="M${x + w} ${y} L${x + w + dx} ${y - dy} L${x + w + dx} ${y + h - dy} L${x + w} ${y + h} Z" fill="${tono(hex, 0.8)}" stroke="${borde}" stroke-opacity=".45" stroke-linejoin="round"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${hex}" stroke="${borde}" stroke-opacity=".5"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#lz)"/>`; };
// Cotas de plano: línea fina con marcas oblicuas y la medida en una etiqueta blanca.
const etq = (x, y, t) => { const w = 8 + String(t).length * 6.2; return `<rect x="${x - w / 2}" y="${y - 7.5}" width="${w}" height="15" rx="3" fill="#fff" stroke="#c9cfd3" stroke-width=".8"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#33393d">${esc(t)}</text>`; };
const cotaH = (x1, x2, y, t) => `<g stroke="#5f6b73" stroke-width=".9"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line x1="${x1 - 3}" y1="${y + 3}" x2="${x1 + 3}" y2="${y - 3}"/><line x1="${x2 - 3}" y1="${y + 3}" x2="${x2 + 3}" y2="${y - 3}"/><line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}" stroke-opacity=".5"/><line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}" stroke-opacity=".5"/></g>${t ? etq((x1 + x2) / 2, y, t) : ""}`;
const cotaV = (x, y1, y2, t) => `<g stroke="#5f6b73" stroke-width=".9"><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><line x1="${x - 3}" y1="${y1 + 3}" x2="${x + 3}" y2="${y1 - 3}"/><line x1="${x - 3}" y1="${y2 + 3}" x2="${x + 3}" y2="${y2 - 3}"/><line x1="${x - 5}" y1="${y1}" x2="${x + 5}" y2="${y1}" stroke-opacity=".5"/><line x1="${x - 5}" y1="${y2}" x2="${x + 5}" y2="${y2}" stroke-opacity=".5"/></g>${t ? etq(x, (y1 + y2) / 2, t) : ""}`;
// Texturas del acabado dentro de un rectángulo.
let nTex = 0;
function textura(n, x, y, w, h, hex) {
  const id = "t" + (++nTex), clip = `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>`;
  if (/m[aá]rmol|marble|calacatta|carrara|statuario|travertin/i.test(n)) {
    const v = [[0.05, 0.15, 0.4, 0.5, 0.55, 0.2, 0.95, 0.65, 1.1], [0.0, 0.7, 0.3, 0.55, 0.6, 0.95, 0.9, 0.8, 0.6], [0.3, 0.0, 0.45, 0.3, 0.7, 0.35, 0.75, 0.6, 0.5]];
    return clip + `<g clip-path="url(#${id})" fill="none" stroke="${oscuro(hex) ? "#ffffff" : "#8f8a82"}">` + v.map((a) => `<path d="M${x + a[0] * w} ${y + a[1] * h} C ${x + a[2] * w} ${y + a[3] * h}, ${x + a[4] * w} ${y + a[5] * h}, ${x + a[6] * w} ${y + a[7] * h}" stroke-width="${a[8]}" stroke-opacity=".45"/>`).join("") + `</g>`;
  }
  if (/roble|oak|madera|wood|nogal|walnut|haya|pino|fresno|teca|cerezo|parquet|tarima/i.test(n)) {
    const k = Math.max(4, Math.round(h / 7));
    return clip + `<g clip-path="url(#${id})" fill="none" stroke="${tono(hex, 0.62)}" stroke-opacity=".38" stroke-width=".8">` + Array.from({ length: k }, (_, i) => { const yy = y + (i + 0.5) * h / k, a = (i % 3) * 2 + 1.5; return `<path d="M${x} ${yy} C ${x + w * 0.3} ${yy - a}, ${x + w * 0.6} ${yy + a}, ${x + w} ${yy - a / 2}"/>`; }).join("") + `</g>`;
  }
  if (/cemento|concrete|hormig|piedra|stone|terrazo|pizarra|slate/i.test(n)) {
    const pts = Array.from({ length: 26 }, (_, i) => [x + ((i * 37) % 97) / 97 * w, y + ((i * 53) % 89) / 89 * h]);
    return clip + `<g clip-path="url(#${id})" fill="${oscuro(hex) ? "#fff" : "#55595c"}" fill-opacity=".16">` + pts.map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="${0.6 + (i % 3) * 0.5}"/>`).join("") + `</g>`;
  }
  return "";
}
const brilloSobre = (n, x, y, w, h) => /brill|pulid|polished|gloss|lappat|lacad/i.test(n) ? `<path d="M${x + w * 0.08} ${y + h} L${x + w * 0.55} ${y} L${x + w * 0.75} ${y} L${x + w * 0.28} ${y + h} Z" fill="#fff" opacity=".28"/>` : "";

// Lienzo 240×180: dibujo arriba, etiquetas de características abajo.
let EXTRA = [];
// Etiquetas grandes para que se lean también en miniatura; si no caben en una fila, se pasan a una segunda.
function lienzo(dibujo, etiquetas) {
  const clave = (e) => e.toLowerCase().replace(/litros/, "l").replace(/\s+/g, "");
  const vistos = new Set(); const t = [etiquetas[0], ...EXTRA, ...etiquetas.slice(1)].filter((e) => e && !vistos.has(clave(e)) && vistos.add(clave(e))).slice(0, 4);
  let x = 6, y = 146; const chips = t.map((e) => { const w = Math.min(228, 16 + e.length * 9.3); if (x + w > 234) { x = 6; y -= 30; } const s = `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="#ffffff" stroke="#c9cfd3"/><text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1f2529">${esc(e)}</text>`; x += w + 4; return s; }).join("");
  // Si hay dos filas de etiquetas, el dibujo se reduce para que no lo tapen.
  const dos = y < 146, g = dos ? `<g transform="translate(24 -2) scale(.8)">${dibujo}</g>` : dibujo;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -8 240 188" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">${DEFS}<rect y="-8" width="240" height="188" fill="url(#fondo)"/>${g}${chips}</svg>`;
}

function azulejo(n) {
  const f = formato(n), c = color(n, "#e9e6e0"), b = brillo(n), hid = /hidr[aá]ulic|encaustic|patchwork|decorad/i.test(n);
  // Pieza a escala (120 cm = ancho completo), con canto de 1 cm visto en perspectiva y su sombra.
  let w = 70, h = 70;
  if (f) { const peq0 = f.a <= 20 && f.b <= 20, k = Math.min((peq0 ? 52 : 150) / Math.max(f.a, 1), (peq0 ? 34 : 96) / Math.max(f.b, 1)); w = Math.max(16, f.a * k); h = Math.max(16, f.b * k); }
  const peq = f && f.a <= 20 && f.b <= 20;
  const x = 110 - w / 2, y = 62 - h / 2, e = 4;
  const pieza = (px, py, op = 1) => `<g opacity="${op}"><path d="M${px + w} ${py} l${e} ${-e * 0.6} v${h} l${-e} ${e * 0.6} Z" fill="${tono(c.hex, 0.78)}"/><path d="M${px} ${py} l${e} ${-e * 0.6} h${w} l${-e} ${e * 0.6} Z" fill="${tono(c.hex, 1.1)}"/><rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${c.hex}" stroke="#8f989e" stroke-width=".8"/>${textura(n, px, py, w, h, c.hex)}${hid ? `<g fill="none" stroke-width="1.6"><circle cx="${px + w / 2}" cy="${py + h / 2}" r="${Math.min(w, h) * 0.3}" stroke="#5b7fa6"/><path d="M${px + w / 2} ${py} L${px + w} ${py + h / 2} L${px + w / 2} ${py + h} L${px} ${py + h / 2} Z" stroke="#c06a45" stroke-opacity=".7"/><circle cx="${px + w / 2}" cy="${py + h / 2}" r="${Math.min(w, h) * 0.1}" fill="#c06a45" fill-opacity=".5" stroke="none"/></g>` : ""}<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="url(#lz)"/>${b === "Brillo" ? brilloSobre("brillo", px, py, w, h) : ""}</g>`;
  // Las piezas pequeñas se ven colocadas (con junta) para entender el despiece.
  const vecinas = peq ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].map(([i, j]) => pieza(x + i * (w + 2.5), y + j * (h + 2.5), 0.5)).join("") : "";
  const cotas = f ? cotaH(x, x + w, peq ? y + 2 * h + 14 : y + h + 13, `${cm(f.a)} cm`) + cotaV(peq ? x + 2 * w + 16 : x + w + 15, y, y + h, `${cm(f.b)} cm`) : "";
  return lienzo(`${peq ? "" : suelo(x + w / 2 + 3, y + h + 4, w * 0.5)}<g filter="url(#ds)">${vecinas}${pieza(x, y)}</g>${cotas}`,
    [f ? `${cm(f.a)}×${cm(f.b)} cm` : "", c.et, b]);
}

function laminado(n) {
  const c = color(n, "#b98a5a"), ac = (n.match(/\bac ?([3-6])\b/i) || [])[1], mm = (n.match(/(\d+(?:[.,]\d+)?)(?:\s*\+\s*\d+)?\s*mm/i) || [])[1];
  // Suelo visto en perspectiva: lamas a junta trabada que se alejan, con el canto de la lama delante.
  const filas = 6, x0 = 18, x1 = 222, yTop = 20, yBot = 112, vx = 120;
  let lamas = "";
  for (let i = 0; i < filas; i++) {
    const t0 = i / filas, t1 = (i + 1) / filas, ya = yTop + (yBot - yTop) * t0, yb = yTop + (yBot - yTop) * t1;
    const ax = (t) => [vx - (vx - x0) * (0.55 + 0.45 * t), vx + (x1 - vx) * (0.55 + 0.45 * t)];
    const [la, ra] = ax(t0), [lb, rb] = ax(t1), off = (i % 2) * 0.5;
    const hexI = tono(c.hex, 0.92 + (i % 3) * 0.06);
    lamas += `<path d="M${la} ${ya} L${ra} ${ya} L${rb} ${yb} L${lb} ${yb} Z" fill="${hexI}" stroke="${tono(c.hex, 0.6)}" stroke-opacity=".45" stroke-width=".8"/>`;
    for (const p of [0.25 + off * 0.5, 0.75 + off * 0.5].map((q) => q % 1)) lamas += `<line x1="${la + (ra - la) * p}" y1="${ya}" x2="${lb + (rb - lb) * p}" y2="${yb}" stroke="${tono(c.hex, 0.55)}" stroke-opacity=".5" stroke-width=".9"/>`;
    lamas += textura("madera", lb, ya + 2, rb - lb, yb - ya - 3, hexI).replace(/clipPath id="(t\d+)"><rect[^>]*>/, (m0, id) => `clipPath id="${id}"><path d="M${la} ${ya} L${ra} ${ya} L${rb} ${yb} L${lb} ${yb} Z"/>`);
  }
  const canto = `<path d="M${x0} ${yBot} L${x1} ${yBot} L${x1} ${yBot + 7} L${x0} ${yBot + 7} Z" fill="${tono(c.hex, 0.7)}"/><path d="M${x0} ${yBot + 7} L${x1} ${yBot + 7} L${x1} ${yBot + 10} L${x0} ${yBot + 10} Z" fill="#e8e2d6"/>`;
  return lienzo(`${suelo(120, yBot + 10, 104)}${lamas}${canto}<rect x="${x0}" y="${yBot}" width="${x1 - x0}" height="10" fill="url(#lz)"/>${mm ? etq(36, yBot + 4, `${mm.replace(".", ",")} mm`) : ""}`,
    [ac ? `AC${ac}` : "", mm ? `${mm.replace(".", ",")} mm` : "", /agua|aqua|hidr/i.test(n) ? "Resiste agua" : c.et]);
}

function grifo(n, g) {
  const c = color(n, "#c7ced4"), emp = /empotr|empotrable|encastr/i.test(n), coc = /cocina|fregadero/i.test(n + g);
  const k = c.hex, b = tono(k, 0.55), met = `fill="url(#met)"`;
  let d;
  if (emp) d = `<rect x="62" y="16" width="116" height="116" rx="16" fill="#e9ecee" stroke="#c3c9cd"/><rect x="72" y="26" width="96" height="96" rx="12" fill="${k}" stroke="${b}" stroke-opacity=".5"/><rect x="72" y="26" width="96" height="96" rx="12" ${met}/><circle cx="120" cy="74" r="22" fill="${tono(k, 1.1)}" stroke="${b}" stroke-opacity=".6" stroke-width="2"/><rect x="115" y="42" width="10" height="34" rx="5" fill="${tono(k, 0.75)}"/><rect x="115" y="42" width="10" height="34" rx="5" ${met}/>`;
  else if (coc) d = `${suelo(118, 134, 60)}<rect x="60" y="128" width="120" height="7" rx="3" fill="#d9dde0"/><rect x="104" y="40" width="18" height="90" rx="7" fill="${k}" stroke="${b}" stroke-opacity=".5"/><rect x="104" y="40" width="18" height="90" rx="7" ${met}/><path d="M113 44 C 113 6, 184 6, 184 44 L 184 60" stroke="${b}" stroke-opacity=".5" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M113 44 C 113 6, 184 6, 184 44 L 184 60" stroke="${k}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M110 42 C 110 10, 178 8, 180 40" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none"/><rect x="124" y="70" width="34" height="8" rx="4" fill="${k}" stroke="${b}" stroke-opacity=".5" transform="rotate(-18 124 74)"/>`;
  else d = `${suelo(116, 134, 62)}<rect x="46" y="128" width="148" height="7" rx="3" fill="#d9dde0"/><rect x="98" y="62" width="32" height="68" rx="9" fill="${k}" stroke="${b}" stroke-opacity=".5"/><rect x="98" y="62" width="32" height="68" rx="9" ${met}/><path d="M104 76 L 72 76 Q 62 76 62 86" stroke="${b}" stroke-opacity=".5" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M104 76 L 72 76 Q 62 76 62 86" stroke="${k}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M102 72 L 72 72" stroke="#fff" stroke-opacity=".55" stroke-width="2.5"/><rect x="108" y="36" width="50" height="11" rx="5.5" fill="${k}" stroke="${b}" stroke-opacity=".5" transform="rotate(-12 112 42)"/><rect x="108" y="36" width="50" height="5" rx="2.5" fill="#fff" opacity=".4" transform="rotate(-12 112 42)"/>`;
  return lienzo(d, [emp ? "Empotrado" : coc ? "Cocina" : "Monomando", c.et, /termost/i.test(n) ? "Termostático" : ""]);
}

function termo(n) {
  const l = litros(n);
  return lienzo(`${suelo(122, 142, 44)}<rect x="86" y="12" width="68" height="126" rx="32" fill="#f4f6f7" stroke="#8f989e" stroke-width="1.5"/><rect x="86" y="12" width="68" height="126" rx="32" fill="url(#met)" opacity=".7"/><rect x="104" y="52" width="32" height="18" rx="4" fill="#dfe5e8" stroke="#8f989e"/><circle cx="128" cy="61" r="3" fill="#4caf7a"/><text x="120" y="104" text-anchor="middle" font-size="19" font-weight="800" fill="#33393d">${l ? l + " L" : ""}</text><line x1="108" y1="138" x2="108" y2="148" stroke="#8f989e" stroke-width="4"/><line x1="132" y1="138" x2="132" y2="148" stroke="#c0504d" stroke-width="4"/>${l ? cotaV(170, 12, 138, "") : ""}`,
    [l ? `${l} L` : "", /bomba|aerot/i.test(n) ? "Bomba de calor" : /gas/i.test(n) ? "Gas" : "Eléctrico", /wifi/i.test(n) ? "WiFi" : ""]);
}

function puerta(n) {
  const c = color(n, "#fbfbfa"), mold = /moldur|2c|4c|cuarter|lola|provenzal|cl[aá]sic/i.test(n), vid = /vidri|cristal|acristal/i.test(n), ran = /ranura|rayad|\bvt\b|line\b|lineas?/i.test(n);
  const st = oscuro(c.hex) ? "#000" : "#7d878d", x = 86, y = 8, w = 58, h = 106;
  let det = "";
  if (vid) det = `<rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h * 0.55}" rx="2" fill="#cfe3ee" stroke="${st}" stroke-opacity=".5"/><path d="M${x + 18} ${y + 60} L${x + 40} ${y + 20}" stroke="#fff" stroke-width="3" opacity=".7"/>`;
  else if (mold) det = [[y + 12, h * 0.4], [y + 18 + h * 0.4, h * 0.45]].map(([yy, hh]) => `<rect x="${x + 12}" y="${yy}" width="${w - 24}" height="${hh}" fill="none" stroke="${tono(c.hex, 0.75)}" stroke-width="3"/><rect x="${x + 13.5}" y="${yy + 1.5}" width="${w - 27}" height="${hh - 3}" fill="none" stroke="#fff" stroke-opacity=".7"/>`).join("");
  else if (ran) det = [0, 1, 2, 3].map((i) => `<line x1="${x + 6}" y1="${y + 26 + i * 26}" x2="${x + w - 6}" y2="${y + 26 + i * 26}" stroke="${tono(c.hex, 0.7)}" stroke-width="1.5"/>`).join("");
  const an = (n.match(/\b(62,5|72,5|82,5|92,5|60,5|70,5|80,5|625|725|825|925|60|70|72|80|82|90|92)\s*(?:cm)?(?![\d,])/i) || [])[1];
  const anT = an ? an.replace(/^(\d\d)(\d)$/, "$1,$2") : "";
  // Marco (tapajuntas) y hoja con canto visto, manilla y sombra al suelo.
  const d = `${suelo(x + w / 2, y + h + 2, 46)}<rect x="${x - 7}" y="${y - 7}" width="${w + 14}" height="${h + 7}" fill="${tono(c.hex, 0.93)}" stroke="${st}" stroke-opacity=".35"/>${caja(x, y, w, h, 5, c.hex, st)}${textura(n, x, y, w, h, c.hex)}${det}<rect x="${x + w - 15}" y="${y + h * 0.5}" width="11" height="3.5" rx="1.75" fill="#6b7378"/><circle cx="${x + w - 9}" cy="${y + h * 0.5 + 1.75}" r="3" fill="#8f989e"/>${an ? cotaH(x, x + w, y + h + 12, `${anT} cm`) : ""}${cotaV(x + w + 22, y, y + h, an ? "203 cm" : "")}`;
  return lienzo(d, [vid ? "Con vidrio" : mold ? "Con molduras" : ran ? "Con ranuras" : "Lisa", c.et, an ? `${anT} cm` : ""]);
}

function ventilador(n) {
  const luz = /con luz|led|l[aá]mpara/i.test(n) && !/sin luz/i.test(n), c = color(n, "#fbfbfa"), w = (n.match(/(\d+)\s*w\b/i) || [])[1], d = (n.match(/[øØ]\s*(\d+)/) || n.match(/(\d{2,3})\s*cm/i) || [])[1];
  const fa = c.hex === "#fbfbfa" ? "#e9ecee" : c.hex;
  const aspas = [0, 120, 240].map((a) => `<g transform="rotate(${a} 120 78)"><ellipse cx="120" cy="40" rx="13" ry="38" fill="${fa}" stroke="${tono(fa, 0.65)}" stroke-opacity=".6"/><ellipse cx="116" cy="36" rx="5" ry="26" fill="#fff" opacity=".3"/></g>`).join("");
  return lienzo(`<rect x="0" y="-8" width="240" height="10" fill="#e3e7ea"/><line x1="120" y1="2" x2="120" y2="60" stroke="#8f989e" stroke-width="3.5"/><g filter="url(#ds)">${aspas}<circle cx="120" cy="78" r="17" fill="${luz ? "#fff6cf" : "#f4f6f7"}" stroke="#8f989e" stroke-width="2"/>${luz ? `<circle cx="120" cy="78" r="10" fill="#fffbe6"/>` : `<circle cx="120" cy="78" r="17" fill="url(#met)" opacity=".6"/>`}</g>${luz ? `<path d="M100 96 L80 130 H160 L140 96" fill="#fff3b0" opacity=".35"/>` : ""}${d ? cotaH(120 - 70, 120 + 70, 130, `Ø ${d} cm`) : ""}`,
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
function mueble(n) {
  const c = color(n, "#fbfbfa"), st = oscuro(c.hex) ? "#000" : "#7d878d", f = c.hex, enc = "#d7d0c2";
  const caj = /caj[oó]n|cajones|cajonera/i.test(n);
  const tir = (x, y, h) => `<rect x="${x}" y="${y}" width="3.5" height="${h}" rx="1.75" fill="#6b7378"/>`;
  const frente = (x, y, w, h, pom = "r") => `<rect x="${x + 0.8}" y="${y + 0.8}" width="${w - 1.6}" height="${h - 1.6}" fill="${f}" stroke="${st}" stroke-opacity=".45"/>${textura(n, x, y, w, h, f)}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#lz)"/>${brilloSobre(n, x, y, w, h)}${tir(pom === "r" ? x + w - 8 : x + 4.5, y + 7, Math.min(20, h / 3))}`;
  const cajones = (x, y, w, h, k) => Array.from({ length: k }, (_, i) => `<rect x="${x + 0.8}" y="${y + i * h / k + 0.8}" width="${w - 1.6}" height="${h / k - 1.6}" fill="${f}" stroke="${st}" stroke-opacity=".45"/><rect x="${x}" y="${y + i * h / k}" width="${w}" height="${h / k}" fill="url(#lz)"/><rect x="${x + w / 2 - 12}" y="${y + i * h / k + 5}" width="24" height="3.5" rx="1.75" fill="#6b7378"/>`).join("");
  // Módulo bajo: casco en perspectiva, encimera con canto, frentes y zócalo.
  const bajo = (x, w, tipo, d = 22) => `${caja(x, 62, w, 72, d, f, st)}${caja(x - 2, 56, w + 4, 6, d + 2, enc, "#8f989e")}${tipo === "c" ? cajones(x, 62, w, 64, 3) : w > 50 ? frente(x, 62, w / 2, 64, "r") + frente(x + w / 2, 62, w / 2, 64, "l") : frente(x, 62, w, 64)}<rect x="${x + 2}" y="126" width="${w - 4}" height="8" fill="#4f565b"/>`;
  const alto = (x, y, w, h, d = 14) => `${caja(x, y, w, h, d, f, st)}${w > 50 ? frente(x, y, w / 2, h, "r") + frente(x + w / 2, y, w / 2, h, "l") : frente(x, y, w, h)}`;
  const dims = (() => { const m = n.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*(\d+(?:[.,]\d+)?))?/); return m ? [m[1], m[2], m[3]].filter(Boolean).map((v) => v.replace(".", ",")) : []; })();
  const ancho = dims[0] || (n.match(/\b(\d{2,3})\s*cm\b/i) || [])[1];
  let d, tipo;
  if (/cocina (completa|modular|en kit|lineal)|kit de cocina|cocina \d|^\W*[a-z]+ cocina,/i.test(n)) {
    tipo = "Cocina completa";
    d = `${suelo(118, 136, 108)}<rect x="14" y="54" width="212" height="2" fill="#d5dade"/>` + [0, 1, 2, 3].map((i) => alto(16 + i * 50, 4, 50, 38, 10)).join("") + [0, 1, 2, 3].map((i) => bajo(16 + i * 50, 50, i === 1 ? "c" : "", 14)).join("") + `<rect x="74" y="54" width="34" height="3" rx="1.5" fill="#9aa3a8"/>`;
  } else if (/columna|despensa|armario alto|estructura alta/i.test(n)) {
    tipo = /horno/i.test(n) ? "Columna de horno" : /frigo|nevera/i.test(n) ? "Columna de frigorífico" : "Columna";
    const x = 92, w = 56;
    d = `${suelo(x + w / 2 + 6, 138, 40)}${caja(x, 4, w, 132, 20, f, st)}` + (/horno/i.test(n) ? frente(x, 4, w, 46) + `<rect x="${x}" y="50" width="${w}" height="42" fill="#2f3539"/><rect x="${x + 5}" y="56" width="${w - 10}" height="28" rx="2" fill="#4a5257"/><rect x="${x + 5}" y="56" width="${w - 10}" height="28" fill="url(#lz)"/>` + cajones(x, 92, w, 36, 2) : frente(x, 4, w, 62) + frente(x, 66, w, 62)) + `<rect x="${x + 2}" y="128" width="${w - 4}" height="8" fill="#4f565b"/>` + cotaV(x - 12, 4, 136, dims.length ? `${dims.map((v) => parseFloat(v.replace(",", "."))).sort((a, b) => b - a)[0].toString().replace(".", ",")} cm` : "");
  } else if (/(mueble|m[oó]dulo|armario) (alto|de pared|mural)|\balto\b/i.test(n)) {
    tipo = "Módulo alto";
    d = `<rect x="40" y="2" width="170" height="114" fill="#eef0f1"/>${alto(66, 22, 96, 70, 18)}<path d="M66 100 h96" stroke="#c9cfd3" stroke-dasharray="3 3"/>`;
  } else if (/fregadero/i.test(n)) {
    tipo = "Bajo fregadero";
    d = `${suelo(126, 138, 62)}${bajo(70, 100, "")}<rect x="96" y="56" width="48" height="4" rx="2" fill="#7d878d"/><path d="M124 56 v-24 q0 -5 5 -5 h10" fill="none" stroke="#9aa3a8" stroke-width="4" stroke-linecap="round"/>`;
  } else if (/esquin|rinc/i.test(n)) {
    tipo = "Rinconero";
    d = `${suelo(126, 138, 64)}${bajo(66, 76, "", 40)}`;
  } else if (/^\W*(\w+ )?(puerta|frente)|frente de|puerta (de|para)/i.test(n)) {
    tipo = "Puerta o frente";
    d = `${suelo(122, 136, 34)}${caja(96, 14, 50, 118, 4, f, st)}${frente(96, 14, 50, 118)}`;
  } else {
    tipo = caj ? "Módulo bajo con cajones" : "Módulo bajo";
    d = `${suelo(124, 138, 52)}${bajo(80, 80, caj ? "c" : "")}`;
  }
  const cota = ancho && !/Cocina completa|Columna/.test(tipo) ? cotaH(/Módulo alto/.test(tipo) ? 66 : /fregadero/.test(tipo) ? 70 : /Rinconero/.test(tipo) ? 66 : /Puerta/.test(tipo) ? 96 : 80, /Módulo alto/.test(tipo) ? 162 : /fregadero/.test(tipo) ? 170 : /Rinconero/.test(tipo) ? 142 : /Puerta/.test(tipo) ? 146 : 160, /Módulo alto/.test(tipo) ? 108 : 146, `${ancho} cm`) : "";
  return lienzo(`<g transform="translate(14 0) scale(.88)">${d}${cota}</g>`, [tipo, c.et]);
}

function generico(n) {
  const f = formato(n);
  if (/\bsaco|\d\s*kg\b/i.test(n) && !f) {
    const kg = (n.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i) || [])[1];
    return lienzo(`${suelo(120, 132, 58)}<path d="M74 26 Q120 18 166 26 L174 122 Q120 136 66 122 Z" fill="#efe7d6" stroke="#8f989e" stroke-width="1.5"/><path d="M74 26 Q120 18 166 26 L168 40 Q120 32 72 40 Z" fill="#e2d8c3"/><path d="M84 30 l-2 90 M156 30 l2 90" stroke="#c9bfa8" stroke-dasharray="2 4"/><path d="M74 26 Q120 18 166 26 L174 122 Q120 136 66 122 Z" fill="url(#lz)"/><rect x="92" y="62" width="56" height="34" rx="4" fill="#fff" stroke="#c9cfd3"/><text x="120" y="85" text-anchor="middle" font-size="16" font-weight="800" fill="#33393d">${kg ? kg.replace(".", ",") + " kg" : ""}</text>`, []);
  }
  if (/rollo|bobina|\d\s*(m|metros)(?![a-záéíóúñ²0-9])/i.test(n) && !f) return lienzo(`${suelo(140, 120, 70)}<path d="M90 26 L196 26 L196 114 L90 114" fill="#fbfbfa" stroke="#8f989e" stroke-width="1.5"/><path d="M90 26 L196 26 L196 114 L90 114" fill="url(#lz)"/><ellipse cx="90" cy="70" rx="24" ry="44" fill="#ffffff" stroke="#8f989e" stroke-width="1.5"/><ellipse cx="90" cy="70" rx="17" ry="34" fill="none" stroke="#d5dade"/><ellipse cx="90" cy="70" rx="8" ry="14" fill="#dfe5e8" stroke="#8f989e"/>`, []);
  if (f) { const k = Math.min(150 / f.a, 84 / f.b); const w = Math.max(16, f.a * k), h = Math.max(16, f.b * k), x = 104 - w / 2, y = 62 - h / 2;
    return lienzo(`${suelo(x + w / 2 + 4, y + h + 6, w * 0.5)}${caja(x, y, w, h, 10, "#f4f6f7", "#8f989e")}${cotaH(x, x + w, y + h + 16, `${cm(f.a)} cm`)}${cotaV(x + w + 22, y, y + h, `${cm(f.b)} cm`)}`, []); }
  return lienzo(`${suelo(124, 128, 56)}${caja(78, 46, 84, 76, 34, "#e9dcc3", "#8f989e")}<path d="M78 46 l24 -15 M120 46 l24 -15" stroke="#c9bfa8"/><rect x="90" y="74" width="60" height="24" rx="3" fill="#fff" opacity=".9"/><text x="120" y="91" text-anchor="middle" font-size="${(EXTRA[0] || "").length > 7 ? 11 : 14}" font-weight="800" fill="#33393d">${esc(EXTRA[0] || "")}</text>`, []);
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
  if (a === "Cocina" && /Muebles de cocina/.test(g)) return mueble(nombre);
  if (a === "Iluminación" && !/bombilla|driver|conector/i.test(g + nombre)) return luz(nombre, g);
  return null;
}
