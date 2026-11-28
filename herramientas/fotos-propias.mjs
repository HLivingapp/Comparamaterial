// Fotos propias de reformas (img/reforma-<elemento>-<n>.webp) para reconocer cada tipo de producto.
// Son fotos orientativas del tipo de producto (no del modelo exacto), de reformas reales terminadas en Madrid.
import { readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { subgrupo } from "./subgrupos.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "img");
const POOL = {};
if (existsSync(dir)) for (const f of readdirSync(dir).sort()) { const m = f.match(/^reforma-(.+)-(\d+)\.webp$/); if (m) (POOL[m[1]] ||= []).push(`img/${f}`); }

// Subgrupo → elemento fotografiado. Una función decide por el nombre cuando el subgrupo mezcla cosas.
const AZ = (def) => (n) => /hidr[aá]ulic|patchwork|encaustic/i.test(n) ? "azulejo-hidraulico" : /\bmetro\b|subway|biselad/i.test(n) ? "azulejo-metro" : def;
const ELEMENTO = {
  "Muebles de baño": "mueble-bano", "Inodoros y cisternas": (n) => /inodoro|taza|wc|suspendido|compacto/i.test(n) && !/tapa|asiento|cisterna|bastidor/i.test(n) ? "inodoro" : null,
  "Lavabos": "lavabo", "Platos de ducha": "plato-ducha", "Bañeras": "banera", "Columnas y duchas": "columna-ducha", "Espejos": "espejo-bano",
  "Mamparas": (n) => /negr|black/i.test(n) ? "mampara-negra" : "mampara",
  "Grifería de baño": (n) => /empotr/i.test(n) ? "grifo-empotrado" : /negr|black/i.test(n) ? "grifo-negro" : /dorad|\boro\b|gold/i.test(n) ? "grifo-dorado" : /crom/i.test(n) ? "grifo-cromo" : "grifo-lavabo",
  "Accesorios de baño": (n) => /toallero/i.test(n) ? "toallero" : null,
  "Fregaderos": "fregadero", "Grifería de cocina": (n) => /dorad|\boro\b|gold/i.test(n) ? "grifo-cocina-dorado" : "grifo-cocina", "Placas": "placa", "Hornos": "horno", "Campanas": "campana",
  "Encimeras": (n) => /porcel|dekton|laminam|compac|neolith|cer[aá]mic/i.test(n) ? "encimera-porcelanica" : "encimera",
  "Termos hasta 50 L": "termo-electrico", "Termos de 65 a 90 L": "termo-electrico", "Termos de 100 L o más": "termo-electrico", "Termos (otros)": "termo-electrico",
  "Calderas de gas": "caldera", "Termostatos y válvulas": (n) => /termostato|cronotermo/i.test(n) ? "termostato" : null,
  "Radiadores y emisores": (n) => /radiador/i.test(n) && !/toallero/i.test(n) ? "radiador" : /toallero/i.test(n) ? "toallero" : null,
  "Splits de pared": "split", "Splits y unidades (otros)": "split", "Multisplit": "split",
  "Empotrados: downlights y paneles": (n) => /panel/i.test(n) ? "panel-led" : "downlight", "Focos de superficie y carril": "foco-carril",
  "Iluminación decorativa: colgantes, apliques y lámparas": (n) => /aplique/i.test(n) ? "aplique" : "lampara-colgante", "Plafones": "plafon",
  "Tiras LED y perfiles": (n) => /^\W*(tira|perfil)/i.test(n) ? "tira-led" : null,
  "Mecanismos: interruptores y enchufes": (n) => /enchufe|base|schuko|toma de corriente/i.test(n) ? "enchufe" : /interruptor|conmutador|pulsador/i.test(n) ? "interruptor" : null,
  "Puertas de interior abatibles": (n) => /moldura|plaf[oó]n|cuarter|\b\dc\b|\blola\b|cl[aá]sic|provenz/i.test(n) ? "puerta-molduras" : "puerta-lisa",
  "Puertas correderas": (n) => /vidrio|cristal|alumin/i.test(n) ? "puerta-corredera" : "puerta-lisa",
  "Puertas de entrada y blindadas": (n) => /puerta|block|blindad|acorazad/i.test(n) ? "puerta-entrada" : null,
  "Manillas, pomos y condenas": (n) => /manilla|roseta/i.test(n) ? "manilla" : null,
  "Ventanas de PVC": "ventana", "Ventanas de aluminio": "ventana", "Ventanas de madera": "ventana", "Balconeras": "balconera",
  "Armarios y módulos": "armario", "Frentes y puertas de armario": "armario",
  "Laminado AC4": "suelo-laminado", "Laminado AC5": "suelo-laminado", "Laminado AC6": "suelo-laminado", "Laminado (otras clases)": "suelo-laminado",
  "Vinílico SPC/LVT": "suelo-laminado", "Madera y parquet": "parquet", "Porcelánico imitación": "suelo-porcelanico", "Rodapiés": "rodapie",
  "Formato medio (hasta 60 cm)": AZ("azulejo-bano"), "Mosaico y formato pequeño (hasta 20 cm)": AZ("azulejo-bano"), "Azulejos y pavimentos (otros)": AZ("azulejo-bano"), "Gran formato (más de 60 cm)": AZ("azulejo-gran-formato"),
  "Paneles de listones y acústicos": "panel-listones",
};
const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
// Devuelve la ruta (img/…) de una foto propia para ese producto, o null.
export function fotoPropia(area, nombre) {
  const e = ELEMENTO[subgrupo(area, nombre)];
  const el = typeof e === "function" ? e(nombre) : e;
  const pool = el && POOL[el];
  return pool && pool.length ? pool[hash(nombre) % pool.length] : null;
}
