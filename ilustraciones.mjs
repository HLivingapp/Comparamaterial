// Ilustraciones propias, planas y uniformes, para cada tipo de material.
// Se eligen por palabras del nombre; si no hay coincidencia, se usa la de la categoría.
// Paleta: azul de la marca, azul claro, azul oscuro, amarillo y grises.
const A = "#2f6ad9", C = "#cfe0ff", O = "#0f2f6b", Y = "#ffc93c", G = "#e3e8f0", B = "#ffffff", M = "#9aa9c2";

const D = {
  saco: `<path d="M34 22h52l6 52H28z" fill="${C}"/><path d="M34 22c6-6 46-6 52 0" fill="none" stroke="${O}" stroke-width="3"/><path d="M28 74h64" stroke="${O}" stroke-width="3"/><rect x="42" y="38" width="36" height="20" rx="3" fill="${A}"/><path d="M48 48h24" stroke="${B}" stroke-width="3" stroke-linecap="round"/>`,
  cubo: `<path d="M36 28h48l-5 46H41z" fill="${A}"/><rect x="33" y="22" width="54" height="9" rx="3" fill="${O}"/><path d="M42 18c0-8 36-8 36 0" fill="none" stroke="${M}" stroke-width="3"/><rect x="44" y="42" width="32" height="16" rx="3" fill="${B}"/><rect x="48" y="47" width="14" height="6" rx="2" fill="${Y}"/>`,
  ladrillo: `<g fill="#e48a5c" stroke="${O}" stroke-width="2"><rect x="20" y="50" width="38" height="18" rx="2"/><rect x="62" y="50" width="38" height="18" rx="2"/><rect x="40" y="30" width="38" height="18" rx="2"/></g><g fill="#b85f37"><rect x="27" y="55" width="7" height="8" rx="1"/><rect x="37" y="55" width="7" height="8" rx="1"/><rect x="47" y="55" width="7" height="8" rx="1"/><rect x="69" y="55" width="7" height="8" rx="1"/><rect x="79" y="55" width="7" height="8" rx="1"/><rect x="89" y="55" width="7" height="8" rx="1"/><rect x="47" y="35" width="7" height="8" rx="1"/><rect x="57" y="35" width="7" height="8" rx="1"/><rect x="67" y="35" width="7" height="8" rx="1"/></g>`,
  placa: `<g transform="skewX(-12)"><rect x="40" y="16" width="44" height="60" rx="2" fill="${G}" stroke="${M}" stroke-width="2"/><rect x="48" y="20" width="44" height="60" rx="2" fill="${B}" stroke="${M}" stroke-width="2"/></g><path d="M44 78h40" stroke="${A}" stroke-width="4" stroke-linecap="round"/>`,
  perfil: `<path d="M26 66l60-40h10L36 66z" fill="${M}"/><path d="M26 66h10l60-40" fill="none" stroke="${O}" stroke-width="2"/><path d="M34 74l60-40h10L44 74z" fill="${G}" stroke="${O}" stroke-width="2"/>`,
  aislamiento: `<rect x="24" y="30" width="72" height="34" rx="4" fill="${Y}"/><path d="M24 40c8-6 12 6 18 0s12 6 18 0 12 6 18 0 12 6 18 0M24 52c8-6 12 6 18 0s12 6 18 0 12 6 18 0 12 6 18 0" fill="none" stroke="#d99a00" stroke-width="2.5"/><rect x="24" y="30" width="72" height="34" rx="4" fill="none" stroke="${O}" stroke-width="2"/>`,
  azulejo: `<g stroke="${B}" stroke-width="3"><rect x="28" y="16" width="30" height="30" fill="${A}"/><rect x="58" y="16" width="30" height="30" fill="${C}"/><rect x="28" y="46" width="30" height="30" fill="${C}"/><rect x="58" y="46" width="30" height="30" fill="${A}"/></g><rect x="28" y="16" width="60" height="60" fill="none" stroke="${O}" stroke-width="2"/>`,
  suelo: `<path d="M12 60l48-24 48 24-48 24z" fill="#d9b48a"/><path d="M24 54l48 24M36 48l48 24M48 42l48 24" stroke="#b88a5a" stroke-width="2"/><path d="M12 60l48-24 48 24-48 24z" fill="none" stroke="${O}" stroke-width="2"/>`,
  cable: `<circle cx="54" cy="46" r="26" fill="${A}"/><circle cx="54" cy="46" r="18" fill="none" stroke="${C}" stroke-width="3"/><circle cx="54" cy="46" r="10" fill="${B}"/><path d="M78 56c10 4 14 10 16 18" fill="none" stroke="${Y}" stroke-width="5" stroke-linecap="round"/>`,
  enchufe: `<rect x="34" y="18" width="52" height="54" rx="9" fill="${B}" stroke="${O}" stroke-width="2.5"/><circle cx="60" cy="45" r="17" fill="${G}"/><circle cx="53" cy="45" r="3" fill="${O}"/><circle cx="67" cy="45" r="3" fill="${O}"/>`,
  luz: `<circle cx="60" cy="38" r="22" fill="${Y}" opacity=".35"/><rect x="34" y="24" width="52" height="10" rx="5" fill="${O}"/><path d="M40 34h40l-8 12H48z" fill="${M}"/><circle cx="60" cy="50" r="6" fill="${Y}"/><path d="M60 62v8M48 60l-4 6M72 60l4 6" stroke="${Y}" stroke-width="3" stroke-linecap="round"/>`,
  cuadro: `<rect x="28" y="18" width="64" height="56" rx="5" fill="${G}" stroke="${O}" stroke-width="2.5"/><g fill="${B}" stroke="${O}" stroke-width="1.5"><rect x="36" y="30" width="10" height="32" rx="2"/><rect x="50" y="30" width="10" height="32" rx="2"/><rect x="64" y="30" width="10" height="32" rx="2"/><rect x="78" y="30" width="8" height="32" rx="2"/></g><g fill="${A}"><rect x="38" y="40" width="6" height="8"/><rect x="52" y="40" width="6" height="8"/><rect x="66" y="40" width="6" height="8"/></g><rect x="79" y="40" width="6" height="8" fill="${Y}"/>`,
  tubo: `<rect x="16" y="38" width="62" height="14" rx="3" fill="${M}"/><path d="M78 34h10a10 10 0 0 1 10 10v28h-14V48h-6z" fill="${A}"/><rect x="12" y="35" width="10" height="20" rx="2" fill="${O}"/><rect x="82" y="70" width="18" height="8" rx="2" fill="${O}"/>`,
  grifo: `<rect x="40" y="62" width="40" height="10" rx="3" fill="${M}"/><path d="M52 62V34a14 14 0 0 1 28 0v6h-8v-6a6 6 0 0 0-12 0v28z" fill="${A}"/><rect x="46" y="22" width="22" height="7" rx="3" fill="${O}"/><path d="M76 46c0 6 4 8 4 12a4 4 0 0 1-8 0c0-4 4-6 4-12z" fill="${C}"/>`,
  inodoro: `<rect x="34" y="14" width="30" height="24" rx="4" fill="${B}" stroke="${O}" stroke-width="2.5"/><path d="M30 42h54c0 14-10 22-22 22h-6l4 12H40l4-12c-8-2-14-10-14-22z" fill="${B}" stroke="${O}" stroke-width="2.5"/><ellipse cx="57" cy="44" rx="20" ry="4" fill="${C}"/><rect x="42" y="20" width="12" height="4" rx="2" fill="${A}"/>`,
  ducha: `<path d="M18 60l42-14 42 14-42 14z" fill="${B}" stroke="${O}" stroke-width="2.5"/><ellipse cx="60" cy="60" rx="5" ry="2.5" fill="${M}"/><path d="M80 52V16H64" fill="none" stroke="${O}" stroke-width="3"/><path d="M56 16h16l-3 6H59z" fill="${A}"/><path d="M60 26v6M64 26v8M68 26v6" stroke="${C}" stroke-width="2.5" stroke-linecap="round"/>`,
  mampara: `<rect x="26" y="12" width="34" height="64" rx="2" fill="${C}" opacity=".8" stroke="${O}" stroke-width="2.5"/><rect x="56" y="12" width="38" height="64" rx="2" fill="${C}" opacity=".55" stroke="${O}" stroke-width="2.5"/><path d="M34 22l12-6M64 24l16-8" stroke="${B}" stroke-width="3" stroke-linecap="round"/><rect x="60" y="40" width="4" height="12" rx="2" fill="${O}"/>`,
  lavabo: `<rect x="24" y="44" width="72" height="30" rx="3" fill="${A}"/><path d="M60 44v30" stroke="${C}" stroke-width="2"/><circle cx="54" cy="59" r="2" fill="${B}"/><circle cx="66" cy="59" r="2" fill="${B}"/><path d="M20 38h80c0 4-4 8-8 8H28c-4 0-8-4-8-8z" fill="${B}" stroke="${O}" stroke-width="2.5"/><path d="M58 38V26a6 6 0 0 1 12 0" fill="none" stroke="${O}" stroke-width="3"/>`,
  cocina: `<rect x="22" y="40" width="76" height="36" rx="3" fill="${G}" stroke="${O}" stroke-width="2"/><rect x="18" y="34" width="84" height="8" rx="2" fill="${O}"/><rect x="30" y="48" width="26" height="22" rx="2" fill="${B}" stroke="${M}"/><rect x="64" y="48" width="26" height="22" rx="2" fill="${B}" stroke="${M}"/><path d="M76 34V20a6 6 0 0 1 12 0" fill="none" stroke="${A}" stroke-width="3.5"/>`,
  pintura: `<rect x="30" y="34" width="46" height="40" rx="4" fill="${A}"/><ellipse cx="53" cy="34" rx="23" ry="6" fill="${O}"/><path d="M30 46h46" stroke="${C}" stroke-width="3"/><rect x="70" y="14" width="26" height="12" rx="3" fill="${Y}"/><path d="M96 20h4v14H84v8" fill="none" stroke="${O}" stroke-width="3"/><rect x="80" y="42" width="8" height="18" rx="2" fill="${O}"/>`,
  puerta: `<rect x="38" y="10" width="44" height="70" rx="2" fill="${B}" stroke="${O}" stroke-width="2.5"/><rect x="44" y="16" width="32" height="24" rx="1" fill="${G}"/><rect x="44" y="46" width="32" height="28" rx="1" fill="${G}"/><rect x="70" y="42" width="8" height="3" rx="1.5" fill="${Y}"/><path d="M26 80h68" stroke="${M}" stroke-width="3"/>`,
  ventana: `<rect x="28" y="12" width="64" height="66" rx="3" fill="${B}" stroke="${O}" stroke-width="3"/><rect x="34" y="18" width="24" height="54" fill="${C}"/><rect x="62" y="18" width="24" height="54" fill="${C}"/><path d="M38 28l10-6M66 30l12-7" stroke="${B}" stroke-width="3" stroke-linecap="round"/><rect x="56" y="40" width="3" height="12" rx="1.5" fill="${O}"/>`,
  termo: `<rect x="40" y="10" width="40" height="66" rx="18" fill="${B}" stroke="${O}" stroke-width="2.5"/><circle cx="60" cy="56" r="7" fill="${G}" stroke="${M}"/><path d="M60 56l3-4" stroke="${A}" stroke-width="2"/><path d="M52 76v6M68 76v6" stroke="${M}" stroke-width="3"/><rect x="50" y="22" width="20" height="4" rx="2" fill="${A}"/>`,
  aire: `<rect x="16" y="22" width="88" height="30" rx="8" fill="${B}" stroke="${O}" stroke-width="2.5"/><path d="M24 44h72" stroke="${G}" stroke-width="4"/><circle cx="92" cy="31" r="2.5" fill="${A}"/><path d="M36 60c0 4 4 4 4 8s-4 4-4 8M60 60c0 4 4 4 4 8s-4 4-4 8M84 60c0 4 4 4 4 8s-4 4-4 8" fill="none" stroke="${A}" stroke-width="3" stroke-linecap="round"/>`,
  radiador: `<g fill="${B}" stroke="${O}" stroke-width="2"><rect x="26" y="20" width="12" height="52" rx="5"/><rect x="40" y="20" width="12" height="52" rx="5"/><rect x="54" y="20" width="12" height="52" rx="5"/><rect x="68" y="20" width="12" height="52" rx="5"/><rect x="82" y="20" width="12" height="52" rx="5"/></g><path d="M20 28h6M94 64h6" stroke="${A}" stroke-width="4"/>`,
  herramienta: `<path d="M24 66l34-34" stroke="#b07a46" stroke-width="7" stroke-linecap="round"/><path d="M56 22l22-6 6 22-22 6z" fill="${M}" stroke="${O}" stroke-width="2"/><rect x="62" y="54" width="40" height="18" rx="2" fill="${A}"/><path d="M82 54V42" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,
  proteccion: `<path d="M20 70h80" stroke="${O}" stroke-width="3"/><path d="M28 70V40l32-22 32 22v30" fill="${C}" stroke="${O}" stroke-width="2.5"/><path d="M28 50h64" stroke="${Y}" stroke-width="6"/><path d="M28 50h64" stroke="${O}" stroke-width="6" stroke-dasharray="8 8"/>`,
  tornilleria: `<path d="M44 18h16v10H44z" fill="${O}"/><path d="M48 28h8v40l-4 8-4-8z" fill="${M}"/><path d="M48 34l8 4M48 42l8 4M48 50l8 4M48 58l8 4" stroke="${O}" stroke-width="1.5"/><circle cx="78" cy="48" r="14" fill="${A}"/><circle cx="78" cy="48" r="6" fill="${B}"/>`,
  sellador: `<rect x="22" y="38" width="56" height="18" rx="4" fill="${B}" stroke="${O}" stroke-width="2.5"/><path d="M78 42l22-4v14l-22-4z" fill="${M}"/><rect x="30" y="42" width="24" height="10" rx="2" fill="${A}"/><path d="M14 47h8" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,
};

// Palabra clave del nombre → dibujo. El orden importa: lo más concreto primero.
const REGLAS = [
  [/mampara/i, "mampara"], [/plato de ducha|columna|ducha|sumidero/i, "ducha"], [/inodoro|wc|cisterna|bastidor|taza/i, "inodoro"],
  [/grifo|grifer[ií]a|monomando|bimando|latiguillo|llave de escuadra/i, "grifo"], [/fregadero|encimera|placa de inducci|campana|horno|lavavajillas/i, "cocina"],
  [/lavabo|mueble de ba|espejo|sif[oó]n|v[aá]lvula clic/i, "lavabo"], [/termo|calentador|aerotermo|acs/i, "termo"],
  [/aire acondicionado|split|frigor/i, "aire"], [/radiador|toallero|emisor|caldera|termostato|v[aá]lvula termost/i, "radiador"],
  [/puerta|manilla|bomb[ií]n|cerradura|tapajuntas|tapeta|herraje/i, "puerta"], [/ventana|persiana|mosquitera/i, "ventana"],
  [/cable|manguera|rz1|h07/i, "cable"], [/enchufe|interruptor|conmutador|base |mecanismo|marco|toma |regleta|caja de empotrar|caja empotrar/i, "enchufe"],
  [/downlight|led|plaf[oó]n|panel|bombilla|foco|ventilador|extractor|sensor/i, "luz"], [/magnetot|diferencial|cuadro|autom[aá]tico/i, "cuadro"],
  [/tubo|tuber[ií]a|multicapa|pex|ppr|cobre|codo|manguito|entronque|bote sif|llave de paso|\bte\b/i, "tubo"],
  [/pintura|esmalte|imprimaci|barniz|plaste|rodillo|temple|selladora/i, "pintura"], [/silicona|sellador|adhesivo|espuma|masilla|cola /i, "sellador"],
  [/azulejo|porcel[aá]nico|gres|baldosa|revestimiento|cer[aá]mic|rodapi[eé] cer/i, "azulejo"],
  [/laminado|vin[ií]lico|parquet|tarima|rodapi[eé]|base aislante|perfil de transici/i, "suelo"],
  [/placa|pladur|yeso laminado|cart[oó]n.?yeso|aquaroc|phonique/i, "placa"], [/montante|canal|perfil|omega|guardavivos|maestra|cantonera/i, "perfil"],
  [/lana|aislamiento|xps|poliestireno extruido|antiimpacto|l[aá]mina/i, "aislamiento"], [/ladrillo|bloque|rasill|bardo|termoarcilla/i, "ladrillo"],
  [/pasta|cubo|junta|impermeabiliz|cemento cola|mortero cola/i, "cubo"], [/cemento|mortero|yeso|escayola|arena|hormig[oó]n|saco/i, "saco"],
  [/llana|paleta|talocha|disco|broca|puntal|herramienta|guantes|cinta/i, "herramienta"], [/tornillo|anclaje|taco/i, "tornilleria"],
  [/escombro|big bag|film|cart[oó]n protector|protecci/i, "proteccion"],
];
const POR_CATEGORIA = {
  "Albañilería y morteros": "saco", "Tabiquería seca": "placa", "Cerámica y colocación": "azulejo", "Electricidad": "enchufe",
  "Fontanería y saneamiento": "tubo", "Pintura": "pintura", "Baño y cocina": "lavabo", "Suelos": "suelo", "Puertas y ventanas": "puerta",
  "Climatización y agua caliente": "radiador", "Aislamiento": "aislamiento", "Obra y protección": "proteccion",
};
// Fondo suave por categoría para que cada sección tenga su color.
const FONDO = {
  "Albañilería y morteros": "#fff4dc", "Tabiquería seca": "#eef2f8", "Cerámica y colocación": "#e8f0ff", "Electricidad": "#fff7d6",
  "Fontanería y saneamiento": "#e6f4ff", "Pintura": "#eaf0ff", "Baño y cocina": "#e7f6f5", "Suelos": "#fbefe3", "Puertas y ventanas": "#f1eefc",
  "Climatización y agua caliente": "#fdecec", "Aislamiento": "#fff6dc", "Obra y protección": "#eef2f8",
};

export function tipoDibujo(nombre, categoria) {
  return (REGLAS.find(([r]) => r.test(nombre)) || [, POR_CATEGORIA[categoria] || "saco"])[1];
}
export function ilustracion(nombre, categoria) {
  const t = tipoDibujo(nombre, categoria);
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Ilustración: ${t}" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="48" r="38" fill="#fff" opacity=".7"/>${D[t]}</svg>`;
}
export const fondo = (categoria) => FONDO[categoria] || "#eef2f8";
