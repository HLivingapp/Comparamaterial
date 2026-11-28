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
  climahorro: /^https:\/\/www\.climahorro\.es\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+-\d+\.html$/,
  iluminashop: /^https:\/\/iluminashop\.com\/led-producto\/[^\s?#]+\/$/,
  damiasolar: /^https:\/\/www\.damiasolar\.com\/[a-z0-9-]+\.html$/,
  barcelonaled: /^https:\/\/www\.barcelonaled\.com\/es-es\/products\/[a-z0-9-]+$/,
  masterled: /^https:\/\/masterled\.es\/es\/[a-z0-9-]+\/\d+-[a-z0-9-]+\.html$/,
  woodly: /^https:\/\/woodly\.es\/[a-z0-9-]+\.html$/,
  bricomoraleja: /^https:\/\/www\.bricomoraleja\.com\/producto\/[a-z0-9-]+\/$/,
  pereda: /^https:\/\/saneamientospereda\.es\/[a-z0-9-]+\/[a-z0-9-]+\.html$/,
  leroy: /^https:\/\/www\.leroymerlin\.es\/productos\/[a-z0-9-]+-\d{6,}\.html$/,
  obramat: /^https:\/\/www\.obramat\.es\/productos\/[a-z0-9-]+-\d{6,}\.html$/,
  efectoled: /^https:\/\/(www\.)?efectoled\.com\/es\/[^\s]+\.html$/,
  climaprecio: /^https:\/\/www\.climaprecio\.es\/[^\s]+$/,
  azulejospena: /^https:\/\/tienda\.azulejospena\.es\/producto\/[^\s]+\.html$/,
  bricoelectrico: /^https:\/\/www\.bricoelectrico\.com\/[a-z0-9-]+\/\d+-[^\s]+\.html(#\/[^\s]*)?$/,
  mytile: /^https:\/\/www\.mytile\.online\/[a-z0-9-]+\/[a-z0-9-]+-\d+\.html$/,
  maperi: /^https:\/\/www\.maperi\.com\/producto\/[a-z0-9-]+\/?$/,
  nais: /^https:\/\/nais\.es\/es\/azulejos\/coleccion_[^/\s]+\/producto_\d+_[^/\s]+\/$/,
  lamorenica: /^https:\/\/www\.azulejoslamorenica\.com\/producto\/[a-z0-9-]+\/?$/,
  universoceramiche: /^https:\/\/universoceramiche\.es\/products\/[a-z0-9-]+$/,
  latiendadelazulejo: /^https:\/\/www\.latiendadelazulejo\.com\/producto\/[a-z0-9-]+\/?$/,
  ikea: /^https:\/\/www\.ikea\.com\/es\/(es|en)\/p\/[a-z0-9-]+-s?\d{8}\/?$/,
  banoidea: /^https:\/\/banoidea\.com\/(en\/)?products\/[a-z0-9-]+(\?variant=\d+)?$/,
  tumaterialelectrico: /^https:\/\/www\.tumaterialelectrico\.com\/es\/[^\s]+\/p-\d+$/,
};
const CATEGORIA = [
  [/suelos? de exterior|c[eé]sped artificial|terraza|tarima exterior|composite|\bwpc\b/i, "Terrazas y patios"],
  [/muebles? de cocina|m[oó]dulos? de cocina|cocinas? completas?|\bmetod\b|\bdelinia\b|\benhet\b|\bknoxhult\b/i, "Baño y cocina"],
  [/\bba[ñn]eras?\b/i, "Baño y cocina"],
  [/ventilador(es)? de (techo|pie|pared|sobremesa)/i, "Climatización y agua caliente"],
  [/listones? de madera|paliller[ií]a|revestimiento pared listones|frisos? de madera|fotomurales?|l[aá]minas para cuadros/i, "Decoración y revestimientos"],
  [/papel pintado|papel de pared|fotomural|mural|p[oó]ster|l[aá]mina decorativa|panel(es)? de list[oó]n|tablilla|panel ac[uú]stico|friso|z[oó]calo de madera|revestimiento (decorativo|de madera)/i, "Decoración y revestimientos"],
  [/canal[oó]n|bajante/i, "Fontanería y saneamiento"],
  [/taladro|amoladora|atornillador|escaleras?\b|tacos? de nylon|ferreter[ií]a|cierrapuertas/i, "Obra y protección"],
  [/diferencial|cajas? (de )?registro|caja derivaci|tapa para caja/i, "Electricidad"],
  [/paneles? solar|placas? solar|cable solar|regulador de carga|fotovolt|microinversor|inversor (h[ií]brido|de red|onda pura)|bater[ií]a (de )?(litio|gel|solar|agm)|kit solar|kit autoconsumo|string box|regulador solar|multiplus|dtu|m[oó]dulo dc\/dc|bcu y base|desconectador de bater|cables de conexi[oó]n bater|estructura para panel/i, "Fotovoltaica"],
  [/armario|casoneto|puertas? (blindad|acorazad|abatible|corredera)/i, "Puertas y ventanas"],
  [/pl[aá]stico de protecci|cubretodo|proteger antes de pintar/i, "Obra y protecci\u00f3n"],
  [/rodillo|brocha|carrocero|herramientas para pintar|barniz|barnices/i, "Pintura"],
  [/sif[oó]n|v[aá]lvula|grifer[ií]a de paso|llave de paso|desag[uü]e|descarga|\bpex\b|polietileno reticulado|cisterna/i, "Fontaner\u00eda y saneamiento"],
  [/silicona|sellador|adhesivo de montaje/i, "Alba\u00f1iler\u00eda y morteros"],
  [/poliestireno|\bxps\b|\beps\b|lana de (roca|vidrio)|aislamiento|aislante|\bsate\b/i, "Aislamiento"],
  [/manilla|pomo|roseta|condena|muletilla|puertas? (de interior|correderas|plegables)/i, "Puertas y ventanas"],
  [/calentador|caldera|emisor|termostato|radiador|toallero/i, "Climatización y agua caliente"],
  [/columna de ducha|espejo/i, "Baño y cocina"],
  [/espuma de poliuretano|espumas de poliuretano/i, "Albañilería y morteros"],
  [/rodapi/i, "Suelos"],
  [/placas? de cocina|vitrocer|inducci[oó]n|horno|campana|encimera|fregadero|lavabo|lavamanos/i, "Baño y cocina"],
  [/plaste|masilla(?!.*junta)/i, "Pintura"],
  [/panel(es)? led/i, "Electricidad"],
  [/herramienta|protecci[oó]n de obra|llana|paleta|talocha/i, "Obra y protección"],
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
const unidad = (u = "") => /lote|pack|palet/i.test(u) ? "lote" : /m²|m2/i.test(u) ? "m²" : /caja/i.test(u) ? "caja" : /rollo/i.test(u) ? "rollo" : /^\s*(m|metro|ml)\b/i.test(u) ? "m" : "ud";
// Tiendas especializadas: toda su oferta va a una categoría.
const FIJA = { climahorro: "Climatización y agua caliente", iluminashop: "Electricidad", damiasolar: "Fotovoltaica", efectoled: "Electricidad", tumaterialelectrico: "Electricidad", bricoelectrico: "Electricidad", climaprecio: "Climatización y agua caliente", azulejospena: "Cerámica y colocación", mytile: "Cerámica y colocación", maperi: "Cerámica y colocación", nais: "Cerámica y colocación", lamorenica: "Cerámica y colocación", universoceramiche: "Cerámica y colocación", latiendadelazulejo: "Cerámica y colocación", ikea: "Puertas y ventanas", banoidea: "Baño y cocina", bricomoraleja: "Puertas y ventanas", woodly: "Decoración y revestimientos", barcelonaled: "Iluminación", masterled: "Iluminación" };
// Excepciones dentro de las tiendas especializadas, por la categoría de su web.
const FIJA_EXC = [[/solar|fotovolt|inversor|bater[ií]a/i, "Fotovoltaica"], [/plato|mampara|fregadero|grifo/i, "Baño y cocina"], [/anclajes? qu[ií]mico/i, "Albañilería y morteros"], [/climatiz|aire acondicionado|split|radiador|emisor|toallero|calefactor|ventilador/i, "Climatización y agua caliente"], [/descalcific/i, "Fontanería y saneamiento"]];
const fija = (f) => FIJA[f.tienda] && ((FIJA_EXC.find(([r]) => r.test(f.categoriaWeb || "")) || [, FIJA[f.tienda]])[1]);
const cat = (t) => (CATEGORIA.find(([r]) => r.test(t)) || [, null])[1];

const enUso = new Set(precios.materiales.flatMap((m) => m.ofertas.map((o) => o.enlace)));
const porEnlace = new Map(actual.productos.map((p) => [p.enlace, p]));
const filas = JSON.parse(readFileSync(origen, "utf8"));
let nuevos = 0, actualizados = 0, descartados = 0;
for (const f of filas) {
  // Se quita la parte ?… salvo ?variant= (tiendas Shopify: el precio es el de esa variante).
  const enlace = String(f.enlace || "").replace(/\?(?!variant=\d+$).*$/, "").replace(/#$/, "");
  const precio = typeof f.precio === "number" ? f.precio : parseFloat(String(f.precio).replace(/\s/g, "").replace(",", "."));
  const categoria = fija(f) || cat(f.categoriaWeb || "") || cat(f.producto || "");
  if (!PATRON[f.tienda]?.test(enlace) || !(precio > 0 && precio < 20000) || !f.producto || !categoria || /igic/i.test(f.unidad || "") || enUso.has(enlace)) { descartados++; continue; }
  const p = { tienda: f.tienda, categoria, nombre: String(f.producto).replace(/\s+/g, " ").trim(), precio: Math.round(precio * 100) / 100, unidad: unidad(f.unidad), ...(f.precioM2 > 0 && !/lote/i.test(f.unidad || "") ? { precioM2: f.precioM2 } : {}), enlace, fecha };
  if (porEnlace.has(enlace)) { Object.assign(porEnlace.get(enlace), p); actualizados++; } else { porEnlace.set(enlace, p); nuevos++; }
}
const productos = [...porEnlace.values()].sort((a, b) => a.categoria.localeCompare(b.categoria, "es") || a.nombre.localeCompare(b.nombre, "es"));
writeFileSync(rutaCat, JSON.stringify({ nota: "Precios públicos con IVA leídos en las páginas de categoría de cada tienda. Un producto por tienda; la comparación entre tiendas está en precios.json.", productos }, null, 2) + "\n");
console.log(`Nuevos ${nuevos}, actualizados ${actualizados}, descartados ${descartados}. Total ${productos.length}.`);
