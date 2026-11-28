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
const ELEMENTO = {
  "Muebles de baño": "mueble-bano", "Inodoros y cisternas": (n) => /inodoro|taza|wc|suspendido|compacto/i.test(n) && !/tapa|asiento|cisterna|bastidor/i.test(n) ? "inodoro" : null,
  "Lavabos": "lavabo", "Platos de ducha": "plato-ducha", "Mamparas": "mampara", "Bañeras": "banera", "Columnas y duchas": "columna-ducha",
  "Grifería de baño": "grifo-lavabo", "Espejos": "espejo-bano", "Accesorios de baño": (n) => /toallero/i.test(n) ? "toallero" : null,
  "Fregaderos": "fregadero", "Grifería de cocina": "grifo-cocina", "Encimeras": "encimera", "Placas": "placa", "Hornos": "horno", "Campanas": "campana",
  "Radiadores y emisores": (n) => /radiador/i.test(n) && !/toallero/i.test(n) ? "radiador" : /toallero/i.test(n) ? "toallero" : null,
  "Splits de pared": "split", "Splits y unidades (otros)": "split", "Multisplit": "split",
  "Downlights": "downlight", "Mecanismos: interruptores y enchufes": (n) => /enchufe|base|schuko|toma de corriente/i.test(n) ? "enchufe" : /interruptor|conmutador|pulsador/i.test(n) ? "interruptor" : null,
  "Cables e hilos": (n) => /cable|hilo/i.test(n) && !/antena|coaxial|tv/i.test(n) ? "cableado" : null,
  "Puertas de interior abatibles": "puerta-interior", "Puertas de entrada y blindadas": (n) => /puerta|block|blindad|acorazad/i.test(n) ? "puerta-entrada" : null,
  "Manillas, pomos y condenas": (n) => /manilla|roseta/i.test(n) ? "manilla" : null,
  "Ventanas de PVC": "ventana", "Ventanas de aluminio": "ventana", "Ventanas de madera": "ventana", "Balconeras": "balconera",
  "Armarios y módulos": "armario", "Frentes y puertas de armario": "armario",
  "Laminado": "suelo-laminado", "Laminado AC4": "suelo-laminado", "Laminado AC5": "suelo-laminado", "Laminado AC6": "suelo-laminado", "Laminado (otras clases)": "suelo-laminado",
  "Vinílico SPC/LVT": "suelo-laminado", "Madera y parquet": "suelo-madera", "Porcelánico imitación": "suelo-porcelanico", "Rodapiés": "rodapie",
  "Formato medio (hasta 60 cm)": "azulejo-bano", "Mosaico y formato pequeño (hasta 20 cm)": "azulejo-bano", "Azulejos y pavimentos (otros)": "azulejo-bano", "Gran formato (más de 60 cm)": "suelo-porcelanico",
  "Pintura plástica": (n) => /pintura|pl[aá]stica/i.test(n) ? "pintura" : null, "Ladrillo y bloque": (n) => /ladrillo|rasill/i.test(n) ? "ladrillo" : null,
  "Tubería y PVC": (n) => /pvc/i.test(n) ? "tuberia-pvc" : null, "Placas de yeso": (n) => /placa de yeso|pladur|cart[oó]n yeso|pyl/i.test(n) ? "pladur" : null,
};
const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
// Devuelve la ruta (img/…) de una foto propia para ese producto, o null.
export function fotoPropia(area, nombre) {
  const e = ELEMENTO[subgrupo(area, nombre)];
  const el = typeof e === "function" ? e(nombre) : e;
  const pool = el && POOL[el];
  return pool && pool.length ? pool[hash(nombre) % pool.length] : null;
}
