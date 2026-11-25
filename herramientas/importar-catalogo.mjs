// Añade a datos/catalogo.json los productos leídos de páginas de categoría de las tiendas.
// Uso: node herramientas/importar-catalogo.mjs filas.json [AAAA-MM-DD]
// Cada fila: {tienda, categoriaWeb, producto, precio, unidad, precioM2?, enlace}
// Solo precios públicos con IVA de la web de cada tienda. Se descartan enlaces que no sean fichas de producto.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const [, , origen, fechaArg] = process.argv;
if (!origen) { console.error("Falta el archivo de filas"); process.exit(1); }
const fecha = fechaArg || new Date().toISOString().slice(0, 10);
const rutaCat = join(raiz, "datos", "catalogo.json");
const precios = JSON.parse(readFileSync(join(raiz, "datos", "precios.json"), "utf8"));
const actual = existsSync(rutaCat) ? JSON.parse(readFileSync(rutaCat, "utf8")) : { productos: [] };

const PATRON = {
  leroy: /^https:\/\/www\.leroymerlin\.es\/productos\/[a-z0-9-]+-\d{6,}\.html$/,
  obramat: /^https:\/\/www\.obramat\.es\/productos\/[a-z0-9-]+-\d{6,}\.html$/,
};
const CATEGORIA = [
  [/placa|yeso laminado|pladur|perfil/i, "Tabiquería seca"],
  [/cemento cola|junta|azulejo|revestimiento|cer[aá]mic/i, "Cerámica y colocación"],
  [/cemento|mortero|yeso|ladrillo|bloque|hormig|arena/i, "Albañilería y morteros"],
  [/aislamiento|lana/i, "Aislamiento"],
  [/termo|aire acondicionado|split|radiador|calefacci|climatiz/i, "Climatización y agua caliente"],
  [/suelo|parquet|tarima|laminado|vin[ií]lico|porcel[aá]nico/i, "Suelos"],
  [/cable|mecanismo|enchufe|interruptor|protecci[oó]n|cuadro|ilumina|downlight|led|el[eé]ctric/i, "Electricidad"],
  [/tuber[ií]a|fontaner|multicapa|pvc|saneamiento/i, "Fontanería y saneamiento"],
  [/grifer|inodoro|plato|mampara|mueble de ba[nñ]o|lavabo|fregadero|cocina|ba[nñ]o/i, "Baño y cocina"],
  [/pintura|esmalte|imprimaci|barniz/i, "Pintura"],
  [/puerta|ventana/i, "Puertas y ventanas"],
  [/herramienta|protecci[oó]n de obra|obra/i, "Obra y protección"],
];
const cat = (t) => (CATEGORIA.find(([r]) => r.test(t)) || [, null])[1];

const enUso = new Set(precios.materiales.flatMap((m) => m.ofertas.map((o) => o.enlace)));
const porEnlace = new Map(actual.productos.map((p) => [p.enlace, p]));
const filas = JSON.parse(readFileSync(origen, "utf8"));
let nuevos = 0, actualizados = 0, descartados = 0;
for (const f of filas) {
  const enlace = String(f.enlace || "").split("?")[0];
  const precio = typeof f.precio === "number" ? f.precio : parseFloat(String(f.precio).replace(/\s/g, "").replace(",", "."));
  const categoria = cat(f.categoriaWeb || "") || cat(f.producto || "");
  if (!PATRON[f.tienda]?.test(enlace) || !(precio > 0 && precio < 20000) || !f.producto || !categoria || /igic/i.test(f.unidad || "") || enUso.has(enlace)) { descartados++; continue; }
  const p = { tienda: f.tienda, categoria, nombre: String(f.producto).replace(/\s+/g, " ").trim(), precio: Math.round(precio * 100) / 100, unidad: /lote|pack/i.test(f.unidad || "") ? "lote" : /m²|m2/i.test(f.unidad || "") ? "m²" : "ud", ...(f.precioM2 > 0 && !/lote/i.test(f.unidad || "") ? { precioM2: f.precioM2 } : {}), enlace, fecha };
  if (porEnlace.has(enlace)) { Object.assign(porEnlace.get(enlace), p); actualizados++; } else { porEnlace.set(enlace, p); nuevos++; }
}
const productos = [...porEnlace.values()].sort((a, b) => a.categoria.localeCompare(b.categoria, "es") || a.nombre.localeCompare(b.nombre, "es"));
writeFileSync(rutaCat, JSON.stringify({ nota: "Precios públicos con IVA leídos en las páginas de categoría de cada tienda. Un producto por tienda; la comparación entre tiendas está en precios.json.", productos }, null, 2) + "\n");
console.log(`Nuevos ${nuevos}, actualizados ${actualizados}, descartados ${descartados}. Total ${productos.length}.`);
