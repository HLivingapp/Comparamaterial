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
  let x = 6, y = 146; const chips = t.map((e) => { const w = Math.min(228, 16 + e.length * 9.3); if (x === 999) return ""; if (x + w > 234) { x = 6; y -= 30; } if (y < 116) { y = 116; x = 999; return ""; } const s = `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="#ffffff" stroke="#c9cfd3"/><text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="14.5" font-weight="700" fill="#1f2529">${esc(e)}</text>`; x += w + 4; return s; }).join("");
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

function cesped(n) {
  const mm = (n.match(/(\d{1,2})\s*mm/i) || [])[1], h = mm ? Math.min(64, 14 + Number(mm) * 1.2) : 40, pt = (n.match(/(\d{2,3}[.,]?\d{3})\s*puntadas/i) || [])[1];
  // Corte del césped en perspectiva: base, briznas de dos verdes y cota de la altura de la fibra.
  let hojas = "";
  for (let i = 0; i < 70; i++) { const x = 30 + i * 2.6, a = ((i * 37) % 11) - 5, hh = h * (0.75 + ((i * 53) % 10) / 40); hojas += `<path d="M${x} 112 q${a / 2} ${-hh / 2} ${a} ${-hh}" stroke="${i % 3 ? "#5f9e4a" : "#87b85e"}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`; }
  const rollo = (n.match(/(\d+(?:[.,]\d+)?)\s*x\s*(\d+(?:[.,]\d+)?)\s*m\b/i) || []);
  EXTRA = [];
  return lienzo(`<g transform="translate(-14 -40) scale(1.12)">${suelo(122, 122, 98)}<path d="M26 112 h190 l8 -6 h-190 z" fill="#c9b99a"/><rect x="26" y="112" width="190" height="8" fill="#a8977a"/>${hojas}<path d="M34 112 l8 -6" stroke="#8a7a5f"/></g>${mm ? etq(120, 98, `fibra ${mm} mm`) : ""}`,
    [mm ? `${mm} mm` : "Césped", pt ? `${pt.replace(/[.,]/, ".")} pt/m²` : "", rollo[1] ? `Rollo ${rollo[1]}×${rollo[2]} m` : ""]);
}

// Electrodomésticos de cocina: frigoríficos, placas, campanas y extractores de encimera.
function electro(n, g) {
  const ac = /inox|acero/i.test(n) ? "#d3d8db" : /negr|black|\bbk\b|cristal negro/i.test(n) ? "#2f3437" : "#f6f7f7";
  const st = ac === "#2f3437" ? "#000" : "#7d878d";
  const l = litros(n);
  const alto = (() => { const m = n.match(/(\d{3}(?:[.,]\d)?)\s*cm\b/i) || n.match(/\b(1[.,]\d{2})\s*m\b/i); if (!m) return 0; const v = parseFloat(m[1].replace(",", ".")); return v < 3 ? Math.round(v * 100) : v; })();
  const anchoCm = (n.match(/\b([3-9]\d)\s*cm\b/i) || [])[1];
  const zonas = (n.match(/(\d)\s*(zonas|fuegos|f\b)/i) || [])[1];
  const caudal = (n.match(/(\d{3})\s*m(?:³|3)?\s*\/\s*h/i) || [])[1];
  const nf = /no ?frost/i.test(n) ? "No Frost" : "";
  const clase = (n.match(/clase (?:energ[eé]tica |energ\. )?([A-G]\+{0,3})\b/i) || n.match(/,\s*([A-E])\s*,/) || [])[1];
  EXTRA = [];
  const tir = (x, y, h) => `<rect x="${x}" y="${y}" width="3" height="${h}" rx="1.5" fill="#8f989e"/>`;
  if (/Frigor|Vinotecas/.test(g)) {
    const amer = /americanos/.test(g), integ = /integrables/.test(g), vino = /Vinotecas/.test(g);
    const x = amer ? 70 : 92, w = amer ? 96 : 56, y = 6, h = 132, f = integ ? "#fbfbfa" : ac;
    let d = `${suelo(x + w / 2 + 6, 142, w * 0.62)}${caja(x, y, w, h, amer ? 20 : 16, f, st)}${integ ? "" : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#met)" opacity=".5"/>`}`;
    if (amer && /franc|4 ?p|multi|cuatro/i.test(n)) d += `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + 78}" stroke="${st}" stroke-opacity=".6"/><line x1="${x}" y1="${y + 78}" x2="${x + w}" y2="${y + 78}" stroke="${st}" stroke-opacity=".6"/><line x1="${x}" y1="${y + 105}" x2="${x + w}" y2="${y + 105}" stroke="${st}" stroke-opacity=".6"/>${tir(x + w / 2 - 6, y + 30, 30)}${tir(x + w / 2 + 3, y + 30, 30)}`;
    else if (amer) d += `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${st}" stroke-opacity=".6"/>${tir(x + w / 2 - 6, y + 40, 44)}${tir(x + w / 2 + 3, y + 40, 44)}${/dispens|agua|hielo|aqua/i.test(n) ? `<rect x="${x + 10}" y="${y + 34}" width="24" height="34" rx="3" fill="#4f565b"/><rect x="${x + 15}" y="${y + 40}" width="14" height="8" rx="1" fill="#7fb3d5"/>` : ""}`;
    else if (vino) d += `<rect x="${x + 5}" y="${y + 6}" width="${w - 10}" height="${h - 18}" rx="2" fill="#30383d" opacity=".85"/>` + Array.from({ length: 7 }, (_, i) => `<line x1="${x + 7}" y1="${y + 22 + i * 15}" x2="${x + w - 7}" y2="${y + 22 + i * 15}" stroke="#9aa3a8"/><ellipse cx="${x + 18}" cy="${y + 18 + i * 15}" rx="6" ry="3" fill="#7a2e3a"/><ellipse cx="${x + 34}" cy="${y + 18 + i * 15}" rx="6" ry="3" fill="#7a2e3a"/>`).join("") + tir(x + w - 8, y + 30, 40);
    else { const k = /1 puerta|una puerta/i.test(n) ? 0 : /2 puertas|dos puertas/i.test(n) && !/combi/i.test(n) ? 36 : 82; if (k) d += `<line x1="${x}" y1="${y + k}" x2="${x + w}" y2="${y + k}" stroke="${st}" stroke-opacity=".6"/>`; d += integ ? `<text x="${x + w / 2}" y="${y + 70}" text-anchor="middle" font-size="9" fill="#8f989e">va dentro</text><text x="${x + w / 2}" y="${y + 81}" text-anchor="middle" font-size="9" fill="#8f989e">del mueble</text>` : tir(x + w - 8, y + 12, k ? Math.min(24, k - 18) : 40) + (k ? tir(x + w - 8, y + k + 8, 24) : ""); }
    if (alto) d += cotaV(x + w + (amer ? 36 : 32), y, y + h, `${alto} cm`);
    return lienzo(d, [l ? `${l} L` : "", amer ? (/franc|4 ?p|multi/i.test(n) ? "Puerta francesa" : "2 puertas") : integ ? "Integrable" : vino ? "Vinoteca" : "", nf, clase ? `Clase ${clase.toUpperCase()}` : ""]);
  }
  if (/Placas/.test(g)) {
    const x = 34, y = 40, w = 172, h = 86, vit = "#24292c";
    let d = `${suelo(120, 134, 92)}<path d="M${x} ${y + h} L${x + 22} ${y} L${x + w + 22} ${y} L${x + w} ${y + h} Z" fill="${vit}" stroke="#000"/><path d="M${x} ${y + h} L${x + 22} ${y} L${x + 92} ${y} L${x + 50} ${y + h} Z" fill="#fff" opacity=".07"/><path d="M${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y + h + 4} L${x} ${y + h + 4} Z" fill="#111"/>`;
    const zc = (cx, cy, r) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.55}" fill="none" stroke="#9aa3a8" stroke-width="1.3"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.55}" ry="${r * 0.3}" fill="none" stroke="#6b7378"/>`;
    if (/extracci/.test(g)) d += zc(x + 40, y + 24, 16) + zc(x + 32, y + 62, 18) + zc(x + 150, y + 24, 16) + zc(x + 142, y + 62, 18) + `<path d="M${x + 88} ${y + 8} L${x + 106} ${y + 8} L${x + 96} ${y + 78} L${x + 78} ${y + 78} Z" fill="#3b4246" stroke="#6b7378"/>` + Array.from({ length: 9 }, (_, i) => `<line x1="${x + 88 - i * 1.25}" y1="${y + 15 + i * 7}" x2="${x + 105 - i * 1.25}" y2="${y + 15 + i * 7}" stroke="#7d878d"/>`).join("") + `<path d="M${x + 92} ${y - 4} q-6 -10 2 -18 M${x + 100} ${y - 4} q-6 -10 2 -18" stroke="#9aa3a8" fill="none" stroke-dasharray="2 2"/>`;
    else { const k = Number(zonas) || 4; const pos = k <= 2 ? [[60, 42, 22], [124, 42, 22]] : k === 3 ? [[52, 26, 18], [44, 62, 22], [130, 44, 26]] : [[54, 24, 16], [44, 62, 20], [140, 24, 18], [132, 62, 16]]; d += pos.map(([a, b, r]) => zc(x + a, y + b, r)).join(""); }
    d += `<rect x="${x + 70}" y="${y + h - 10}" width="36" height="5" rx="2" fill="#5b6368"/>`;
    if (anchoCm) d += cotaH(x, x + w, y + h + 18, `${anchoCm} cm`);
    return lienzo(d, [/extracci/.test(g) ? "Con extractor" : /inducci/i.test(n) ? "Inducción" : /gas/i.test(n) ? "Gas" : "Vitrocerámica", zonas ? `${zonas} zonas` : "", caudal ? `${caudal} m³/h` : "", /flex/i.test(n) ? "Zona flex" : ""]);
  }
  if (/Campanas|Extractores de encimera/.test(g)) {
    let d;
    if (/Extractores/.test(g)) d = `${suelo(120, 138, 90)}${caja(40, 92, 160, 8, 30, "#d7d0c2", "#8f989e")}${caja(70, 30, 100, 62, 6, ac, st)}<rect x="70" y="30" width="100" height="62" fill="url(#met)" opacity=".5"/>${Array.from({ length: 6 }, (_, i) => `<line x1="80" y1="${42 + i * 8}" x2="160" y2="${42 + i * 8}" stroke="${st}" stroke-opacity=".5"/>`).join("")}<path d="M120 28 v-16 m-6 6 l6 -6 l6 6" stroke="#5f6b73" fill="none" stroke-width="1.4"/>`;
    else if (/extraplana|integrable|grupo filtrante|telesc/i.test(n)) d = `<rect x="40" y="20" width="160" height="40" fill="#dfe5e8" stroke="#8f989e"/>${caja(46, 60, 148, 14, 22, ac, st)}<rect x="46" y="60" width="148" height="14" fill="url(#met)" opacity=".55"/><rect x="56" y="74" width="128" height="4" fill="#8f989e"/><circle cx="80" cy="67" r="2" fill="#4caf7a"/>`;
    else if (/inclinad|vertical/i.test(n)) d = `<path d="M76 18 L164 18 L164 120 L76 120 Z" fill="${ac}" stroke="${st}" stroke-opacity=".6"/><path d="M76 18 L164 18 L164 120 L76 120 Z" fill="url(#met)" opacity=".5"/><path d="M82 30 L158 30 L158 104 L82 104 Z" fill="#2f3437" opacity=".85"/><path d="M90 104 L150 104 L156 112 L84 112 Z" fill="#8f989e"/>`;
    else d = `${caja(104, 6, 32, 58, 16, ac, st)}<rect x="104" y="6" width="32" height="58" fill="url(#met)" opacity=".5"/><path d="M40 112 L76 66 L164 66 L200 112 Z" fill="${tono(ac, 0.94)}" stroke="${st}" stroke-opacity=".6"/><path d="M40 112 L76 66 L164 66 L200 112 Z" fill="url(#met)" opacity=".45"/><rect x="38" y="112" width="164" height="10" fill="${ac}" stroke="${st}" stroke-opacity=".6"/><rect x="58" y="122" width="124" height="3" fill="#8f989e"/><circle cx="182" cy="117" r="2" fill="#4caf7a"/>`;
    if (anchoCm && !/Extractores/.test(g)) d += cotaH(40, 200, /extraplana|integrable|grupo filtrante|telesc/i.test(n) ? 96 : 134, `${anchoCm} cm`);
    return lienzo(d, [/Extractores/.test(g) ? "De encimera" : /decorativa/i.test(n) ? "Decorativa" : /extraplana/i.test(n) ? "Extraplana" : /grupo filtrante/i.test(n) ? "Grupo filtrante" : "Campana", caudal ? `${caudal} m³/h` : "", clase ? `Clase ${clase.toUpperCase()}` : ""]);
  }
  return null;
}

// Saco (cemento, mortero, yeso, cola, junta…): el tipo, el peso y la clase impresos en el propio saco.
const TIPO_SACO = [[/cemento cola|adhesivo cement|\bcola\b/i, "Cemento cola"], [/autonivel/i, "Autonivelante"], [/junta|rejunt|borada/i, "Mortero de juntas"], [/hormig[oó]n/i, "Hormigón seco"], [/mortero/i, "Mortero"], [/cemento/i, "Cemento"], [/escayola/i, "Escayola"], [/yeso/i, "Yeso"], [/\bcal\b|cal hidr/i, "Cal"], [/arena|grava|gravilla|[aá]rido/i, "Árido"], [/masilla|plaste/i, "Masilla"], [/impermeab/i, "Impermeabilizante"]];
export function esSaco(n) { return /\bsaco|\d\s*kg\b/i.test(n) && TIPO_SACO.some(([r]) => r.test(n)); }
function saco(n) {
  EXTRA = [];
  const kg = (n.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i) || [])[1];
  const tipo = (TIPO_SACO.find(([r]) => r.test(n)) || [, "Material"])[1];
  const clase = (n.match(/\b(C[12]\s?(?:T|E|S[12]|F)*(?:\s?(?:T|E|S[12]))*|CG2\s?W?A?|CEM\s?I{1,3}V?(?:\/[AB](?:-[A-Z]+)?)?(?:\s?\d{2}[.,]5\s?[NR])?|\d{2}[.,]5\s?[NR]|M\s?-?\s?(?:2[.,]5|5|7[.,]5|10|15)|B1|YG|YF|HA-?\d{2})\b/i) || [])[1];
  const blanco = /blanc|white/i.test(n), gris = /gris|grey/i.test(n);
  const uso = /exterior|fachada/i.test(n) ? "Exterior" : /interior/i.test(n) ? "Interior" : "";
  const extra = /r[aá]pid|fraguado r/i.test(n) ? "Rápido" : /flexib|deformab/i.test(n) ? "Flexible" : /hidr[oó]fug|impermeab|repelente/i.test(n) ? "Hidrófugo" : /porcel[aá]nic|gran formato/i.test(n) ? "Para porcelánico" : /refractari/i.test(n) ? "Refractario" : "";
  const fondo = blanco ? "#f7f5ef" : gris ? "#e4e2dc" : "#efe7d6", banda = tipo === "Cemento cola" ? "#1f5fd6" : tipo === "Yeso" || tipo === "Escayola" ? "#d98a1f" : /junta/i.test(tipo) ? "#2f9e6e" : "#6b7378";
  const t = tipo.length > 14 ? 9.5 : tipo.length > 11 ? 11 : 13;
  const d = `${suelo(120, 140, 62)}<path d="M66 24 Q120 15 174 24 L182 128 Q120 142 58 128 Z" fill="${fondo}" stroke="#8f989e" stroke-width="1.5"/><path d="M66 24 Q120 15 174 24 L176 38 Q120 30 64 38 Z" fill="${tono(fondo, 0.9)}"/><path d="M62 54 Q120 47 178 54 L179 70 Q120 63 61 70 Z" fill="${banda}"/><text x="120" y="65" text-anchor="middle" font-size="${t}" font-weight="800" fill="#fff">${esc(tipo.toUpperCase())}</text><text x="120" y="100" text-anchor="middle" font-size="24" font-weight="800" fill="#33393d">${kg ? kg.replace(".", ",") + " kg" : ""}</text>${clase ? `<text x="120" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#5f6b73">${esc(clase.toUpperCase().replace(/\s+/g, " "))}</text>` : ""}<path d="M66 24 Q120 15 174 24 L182 128 Q120 142 58 128 Z" fill="url(#lz)"/>`;
  return lienzo(d, [clase ? `Clase ${clase.toUpperCase().replace(/\s+/g, " ")}` : "", blanco ? "Blanco" : gris ? "Gris" : "", uso, extra]);
}

// Cuando no hay dibujo propio: caja con el tipo de producto escrito y sus medidas o datos.
export function tarjeta(n) {
  const pal = String(n).replace(/^\W*(?:(?:pack|kit|juego|set|lote) (?:de )?\d*\s*)?/i, "").split(/[\s,(]+/).filter((w) => w && !/\d/.test(w));
  let tipo = ""; for (const w of pal.slice(0, 4)) { if ((tipo + " " + w).trim().length > 22) break; tipo = (tipo + " " + w).trim(); }
  tipo = tipo.replace(/\s+(de|para|con|y|en|el|la)$/i, "").replace(/^./, (x) => x.toUpperCase()) || "Producto";
  const d = `${suelo(122, 128, 60)}${caja(70, 44, 100, 80, 34, "#f1f3f4", "#8f989e")}<path d="M70 44 l24 -15 M120 44 l24 -15" stroke="#c9cfd3"/><rect x="78" y="70" width="84" height="28" rx="4" fill="#fff" stroke="#d5dade"/><text x="120" y="89" text-anchor="middle" font-size="${tipo.length > 13 ? 9.5 : 12.5}" font-weight="800" fill="#33393d">${esc(tipo)}</text>`;
  return lienzo(d, []);
}

// Inodoros, tapas y cisternas: vista de perfil con el tipo real (suspendido, a pared, con cisterna, con bastidor).
function inodoro(n) {
  EXTRA = [];
  const negro = /negro|black/i.test(n), c = negro ? "#2f3437" : "#fbfbfa", st = negro ? "#000" : "#8f989e";
  const cuadr = /square|cuadrad|rectang/i.test(n);
  const susp = /suspend|mural|colgad/i.test(n), btw = /\bbtw\b|a pared|adosad|back to wall|pie cerrado/i.test(n);
  const bast = /bastidor|duplo|empotrad/i.test(n), cist = /completo|cisterna|compacto|pack inodoro|monobloc|tanque/i.test(n) && !susp && !bast;
  const solo = /^\W*(?:\w+ ){0,3}(tapa|asiento)/i.test(n) && !/inodoro (completo|suspend)/i.test(n);
  const soloCist = /^\W*(cisterna|casco de cisterna|bastidor|pulsador|placa)/i.test(n) || /pulsador|placa de accionamiento/i.test(n) && !/inodoro|taza/i.test(n) || /^\W*\w+ (\w+ )?(cisterna|bastidor)/i.test(n) && !/inodoro|taza|wc/i.test(n);
  const ama = /amortigu|soft ?close|ca[ií]da lenta/i.test(n) ? "Tapa amortiguada" : "";
  const rim = /rimless|sin brida|tornado/i.test(n) ? "Sin brida (rimless)" : "";
  const smart = /inteligente|japon|bidet|in-wash|lavado/i.test(n);
  const pared = `<rect x="20" y="4" width="14" height="140" fill="#e6e9eb" stroke="#c9cfd3"/>`;
  if (solo) {
    const d = `${suelo(120, 132, 70)}<path d="${cuadr ? "M70 120 L70 60 Q70 40 92 40 L148 40 Q170 40 170 60 L170 120 Z" : "M120 128 C72 128 66 86 70 66 C74 44 96 36 120 36 C144 36 166 44 170 66 C174 86 168 128 120 128 Z"}" fill="${c}" stroke="${st}" stroke-width="1.6"/><path d="${cuadr ? "M84 112 L84 66 Q84 54 96 54 L144 54 Q156 54 156 66 L156 112 Z" : "M120 114 C90 114 84 88 86 72 C88 58 102 52 120 52 C138 52 152 58 154 72 C156 88 150 114 120 114 Z"}" fill="#eef1f2" stroke="${st}" stroke-opacity=".5"/><rect x="96" y="26" width="48" height="10" rx="4" fill="${tono(c, 0.9)}" stroke="${st}"/><path d="M70 66 C74 44 96 36 120 36" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    return lienzo(d, [cuadr ? "Cuadrada" : "Redonda", ama, /duroplast|termoest/i.test(n) ? "Duroplast" : /madera|mdf/i.test(n) ? "Madera" : "", negro ? "Negra" : "Blanca"]);
  }
  if (soloCist) {
    const d = `${pared}${suelo(110, 142, 60)}<rect x="60" y="14" width="70" height="128" fill="none" stroke="#9aa3a8" stroke-width="3"/><line x1="60" y1="142" x2="130" y2="142" stroke="#9aa3a8" stroke-width="4"/><rect x="68" y="20" width="54" height="60" rx="6" fill="#4a6fa5" opacity=".85"/><rect x="134" y="38" width="42" height="28" rx="3" fill="${negro ? "#2f3437" : "#fbfbfa"}" stroke="${st}"/><rect x="138" y="44" width="16" height="16" rx="2" fill="#d5dade"/><rect x="156" y="44" width="16" height="16" rx="2" fill="#d5dade"/><line x1="130" y1="52" x2="134" y2="52" stroke="${st}"/>`;
    return lienzo(d, [/bastidor/i.test(n) ? "Bastidor" : /pulsador/i.test(n) ? "Pulsador" : "Cisterna", /doble descarga|dual|3\/6|4\/2|doble/i.test(n) ? "Doble descarga" : "", /alta/i.test(n) ? "Alta" : /empotr|bastidor/i.test(n) ? "Empotrada" : ""]);
  }
  const taza = cuadr
    ? `<path d="M${susp ? 34 : 40} ${susp ? 70 : 76} L176 ${susp ? 70 : 76} Q186 ${susp ? 70 : 76} 184 ${susp ? 84 : 90} L172 ${susp ? 112 : 118} Q160 ${susp ? 124 : 130} 120 ${susp ? 124 : 130} L${susp ? 34 : 100} ${susp ? 124 : 130}${susp ? "" : " Q60 114 40 76"} Z" fill="${c}" stroke="${st}" stroke-width="1.6"/>`
    : `<path d="M${susp ? 34 : 40} ${susp ? 70 : 76} L170 ${susp ? 70 : 76} C196 ${susp ? 70 : 76} 186 ${susp ? 116 : 122} 150 ${susp ? 122 : 128} C130 ${susp ? 126 : 132} 100 ${susp ? 126 : 132} ${susp ? 34 : 96} ${susp ? 122 : 128}${susp ? "" : " Q60 112 40 76"} Z" fill="${c}" stroke="${st}" stroke-width="1.6"/>`;
  const pie = susp ? "" : `<path d="M${btw ? 40 : 84} ${cuadr ? 130 : 128} L${btw ? 40 : 88} 142 L140 142 L146 ${cuadr ? 130 : 128} Z" fill="${tono(c, 0.95)}" stroke="${st}" stroke-width="1.4"/>`;
  const tapa = `<rect x="${susp ? 36 : 42}" y="${susp ? 62 : 68}" width="${cuadr ? 146 : 140}" height="8" rx="4" fill="${tono(c, 0.93)}" stroke="${st}"/>`;
  const tanque = cist ? `<rect x="40" y="10" width="44" height="58" rx="5" fill="${c}" stroke="${st}" stroke-width="1.6"/><rect x="40" y="10" width="44" height="58" rx="5" fill="url(#lz)"/><rect x="54" y="4" width="16" height="6" rx="2" fill="#c9cfd3"/>` : bast || susp ? `<rect x="22" y="28" width="10" height="7" rx="1" fill="${negro ? "#111" : "#dfe5e8"}" stroke="${st}" stroke-opacity=".6"/>` : "";
  const panel = smart ? `<rect x="150" y="80" width="18" height="8" rx="2" fill="#4f565b"/><circle cx="155" cy="84" r="1.6" fill="#7fb3d5"/>` : "";
  const d = `${pared}${suelo(110, 144, susp ? 70 : 64)}${tanque}${taza}<path d="M${susp ? 34 : 40} ${susp ? 70 : 76} L170 ${susp ? 70 : 76}" stroke="#fff" stroke-width="3" opacity=".7"/>${tapa}${pie}${panel}${susp ? `<path d="M60 ${126} v18" stroke="#9aa3a8" stroke-dasharray="2 3"/><text x="66" y="140" font-size="9" fill="#8f989e">sin pie</text>` : ""}`;
  return lienzo(d, [susp ? "Suspendido" : btw ? "A pared (BTW)" : cist ? "Con cisterna" : "De pie", smart ? "Inteligente" : bast ? "Con bastidor" : rim, ama || (cuadr ? "Cuadrado" : "")].filter(Boolean).slice(0, 3));
}

// Herramientas: dibujo según el tipo, con voltaje, baterías, potencia, disco, peldaños…
function herramienta(n, g) {
  EXTRA = [];
  const V = (n.match(/\b(1[028]|36|54)\s?v\b/i) || [])[1], Ah = (n.match(/(\d(?:[.,]\d)?)\s?ah\b/i) || [])[1], W = (n.match(/(\d{3,4})\s?w\b/i) || [])[1];
  const nb = (n.match(/(\d)\s*bater[ií]as/i) || [])[1] || (/(\+|con)\s*(1\s*)?bater[ií]a\b/i.test(n) ? "1" : "");
  const disco = (n.match(/(\d{3})\s?mm/i) || [])[1];
  const brushless = /brushless|sin escobillas/i.test(n) ? "Brushless" : "";
  const col = /dewalt|stanley fatmax/i.test(n) ? "#f2b705" : /makita/i.test(n) ? "#1a9aa8" : /bosch professional|\bgbh|\bgsr|\bgws/i.test(n) ? "#1f5fa8" : /bosch/i.test(n) ? "#2e8b57" : /milwaukee|einhell|hilti/i.test(n) ? "#c62828" : /metabo|ryobi|dexter|stayer/i.test(n) ? /ryobi/i.test(n) ? "#9ccc3c" : /dexter/i.test(n) ? "#ff7a00" : "#2e7d32" : "#5b6b7a";
  const bat = nb || V ? `<rect x="88" y="112" width="44" height="20" rx="3" fill="#2f3437"/><rect x="92" y="116" width="36" height="5" rx="1" fill="#4caf7a"/>` : `<path d="M110 132 q-6 10 10 12 q20 2 30 -6" fill="none" stroke="#2f3437" stroke-width="2.5"/>`;
  const datos = [V ? `${V} V` : W ? `${W} W` : "", nb ? `${nb} batería${nb === "1" ? "" : "s"}${Ah ? " " + Ah.replace(".", ",") + " Ah" : ""}` : "", brushless, /l[aá]ser/i.test(n) ? (/360/.test(n) ? "360°" : /cruzad/i.test(n) ? "Líneas cruzadas" : (n.match(/(\d{2,3})\s?m\b/) || [])[1] ? `Alcance ${(n.match(/(\d{2,3})\s?m\b/))[1]} m` : "Láser") : ""];
  let d;
  if (/Taladros|Kits|impacto/.test(g)) d = `${suelo(118, 140, 56)}<path d="M64 40 L150 40 Q164 40 164 54 L164 64 Q164 76 150 76 L130 76 L126 112 L96 112 L100 76 L64 76 Z" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="164" y="50" width="18" height="16" rx="2" fill="#2f3437"/><rect x="182" y="55" width="${/impacto/.test(g) ? 10 : 26}" height="6" fill="#9aa3a8"/><rect x="104" y="80" width="8" height="12" rx="2" fill="#2f3437"/>${bat}${/Kits/.test(g) ? `<rect x="18" y="86" width="44" height="40" rx="5" fill="${tono(col, 0.85)}" stroke="#2f3437"/><text x="40" y="111" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">KIT</text>` : ""}`;
  else if (/Martillos/.test(g)) d = `${suelo(118, 140, 64)}<path d="M44 44 L170 44 Q182 44 182 56 L182 70 Q182 82 170 82 L136 82 L132 118 L100 118 L104 82 L44 82 Z" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="182" y="56" width="14" height="14" fill="#2f3437"/><rect x="196" y="60" width="30" height="6" fill="#9aa3a8"/><path d="M52 82 l-10 22 l12 2 l8 -24" fill="#2f3437"/>${bat.replace(/112/g, "118").replace(/116/g, "122")}<text x="110" y="68" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">SDS</text>`;
  else if (/Amoladoras/.test(g)) d = `${suelo(118, 132, 70)}<rect x="40" y="62" width="120" height="30" rx="14" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="150" y="58" width="24" height="38" rx="4" fill="#2f3437"/><ellipse cx="186" cy="100" rx="34" ry="9" fill="#9aa3a8" stroke="#5f6b73"/><ellipse cx="186" cy="100" rx="8" ry="2.5" fill="#5f6b73"/><rect x="152" y="96" width="10" height="16" fill="#2f3437"/><rect x="20" y="70" width="22" height="14" rx="4" fill="#2f3437"/>`;
  else if (/Sierras/.test(g)) d = /calar/i.test(n) ? `${suelo(118, 134, 62)}<path d="M66 56 Q66 36 100 36 L160 36 Q176 36 176 52 L176 92 L66 92 Z" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><path d="M92 44 L150 44 Q156 44 156 52 L156 60 L92 60 Z" fill="#fff" opacity=".7"/><rect x="60" y="92" width="122" height="8" fill="#9aa3a8"/><path d="M116 100 l4 32 l6 -32 z" fill="#5f6b73"/>` : `${suelo(118, 136, 74)}<circle cx="120" cy="92" r="40" fill="#9aa3a8" stroke="#5f6b73"/>${Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12; return `<path d="M${120 + 40 * Math.cos(a)} ${92 + 40 * Math.sin(a)} l${4 * Math.cos(a + 1)} ${4 * Math.sin(a + 1)}" stroke="#5f6b73"/>`; }).join("")}<path d="M70 92 A50 50 0 0 1 170 92 L170 74 Q170 40 120 38 Q70 40 70 74 Z" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="40" y="118" width="160" height="8" fill="#c9cfd3" stroke="#8f989e"/><circle cx="120" cy="92" r="6" fill="#2f3437"/>`;
  else if (/Lijadoras/.test(g)) d = `${suelo(118, 134, 66)}<rect x="62" y="108" width="116" height="16" rx="6" fill="#2f3437"/><path d="M78 108 Q78 70 120 66 Q162 70 162 108 Z" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="104" y="40" width="32" height="30" rx="10" fill="${tono(col, 0.85)}" stroke="#2f3437"/>`;
  else if (/Medición/.test(g)) d = /metro l[aá]ser|disto|medidor/i.test(n) ? `${suelo(120, 134, 30)}<rect x="104" y="36" width="34" height="92" rx="8" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><rect x="110" y="44" width="22" height="18" rx="2" fill="#cfe6d6"/><text x="121" y="57" text-anchor="middle" font-size="8" font-weight="800" fill="#33393d">3,47</text><line x1="121" y1="36" x2="121" y2="4" stroke="#e53935" stroke-width="1.5" stroke-dasharray="3 2"/>` : `${suelo(120, 138, 40)}<rect x="96" y="66" width="48" height="44" rx="6" fill="${col}" stroke="#2f3437" stroke-width="1.5"/><circle cx="120" cy="88" r="9" fill="#2f3437"/><line x1="8" y1="88" x2="232" y2="88" stroke="#e53935" stroke-width="1.5"/><line x1="120" y1="0" x2="120" y2="66" stroke="#e53935" stroke-width="1.5"/><path d="M104 110 l-8 28 M136 110 l8 28 M120 110 v28" stroke="#5f6b73" stroke-width="2"/>`;
  else if (/Cortadoras/.test(g)) { const cm = (n.match(/(\d{2,3})\s?cm/i) || [])[1]; d = `${suelo(120, 132, 92)}<rect x="24" y="96" width="192" height="22" rx="3" fill="#dfe5e8" stroke="#8f989e"/><rect x="24" y="86" width="192" height="6" fill="#9aa3a8"/><rect x="100" y="60" width="40" height="26" rx="4" fill="${col}" stroke="#2f3437"/><path d="M120 60 L120 30 L170 22" stroke="#2f3437" stroke-width="5" stroke-linecap="round" fill="none"/>${cm ? cotaH(24, 216, 140, `${cm} cm de corte`) : ""}`; }
  else if (/Aspiradores/.test(g)) { const L = (n.match(/(\d{2})\s?l\b/i) || [])[1]; d = `${suelo(120, 138, 52)}<rect x="78" y="56" width="84" height="74" rx="10" fill="${/k[aä]rcher/i.test(n) ? "#f2c500" : col}" stroke="#2f3437" stroke-width="1.5"/><rect x="72" y="38" width="96" height="22" rx="8" fill="#2f3437"/><path d="M168 48 q40 0 40 40 l0 30" fill="none" stroke="#2f3437" stroke-width="6"/><circle cx="90" cy="134" r="5" fill="#2f3437"/><circle cx="150" cy="134" r="5" fill="#2f3437"/>${L ? `<text x="120" y="100" text-anchor="middle" font-size="18" font-weight="800" fill="#2f3437">${L} L</text>` : ""}`; }
  else if (/Escaleras/.test(g)) { const p = (n.match(/(\d{1,2})\s*(?:\+\s*\d{1,2}\s*)*pelda/i) || [])[1]; const k = Math.min(10, Number(p) || 5); d = `${suelo(120, 142, 60)}<path d="M120 8 L70 140 M120 8 L170 140" stroke="${/madera/i.test(n) ? "#b07a45" : "#9aa3a8"}" stroke-width="6" stroke-linecap="round"/>${Array.from({ length: k }, (_, i) => { const y = 24 + (i + 1) * (110 / (k + 1)); const dx = (y - 8) * 50 / 132; return `<line x1="${120 - dx}" y1="${y}" x2="${120 + dx}" y2="${y}" stroke="#5f6b73" stroke-width="3"/>`; }).join("")}`; return lienzo(d, [p ? `${n.match(/\d{1,2}(?:\s*\+\s*\d{1,2})*\s*pelda/i)[0].replace(/\s*pelda/i, "").replace(/\s+/g, "")} peldaños` : "", /madera/i.test(n) ? "Madera" : /alumin/i.test(n) ? "Aluminio" : "", /telesc/i.test(n) ? "Telescópica" : /multiposici|transformable/i.test(n) ? "Multiposición" : ""]); }
  else if (/albañil/.test(g)) { const llana = /llana|remolinador|talocha|peine/i.test(n); d = llana ? `${suelo(120, 120, 80)}<path d="M40 100 L200 100 L192 112 L48 112 Z" fill="#c9cfd3" stroke="#5f6b73"/>${/peine|dentad/i.test(n) ? Array.from({ length: 16 }, (_, i) => `<rect x="${50 + i * 9}" y="112" width="5" height="5" fill="#9aa3a8"/>`).join("") : ""}<rect x="110" y="84" width="20" height="16" fill="#5f6b73"/><rect x="70" y="62" width="100" height="22" rx="11" fill="${/madera/i.test(n) ? "#b07a45" : "#2f3437"}"/>` : `${suelo(120, 128, 70)}<path d="M40 104 L140 72 L156 104 Z" fill="#c9cfd3" stroke="#5f6b73"/><path d="M150 92 L186 64" stroke="#5f6b73" stroke-width="5"/><rect x="180" y="40" width="16" height="36" rx="7" transform="rotate(38 188 58)" fill="${/madera/i.test(n) ? "#b07a45" : "#2f3437"}"/>`; const fx = n.match(/(\d{2,3})\s?[x×]\s?(\d{2,3})\s?mm/i), mm = (n.match(/(\d{2,3})\s?(mm|cm)/i) || []); return lienzo(d, [fx ? `${fx[1]}×${fx[2]} mm` : mm[1] ? `${mm[1]} ${mm[2].toLowerCase()}` : "", /inox/i.test(n) ? "Inox" : /forjad/i.test(n) ? "Forjada" : "", /madera/i.test(n) ? "Mango de madera" : /bimateria/i.test(n) ? "Mango bimateria" : ""]); }
  else if (/Brocas/.test(g)) { const m = n.match(/(\d{1,2})\s?x\s?(\d{2,3})\s?mm/i); d = `${suelo(120, 110, 90)}<rect x="30" y="92" width="50" height="12" fill="#5f6b73"/><path d="M80 92 ${Array.from({ length: 10 }, (_, i) => `L${88 + i * 12} ${i % 2 ? 92 : 104}`).join(" ")} L210 98 Z" fill="#9aa3a8" stroke="#5f6b73"/>${m ? cotaH(30, 210, 130, `Ø${m[1]} × ${m[2]} mm`) : ""}`; return lienzo(d, [/sds/i.test(n) ? "SDS-plus" : /hormig|piedra/i.test(n) ? "Hormigón" : /metal|hss/i.test(n) ? "Metal" : /madera/i.test(n) ? "Madera" : ""]); }
  else return null;
  return lienzo(d, [...datos, disco && /Amoladoras|Sierras/.test(g) ? `Disco ${disco} mm` : ""].filter(Boolean).slice(0, 3));
}

// Puertas correderas de superficie: hoja colgada de la guía vista, desplazada a un lado; guías sueltas; casonetos.
function corredera(n, g) {
  EXTRA = [];
  const c = color(n, /pino|madera|natural/i.test(n) ? "#d8b48a" : "#fbfbfa"), st = oscuro(c.hex) ? "#000" : "#7d878d";
  const gcol = /negr|black/i.test(n) ? "#2f3437" : /blanc/i.test(n) && /gu[ií]a|herraje/i.test(n) ? "#f4f6f7" : "#b9c0c5";
  const vid = /cristal|vidrio/i.test(n), mate = /mate|satinad|ácido|acido/i.test(n);
  const an = (n.match(/anchura\s*(\d{2,3}(?:[.,]5)?)/i) || n.match(/\b(\d{2,3}(?:[.,]\d)?)\s*x\s*2[01]\d(?:[.,]\d)?\b/i) || n.match(/\b(\d{2,3}(?:[.,]\d)?)\s*cm\b/i) || [])[1];
  const lg = (n.match(/(\d{3})\s?cm/i) || [])[1] || ((n.match(/(\d[.,]\d)\s?m\b/i) || [])[1] ? String(Math.round(parseFloat(n.match(/(\d[.,]\d)\s?m\b/i)[1].replace(",", ".")) * 100)) : "");
  const pared = `<rect x="0" y="0" width="240" height="150" fill="#eef0ee"/><rect x="70" y="26" width="56" height="116" fill="#d5d9d6" stroke="#b9c0c5"/>`;
  const guia = (x1, x2) => `<rect x="${x1}" y="14" width="${x2 - x1}" height="7" rx="2" fill="${gcol}" stroke="#5f6b73" stroke-width=".8"/>`;
  const rueda = (x) => `<path d="M${x} 21 v8" stroke="#5f6b73" stroke-width="2.5"/><circle cx="${x}" cy="17" r="4" fill="#5f6b73"/>`;
  if (/Kits de gu/.test(g)) {
    const d = `${suelo(120, 92, 96)}${guia(14, 226)}${rueda(70)}${rueda(170)}<rect x="60" y="29" width="120" height="6" fill="#d5dade" opacity=".6"/><path d="M90 60 h60 m-8 -6 l8 6 l-8 6" stroke="#5f6b73" fill="none" stroke-width="1.6"/>${lg ? cotaH(14, 226, 112, `${lg} cm`) : ""}`;
    return lienzo(d, ["Guía vista", /negr/i.test(n) ? "Negra" : /blanc/i.test(n) ? "Blanca" : /plata|inox|alumin|gris/i.test(n) ? "Plata" : "", /freno|soft|amortig/i.test(n) ? "Con freno" : /cristal|pinza/i.test(n) ? "Para cristal" : ""]);
  }
  if (/empotradas/.test(g)) {
    const d = `<rect x="0" y="10" width="240" height="132" fill="#e7e2da"/><rect x="40" y="22" width="76" height="120" fill="#f6f4ef" stroke="#b9b2a5" stroke-dasharray="4 3"/><rect x="116" y="22" width="76" height="120" fill="#cfd5d9"/><rect x="40" y="22" width="152" height="4" fill="#8f989e"/><rect x="60" y="26" width="72" height="116" fill="${c.hex}" stroke="${st}" stroke-opacity=".6" opacity=".9"/><path d="M150 80 h-30 m8 -6 l-8 6 l8 6" stroke="#5f6b73" fill="none" stroke-width="1.6"/>`;
    return lienzo(d, ["Empotrada", /ladrillo/i.test(n) ? "Tabique de ladrillo" : /yeso|pladur/i.test(n) ? "Tabique de pladur" : "", an ? `${an} cm` : ""]);
  }
  const x = 112, w = 62, y = 24, h = 118;
  const hoja = vid ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mate ? "#e3ecf0" : "#d4e6ef"}" stroke="${/negr/i.test(n) ? "#2f3437" : "#8f989e"}" stroke-width="${/negr|alumin/i.test(n) ? 3 : 1}" opacity=".95"/><path d="M${x + 10} ${y + 70} L${x + 40} ${y + 12}" stroke="#fff" stroke-width="4" opacity=".7"/>` : `${caja(x, y, w, h, 4, c.hex, st)}${textura(n, x, y, w, h, c.hex)}${/granero|tablas|r[uú]stic|pino/i.test(n) ? `<path d="M${x + 4} ${y + 8} L${x + w - 4} ${y + h - 8} M${x + w - 4} ${y + 8} L${x + 4} ${y + h - 8}" stroke="${tono(c.hex, 0.75)}" stroke-width="5"/>` : ""}`;
  const d = `${pared}${suelo(x + w / 2, 144, 40)}${guia(60, 196)}${rueda(x + 12)}${rueda(x + w - 12)}${hoja}<rect x="${x + 6}" y="${y + 52}" width="3" height="18" rx="1.5" fill="#5f6b73"/><path d="M104 84 h-26 m8 -6 l-8 6 l8 6" stroke="#5f6b73" fill="none" stroke-width="1.6"/>`;
  return lienzo(d, [/Packs/.test(g) || /con herrajes|\+ ?gu[ií]a/i.test(n) ? "Con guía" : "Solo hoja", vid ? (mate ? "Cristal mate" : "Cristal") : /roble/i.test(n) ? "Roble" : /nogal/i.test(n) ? "Nogal" : /pino|madera/i.test(n) ? "Madera" : c.et, an ? `${String(an).replace(".", ",")} cm` : ""]);
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
  if (esSaco(nombre)) return saco(nombre);
  const svg = esquemaTipo(categoria, nombre);
  if (svg) return svg;
  if (/tornill|taco|clavo|tirafond|arandela|tuerca|remache|grapa|brida/i.test(nombre)) { EXTRA = EXTRA.filter((e) => !/cm$/.test(e)); return tarjeta(nombre); }
  return EXTRA.length ? generico(nombre) : tarjeta(nombre);
}
function esquemaTipo(categoria, nombre) {
  const a = area(categoria, nombre), g = subgrupo(a, nombre) || "";
  if (a === "Herramientas") { const h = herramienta(nombre, g); if (h) return h; }
  if (/recambio|accesorio|driver|conector|manilla|pomo|rodapi|perfil de|adhesivo|cemento|mortero|junta/i.test(g) && !/tira/i.test(g)) return null;
  if (a === "Cerámica y colocación" || /porcel[aá]nico|azulejo|baldos/i.test(g)) return /azulejo|porcel|gres|baldos|cer[aá]mic|pavimento|revestimiento|mosaico|\d\s*[x×]\s*\d/i.test(nombre) ? azulejo(nombre) : null;
  if (/laminado|vin[ií]lico|parquet|madera/i.test(g) && a === "Suelos") return laminado(nombre);
  if (a === "Terrazas y patios") return /Césped artificial/.test(g) ? cesped(nombre) : /Tarima|Losetas/.test(g) ? laminado(nombre) : /Porcel/.test(g) ? azulejo(nombre) : null;
  if (/grifer/i.test(g)) return grifo(nombre, g);
  if (/^termos?/i.test(g) || /\btermo\b|calentador el/i.test(nombre)) return termo(nombre);
  if (a === "Puertas correderas" && !/Tiradores/.test(g)) return corredera(nombre, g);
  if (a === "Puertas" && /puerta/i.test(nombre) && !/armario/i.test(nombre)) return puerta(nombre);
  if (a === "Ventiladores" && /ventilador/i.test(nombre)) return ventilador(nombre);
  if (a === "Baño" && /Inodoros|Pulsadores|Bastidores/.test(g) && !/tornill|fijaci|junta|manguito|v[aá]lvula|mecanismo|flotador|recambio|kit de/i.test(nombre)) return inodoro(nombre);
  if (a === "Cocina" && /Muebles de cocina/.test(g)) return mueble(nombre);
  if (a === "Cocina" && /Frigor|Vinotecas|Placas|Campanas|Extractores/.test(g)) return electro(nombre, g);
  if (a === "Iluminación" && !/bombilla|driver|conector/i.test(g + nombre)) return luz(nombre, g);
  return null;
}
