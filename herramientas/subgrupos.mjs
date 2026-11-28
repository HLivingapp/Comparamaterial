// Subgrupos de cada área: el primero que encaje con el nombre del producto se queda con él.
// El orden de la lista es el orden en que salen en la página.
export const SUBGRUPOS = {
  "Baño": [
    ["Muebles de baño", /mueble|conjunto de ba[ñn]o|composici[oó]n|columna auxiliar|armario de ba|armario colgar|m[oó]dulo|pilar/i],
    ["Inodoros y cisternas", /inodoro|\btaza\b|cisterna|bastidor|wc\b|pack.*(suspendido|compacto)|tapa|asiento|bid[eé]/i],
    ["Lavabos", /lavabo|lavamanos|pedestal/i],
    ["Platos de ducha", /plato/i],
    ["Mamparas", /mampara|frontal|pivotante|panel de ducha|pantalla de ba[ñn]era/i],
    ["Bañeras", /ba[ñn]era/i],
    ["Columnas y duchas", /columna|ducha/i],
    ["Grifería de baño", /grifo|monomando|mezclador|termost[aá]tico/i],
    ["Espejos", /espejo/i],
    ["Accesorios de baño", /toallero|portarrollo|jabonera|percha|escobill|dosificador|accesorio|extractor/i],
  ],
  "Cocina": [
    ["Fregaderos", /fregadero/i],
    ["Grifería de cocina", /grifo|monomando/i],
    ["Encimeras", /encimera/i],
    ["Placas", /placa|vitrocer|inducci/i],
    ["Hornos", /horno/i],
    ["Campanas", /campana/i],
    ["Lavavajillas y electrodomésticos", /lavavajillas|frigor|nevera|microondas/i],
  ],
  "Climatización y agua caliente": [
    ["Termos hasta 50 L", (n) => /termo|acumulador/i.test(n) && !/termostat|termoarcilla|aerotermo/i.test(n) && litros(n) > 0 && litros(n) <= 60],
    ["Termos de 65 a 90 L", (n) => /termo|acumulador/i.test(n) && !/termostat|termoarcilla|aerotermo/i.test(n) && litros(n) > 60 && litros(n) <= 90],
    ["Termos de 100 L o más", (n) => /termo|acumulador/i.test(n) && !/termostat|termoarcilla|aerotermo/i.test(n) && litros(n) > 90],
    ["Calentadores de gas", /calentador/i],
    ["Calderas de gas", (n) => /caldera/i.test(n) && !/el[eé]ctrica|gasoil|gas[oó]leo|pellet|le[ñn]a|biomasa/i.test(n)],
    ["Otras calderas", /caldera/i],
    ["Aerotermia y bombas de calor", /aerotermo|aerotermia|bomba de calor|interacumulador|dep[oó]sito/i],
    ["Aire acondicionado", /aire acondicionado|cassette|\b(asy|asg|aug|asy)\b|giada|\d+ ?k\b|\bmudo\b|kios|anori|split|multisplit|conductos|unidad (interior|exterior)|\bfrigor/i],
    ["Radiadores y emisores", /radiador|emisor|toallero|convector|acumulador/i],
    ["Termostatos y válvulas", /termostat|cabezal|v[aá]lvula/i],
    ["Calefactores y ventiladores", /calefactor|ventilador/i],
    ["Accesorios de instalación", /amortiguador|garrafa|silentblock|coquilla|bomba de condensados|soporte|canal clima|tubo|tuber|controlador|kit/i],
    ["Termos (otros)", /termo/i],
  ],
  "Electricidad": [
    ["Cuadro y protecciones", /diferencial|magnetot|cuadro|fusible|contactor|guardamotor|\brel[eé]|protector|sobretensi|\bicp\b|limitador|interruptor autom|seccionador|carril din|base modular|cms\d/i],
    ["Mecanismos: interruptores y enchufes", /interruptor|enchufe|base (de )?enchufe|tecla|marco|conmutador|pulsador|toma|regulador|tapa|placa ciega|cargador usb|base (fija|de empotrar)|adaptador|ladr[oó]n|alargador/i],
    ["Cables e hilos", /cable|hilo|manguera|rollo/i],
    ["Tubos y canaletas", /tubo|corrugado|canaleta|canal|bandeja|manguito|gu[ií]a|[aá]ngulo|abrazadera/i],
    ["Cajas", /caja/i],
    ["Downlights y focos", /downlight|foco|aro|empotrable/i],
    ["Paneles y pantallas LED", /panel|pantalla|regleta/i],
    ["Bombillas", /bombilla|l[aá]mpara|portal[aá]mparas/i],
    ["Tiras LED", /tira/i],
    ["Plafones y apliques", /plaf[oó]n|aplique|colgante|farola|baliza|proyector/i],
    ["Emergencias y detectores", /emergencia|detector|sensor/i],
    ["Bornas y conexión", /borna|terminal|conector|puntera|brida|clema/i],
  ],
  "Fontanería y saneamiento": [
    ["Tubería y PVC", /tubo|tuber[ií]a|multicapa|pex|pvc|rollo/i],
    ["Codos, tes y uniones", /codo|\bte\b|uni[oó]n|manguito|reduc|racor|enlace|injerto|entronque|collar[ií]n|adaptador|tap[oó]n/i],
    ["Llaves y válvulas", /llave|v[aá]lvula|regulador/i],
    ["Desagües, sifones y sumideros", /sif[oó]n|desag[uü]e|sumidero|rejilla|canaleta|bote sif/i],
    ["Cisternas y mecanismos", /cisterna|mecanismo|descargador|pulsador|bastidor/i],
    ["Canalones y bajantes", /canal[oó]n|bajante/i],
  ],
  "Cerámica y colocación": [
    ["Juntas y masillas", (n) => /junta|masilla|borada|fugabella|\bpasta (para|de)/i.test(n) && !/azulejo|porcel|pavimento|revestimiento/i.test(n)],
    ["Adhesivos y cementos cola", /mortero|cemento|adhesivo|\bcola\b/i],
    ["Perfiles, cantoneras y nivelación", /perfil|cantonera|calzo|cu[ñn]a|nivela|cruceta|l[aá]mina/i],
    ["Peldaños, listelos y rodapiés", /pelda[ñn]o|listelo|rodapi[eé]|cenefa|tabica|zanquin/i],
    ["Mosaico y formato pequeño (hasta 20 cm)", (n) => lado(n) > 0 && lado(n) <= 20.5],
    ["Formato medio (hasta 60 cm)", (n) => lado(n) > 20.5 && lado(n) <= 61],
    ["Gran formato (más de 60 cm)", (n) => lado(n) > 61],
    ["Azulejos y pavimentos (otros)", /./],
  ],
  "Suelos": [
    ["Laminado", /laminad/i],
    ["Vinílico SPC/LVT", /vin[ií]lico|spc|lvt|pvc/i],
    ["Madera y parquet", /parquet|madera|multicapa|tarima/i],
    ["Porcelánico imitación", /porcel|gres|azulejo|pavimento|baldosa|cer[aá]mic/i],
    ["Rodapiés", /rodapi/i],
    ["Bases y accesorios", /base|perfil|espuma|underlay/i],
  ],
  "Puertas y ventanas": [
    ["Puertas de interior", /puerta (de )?(interior|paso|abatible|corredera|plegable)|puerta block|puerta lacada|hoja/i],
    ["Puertas de entrada", /blindad|acorazad|entrada/i],
    ["Ventanas y balconeras", /ventana|balconera|oscilobatiente/i],
    ["Armarios y frentes", /armario|komplement|caj[oó]n|zapatero|barra para ropa|cesta|colgador|pantalonero|divisor|frente|balda|costado|trasera|casoneto|vestidor/i],
    ["Manillas, pomos y condenas", /manilla|pomo|condena|tirador|cerrojo|pasador|muletilla|cerradura|bisagra/i],
    ["Correderas y guías", /carril|gu[ií]a|corredera|rueda|kit/i],
    ["Puertas (otras)", /puerta/i],
  ],
  "Pintura": [
    ["Pintura plástica", /pintura|pl[aá]stica|revestimiento|fachada/i],
    ["Esmaltes, barnices y lacas", /esmalte|esmate|barniz|laca|lasur|aceite/i],
    ["Imprimaciones y fondos", /imprimaci|fondo|selladora/i],
    ["Plastes y masillas", /plaste|pasta|masilla|yeso/i],
    ["Rodillos, brochas y cinta", /rodillo|brocha|paletina|pincel|cinta|cubeta|recambio|kit|bandeja/i],
  ],
  "Albañilería y morteros": [
    ["Cemento, mortero y yeso", /cemento|mortero|yeso|escayola|perlita|cal\b/i],
    ["Ladrillo y bloque", /ladrillo|bloque|rasill/i],
    ["Siliconas, selladores y espumas", /silicona|sellador|sella|espuma|masilla|adhesivo|pegamento|polímero/i],
    ["Molduras y varillas", /moldura|varilla/i],
  ],
  "Tabiquería seca": [
    ["Placas de yeso", /placa|panel/i],
    ["Perfiles, montantes y canales", /perfil|montante|canal|maestra/i],
  ],
  "Aislamiento": [
    ["Lana mineral", /lana|roca|vidrio/i],
    ["Poliestireno (XPS/EPS)", /poliestireno|xps|eps/i],
    ["Láminas y bases", /l[aá]mina|base|rollo|capa|aislante/i],
  ],
  "Obra y protección": [
    ["Herramienta eléctrica", /taladro|amoladora|atornillador|lijadora|sierra|cinceladora|multiherramienta|martillo (percutor|demoledor)/i],
    ["Herramienta de mano", /paleta|llana|talocha|esp[aá]tula|paletin|peine|remolinador|martillo|rascador|cuchilla|llave/i],
    ["Brocas y tacos", /broca|taco/i],
    ["Escaleras", /escalera/i],
    ["Cierrapuertas", /cierrapuertas|cierre ts|brazo/i],
    ["Protección de obra", /pl[aá]stico|lona|fieltro|cart[oó]n|cinta|protec/i],
  ],
  "Fotovoltaica": [
    ["Kits completos", /kit/i],
    ["Paneles solares", /panel|placa|m[oó]dulo fotov/i],
    ["Inversores", /inversor|microinversor|optimizador/i],
    ["Baterías", /bater[ií]a|bms|bcu/i],
    ["Reguladores", /regulador/i],
    ["Estructura y fijación", /estructura|presor|perfil|tornillo|gu[ií]a|fijaci|arriostr|end/i],
    ["Cable y protecciones", /cable|hilo|fusible|conector|sobretensi|desconect|caja|portafusible|empalme/i],
    ["Medida y monitorización", /monitoriz|vat[ií]metro|sensor|datalogger|dtu|medidor/i],
  ],
};
export function litros(n) {
  const m = String(n).match(/(\d{2,3})\s*(?:l\b|litros|lts?\b)/i); if (m) return Number(m[1]);
  const t = [...String(n).matchAll(/(?:^|[^\d])0?(30|35|40|45|50|65|75|80|100|120|125|150|200)(?:[^\d]|$)/g)]; return t.length ? Number(t[t.length - 1][1]) : 0;
}
// Lado mayor en cm de un formato tipo «30x60», «7,5x30 cm».
export function lado(n) { const m = String(n).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i); return m ? Math.max(parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", "."))) : 0; }
// «Baño y cocina» en los datos se separa en dos áreas: Cocina y Baño.
const COCINA = /fregadero|encimera|placa (de )?(cocina|inducci|vitro|gas)|placa de inducci|vitrocer|inducci[oó]n|horno|campana|lavavajillas|frigor[ií]fico|nevera|microondas|grifo (de )?cocina|cocina/i;
export function area(categoria, nombre) {
  if (categoria !== "Baño y cocina") return categoria;
  return COCINA.test(nombre) && !/ba[ñn]o|lavabo|ducha|inodoro|mampara/i.test(nombre) ? "Cocina" : "Baño";
}
export function subgrupo(categoria, nombre) {
  for (const [g, r] of SUBGRUPOS[categoria] || []) if (typeof r === "function" ? r(nombre) : r.test(nombre)) return g;
  return "Otros";
}
