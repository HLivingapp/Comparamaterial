// Subgrupos de cada área. SUBGRUPOS da el orden de COMPROBACIÓN: el primero que encaje se queda el producto,
// por eso los recambios y accesorios se comprueban antes (un «pomo para puerta» no es una puerta).
// VISTA da el orden en que salen en la página: primero lo más representativo del área, al final los accesorios.
const ACC_LUZ = /^\W*(toma|juego|rectificador|driver|fuente|transformador|conector|tap[oó]n|tapa|clip|grapa|kit|marco|soporte|borna|portal[aá]mparas|casquillo|flor[oó]n|embellecedor|arandela|condensador|mando|controlador|cable|empalme|uni[oó]n|esquina|accesorio|recambio|repuesto|adaptador|base|regleta de conexi)/i;
const ACC_INST = /amortiguador|garrafa|silentblock|coquilla|bomba de condensados|soporte|canal clima|tubo|tuber|controlador|\bkit\b|rollo|cobre|drenaje|\by para\b|sensor|sonda/i;
const termo = (n) => /termo|acumulador/i.test(n) && !/termostat|termoarcilla|aerotermo/i.test(n);
// Muebles de cocina: módulos, columnas, cocinas completas (Delinia, METOD…).
export const MUEBLE_COCINA = /composici[oó]n de cocina|columna de cocina|semi ?columna|frente de caj[oó]n|m[oó]dulo (de )?cocina|casco (de )?cocina|puerta (de )?cocina|muebles? (bajo|alto|de cocina|fregadero|para fregadero|columna|horno|esquin|rinc)|m[oó]dulo (bajo|alto|columna|de cocina|fregadero|horno|esquin)|columna (de |para )?(horno|frigo|nevera|despensa)|armario (bajo|alto|de pared|de columna|de esquina|para (horno|frigo|fregadero))|cocina (completa|modular|en kit|lineal)|kit de cocina|frente de (cocina|lavavajillas)|puerta (de|para) (mueble de )?cocina|\b(metod|delinia|enhet|knoxhult)\b/i;
export const SUBGRUPOS = {
  "Baño": [
    ["Recambios, desagües y fijaciones", /tornillo|recambio|repuesto|v[aá]lvula|rejilla|rejlla|brazo (de )?sujeci|bisagra|\bjunta|flexo|latiguillo|desag[uü]e|sif[oó]n|fijaci|perlizador|aireador|cartucho|maneta|tap[oó]n|silicona|embellecedor|llave de escuadra|base lavabo|kit de/i],
    ["Muebles de baño", /mueble|conjunto de ba[ñn]o|composici[oó]n|columna auxiliar|armario de ba|armario colgar|m[oó]dulo|pilar/i],
    ["Mamparas", /mampara|frontal|pivotante|panel de ducha|pantalla de ba[ñn]era/i],
    ["Grifería de baño", (n) => /grifo|monomando|mezclador|termost[aá]tico|grifer/i.test(n) && !/columna|conjunto de ducha|barra (de )?ducha|set de ducha|orificio|sin grifer|^\W*(lavabo|lavamanos|encimera|fregadero|plato|bañera|inodoro|bid[eé])\b/i.test(n)],
    ["Columnas y duchas", /columna|conjunto de ducha|rociador|teleducha|barra (de )?ducha|brazo de ducha|set de ducha|ducha de mano|equipo de ducha|alcachofa/i],
    ["Platos de ducha", /plato/i],
    ["Bañeras", /ba[ñn]era/i],
    ["Inodoros y cisternas", /inodoro|\btaza\b|cisterna|bastidor|\bwc\b|suspendido|compacto|asiento|bid[eé]|\btapa\b/i],
    ["Lavabos", /lavabo|lavamanos|pedestal/i],
    ["Espejos", /espejo/i],
    ["Accesorios de baño", /toallero|portarrollo|jabonera|percha|escobill|dosificador|accesorio|extractor|repisa|estante|tirador|pomo|asa\b/i],
  ],
  "Cocina": [
    ["Muebles de cocina", MUEBLE_COCINA],
    ["Recambios y accesorios", /^\W*(repuesto|recambio|mango|flexo|v[aá]lvula|sif[oó]n|tap[oó]n|cesta|escurridor|filtro|kit)|repuesto|recambio/i],
    ["Grifería de cocina", /grifo|monomando/i],
    ["Fregaderos", /fregadero/i],
    ["Encimeras", /encimera/i],
    ["Placas", /placa|vitrocer|inducci/i],
    ["Hornos", /horno/i],
    ["Campanas", /campana/i],
    ["Lavavajillas y electrodomésticos", /lavavajillas|frigor|nevera|microondas/i],
  ],
  "Calefacción y agua caliente": [
    ["Termostatos y válvulas", /termostat|cabezal|v[aá]lvula|cronotermo/i],
    ["Termos hasta 50 L", (n) => termo(n) && litros(n) > 0 && litros(n) <= 60],
    ["Termos de 65 a 90 L", (n) => termo(n) && litros(n) > 60 && litros(n) <= 90],
    ["Termos de 100 L o más", (n) => termo(n) && litros(n) > 90],
    ["Termos (otros)", termo],
    ["Accesorios de instalación", ACC_INST],
    ["Calentadores de gas", /calentador/i],
    ["Calderas de gas", (n) => /caldera/i.test(n) && !/el[eé]ctrica|gasoil|gas[oó]leo|pellet|le[ñn]a|biomasa/i.test(n)],
    ["Otras calderas", /caldera/i],
    ["Aerotermia y bombas de calor", /aerotermo|aerotermia|bomba de calor|interacumulador|dep[oó]sito|monobloc|bibloc|altherma|aquarea|ecodan/i],
    ["Radiadores y emisores", /radiador|emisor|toallero|convector|acumulador/i],
  ],
  "Aire acondicionado": [
    ["Calefactores y ventiladores", /calefactor|ventilador/i],
    ["Accesorios de instalación", ACC_INST],
    ["Portátiles", /port[aá]til/i],
    ["Multisplit", /multisplit|multi split|2x1|3x1|4x1/i],
    ["Conductos y cassette", /conductos|cassette|\baug\b/i],
    ["Suelo-techo y techo", /suelo[- ]?techo|techo/i],
    ["Splits de pared", /split|\bmudo\b|kios|anori|\b(asy|asg)\b|giada|pared/i],
    ["Splits y unidades (otros)", /./],
  ],
  "Electricidad": [
    ["Bornas y conexión", /borna|terminal|conector|puntera|brida|clema|empalme|wago/i],
    ["Fijación y cinta aislante", /cinta aislante|^\W*grapa|^\W*taco|^\W*garra|^\W*anilla|^\W*arandela|colgador/i],
    ["TV y antena", /\btv\b|antena|repartidor|distribuidor|m[aá]stil|coaxial|derivador/i],
    ["Bases múltiples, clavijas y prolongadores", /base (modular|m[oó]vil|m[uú]ltiple)|doble base|clavija|prolongador|regleta|adaptador|ladr[oó]n|bobina|enrollacables/i],
    ["Tubos y canaletas", /tubo|corrugado|canaleta|bandeja|abrazadera|mini canal|[aá]ngulo|derivaci[oó]n en|envolvente/i],
    ["Cajas", /^\W*caja|tapa (para )?caja|caja de (empotrar|registro|mecanismo|derivaci|superficie)/i],
    ["Cuadro y protecciones", /diferencial|magnetot|cuadro|fusible|contactor|guardamotor|\brel[eé]|protector|sobretensi|\bicp\b|limitador|interruptor autom|seccionador|carril din|\bdin\b|peine|contador|piloto|selector|contacto se/i],
    ["Emergencias y detectores", /emergencia|detector|sensor/i],
    ["Mecanismos: interruptores y enchufes", /interruptor|enchufe|base (de )?enchufe|tecla|marco|conmutador|pulsador|toma|regulador|tapa|placa ciega|cargador usb|schuko|mecanismo/i],
    ["Cables e hilos", /cable|hilo|manguera|rollo/i],
  ],
  "Iluminación": [
    ["Drivers, conectores y accesorios", (n) => ACC_LUZ.test(n) || /^\W*gu[ií]a|carril din/i.test(n)],
    ["Exterior", /farola|baliza|proyector|exterior|jard[ií]n|estaca/i],
    ["Empotrados: downlights y paneles", (n) => /downlight|empotra|\baro\b|placa led|panel/i.test(n) && !/superficie/i.test(n)],
    ["Focos de superficie y carril", /carril|track|riel|foco|superficie|spot/i],
    ["Iluminación decorativa: colgantes, apliques y lámparas", /colgante|suspendida|suspensi[oó]n|aplique|l[aá]mpara(?! led)|ara[ñn]a|personalizable|decorativ/i],
    ["Plafones", /plaf[oó]n/i],
    ["Tiras LED y perfiles", /tira|perfil|ne[oó]n|fuente de alimentaci|driver/i],
    ["Pantallas y regletas", /pantalla|regleta|lineal/i],
    ["Bombillas", /bombilla|l[aá]mpara led|gu10|e27|e14|mr16/i],
  ],
  "Fontanería y saneamiento": [
    ["Canalones y bajantes", /canal[oó]n|bajante/i],
    ["Latiguillos y flexibles", /latiguillo|flexible|flexo/i],
    ["Codos, tes y uniones", /codo|\bte\b|uni[oó]n|manguito|reduc|racor|enlace|injerto|entronque|collar[ií]n|adaptador|tap[oó]n|abrazadera/i],
    ["Llaves y válvulas", /llave|v[aá]lvula|regulador/i],
    ["Desagües, sifones y sumideros", /sif[oó]n|desag[uü]e|sumidero|rejilla|canaleta|bote sif|rebosadero/i],
    ["Cisternas y mecanismos", /cisterna|mecanismo|descargador|pulsador|bastidor/i],
    ["Tubería y PVC", /tubo|tuber[ií]a|multicapa|pex|pvc|rollo|ppr/i],
  ],
  "Cerámica y colocación": [
    ["Juntas y masillas", (n) => /junta|masilla|borada|fugabella|\bpasta (para|de)/i.test(n) && !/azulejo|pavimento|revestimiento/i.test(n)],
    ["Adhesivos, cementos cola e impermeabilizantes", /mortero|cemento|adhesivo|\bcola\b|impermeabil/i],
    ["Perfiles, cantoneras y nivelación", /perfil|cantonera|calzo|cu[ñn]a|nivela|cruceta|\bl[aá]mina/i],
    ["Peldaños, listelos y rodapiés", /pelda[ñn]o|listelo|rodapi[eé]|cenefa|tabica|zanquin/i],
    ["Mosaico y formato pequeño (hasta 20 cm)", (n) => lado(n) > 0 && lado(n) <= 20.5],
    ["Formato medio (hasta 60 cm)", (n) => lado(n) > 20.5 && lado(n) <= 61],
    ["Gran formato (más de 60 cm)", (n) => lado(n) > 61],
    ["Azulejos y pavimentos (otros)", /./],
  ],
  "Terrazas y patios": [
    ["Accesorios para césped", (n) => /grapa|piqueta|banda de uni|cinta|adhesiv|malla|rodillo|geotextil/i.test(n) && !/^\W*(rollo (de )?)?c[eé]sped/i.test(n)],
    ["Plots, rastreles y fijaciones", /\bplot|rastrel|travesa|\bclip|tornillo|apoyo|soporte|[aá]ngulo|remate|perfil/i],
    ["Césped artificial", /c[eé]sped/i],
    ["Losetas y baldosas encajables", /encajable|loseta|baldosa (de )?(madera|composite)|baldosa.*\b(madera|composite|wpc)\b/i],
    ["Tarima composite", /composite|\bwpc\b/i],
    ["Tarima de madera", /lama|tarima|tabla|madera|pino|ipe|teca|cumar[uú]|tali|badi|acacia|bamb[uú]/i],
    ["Porcelánico de 2 cm (sobre plots)", (n) => /porcel|gres|cer[aá]mic|baldosa|azulejo/i.test(n) && /\b20 ?mm|\b2 ?cm\b|espesor 2\b/i.test(n)],
    ["Porcelánico de exterior y piscina", /porcel|gres|cer[aá]mic|baldosa|piscina|losa|azulejo/i],
  ],
  "Suelos": [
    ["Rodapiés", /rodapi/i],
    ["Bases y accesorios", /^\W*base|base aislante|perfil|espuma|underlay|transici/i],
    ["Laminado AC6", (n) => /laminad/i.test(n) && /\bac ?6\b|clase 34/i.test(n)],
    ["Laminado AC5", (n) => /laminad/i.test(n) && /\bac ?5\b|clase 33/i.test(n)],
    ["Laminado AC4", (n) => /laminad/i.test(n) && /\bac ?4\b|clase 32/i.test(n)],
    ["Laminado (otras clases)", /laminad/i],
    ["Vinílico SPC/LVT", /vin[ií]lico|spc|lvt|pvc/i],
    ["Porcelánico imitación", /porcel|gres|azulejo|pavimento|baldosa|cer[aá]mic|m[aá]rmol/i],
    ["Madera y parquet", /parquet|madera|multicapa|tarima/i],
  ],
  "Decoración y revestimientos": [
    ["Colas y herramientas para papel", /^\W*(cola|adhesivo|esp[aá]tula|cepillo|cuchilla|rodillo)/i],
    ["Papel pintado infantil", (n) => /papel pintado|papel de pared|mural/i.test(n) && /infantil|ni[ñn]os|beb[eé]/i.test(n)],
    ["Murales y fotomurales", /mural/i],
    ["Papel pintado vinílico", (n) => /papel pintado|papel de pared/i.test(n) && /vin[ií]l/i.test(n)],
    ["Papel pintado tejido no tejido", (n) => /papel pintado|papel de pared/i.test(n) && /no tejido|tnt|intiss/i.test(n)],
    ["Papel pintado (otros)", /papel pintado|papel de pared/i],
    ["Pósters y láminas", /p[oó]ster|\bl[aá]mina|\bcuadro|print/i],
    ["Paneles de listones y acústicos", /list[oó]n|tablilla|ac[uú]stic|panel|paliller/i],
    ["Frisos, zócalos y revestimientos de madera", /friso|z[oó]calo|revestimiento|madera|lama|tablero|ranurad/i],
  ],
  "Puertas": [
    ["Manillas, pomos y condenas", /manilla|pomo|condena|tirador|cerrojo|pasador|muletilla|cerradura|bisagra|roseta|bomb[ií]n|set wc|bocallave|manill[oó]n|escudo|mirilla/i],
    ["Guías y herrajes", /carril|gu[ií]a|rueda|kit|herraje|tope|convertidor|freno/i],
    ["Tapajuntas y molduras", /tapajuntas|moldura|jamba/i],
    ["Puertas de entrada y blindadas", /blindad|acorazad|puerta de entrada|entrada/i],
    ["Puertas correderas", /corredera|plegable/i],
    ["Puertas de interior abatibles", /puerta|hoja|block|conjunto/i],
  ],
  "Ventanas": [
    ["Persianas y mosquiteras", (n) => /persiana|mosquitera|caj[oó]n|\blama|recogedor|cinta/i.test(n) && !/^\W*(ventana|balconera)/i.test(n)],
    ["Balconeras", /balconera/i],
    ["Ventanas de PVC", /pvc/i],
    ["Ventanas de aluminio", /alumini/i],
    ["Ventanas de madera", /madera/i],
  ],
  "Armarios": [
    ["Interiores: cajones, baldas y barras", /komplement|caj[oó]n|balda|barra|zapatero|cesta|colgador|pantalonero|divisor|bandeja|riel|interior|perch|rueda|gu[ií]a|herraje/i],
    ["Frentes y puertas de armario", /frente|puerta|hoja/i],
    ["Armarios y módulos", /armario|casoneto|m[oó]dulo|estructura|vestidor|costado|trasera/i],
  ],
  "Pintura": [
    ["Rodillos, brochas y cinta", /rodillo|brocha|paletina|pincel|cinta|cubeta|recambio|bandeja|alargador|pistola|espuma/i],
    ["Imprimaciones y fondos", /imprimaci|fondo|selladora/i],
    ["Plastes y masillas", /plaste|pasta|masilla|yeso|gotel/i],
    ["Esmaltes, barnices y lacas", /esmalte|esmate|barniz|laca|lasur|aceite/i],
    ["Pintura plástica", /pintura|pl[aá]stica|revestimiento|fachada/i],
  ],
  "Albañilería y morteros": [
    ["Molduras y varillas", /moldura|varilla|cortinero/i],
    ["Siliconas, selladores y espumas", /silicona|sellador|sella|espuma|masilla|adhesivo|pegamento|pol[ií]mero|junta|alisador/i],
    ["Ladrillo y bloque", /ladrillo|bloque|rasill/i],
    ["Cemento, mortero y yeso", /cemento|mortero|\bmort\b|yeso|escayola|perlita|cal\b|arena|hormig/i],
  ],
  "Tabiquería seca": [
    ["Perfiles, montantes y canales", /perfil|montante|canal|maestra|guardavivos|angular|anclaje|cuelgue|tornillo/i],
    ["Placas de yeso", /placa|panel|techo|cart[oó]n yeso|pladur/i],
  ],
  "Aislamiento": [
    ["Accesorios y fijación", /^\W*(perfil|malla|taco|espiga|kit|cinta)/i],
    ["Lana mineral", /lana|roca|vidrio|rock/i],
    ["Poliestireno (XPS/EPS)", /poliestireno|xps|eps/i],
    ["Láminas y bases", /l[aá]mina|base|rollo|capa|aislante|multicapa|burbuja|reflex/i],
  ],
  "Obra y protección": [
    ["Herramienta de mano", (n) => /peine|paleta|llana|talocha|esp[aá]tula|paletin|remolinador|rascador|cuchilla|cutter|nivel|metro|martillo de|maza/i.test(n) && !/taladro|amoladora|atornillador|lijadora|percutor|demoledor|bater[ií]a/i.test(n)],
    ["Herramienta eléctrica", /taladro|amoladora|atornillador|lijadora|sierra|cinceladora|multiherramienta|martillo (percutor|demoledor)/i],
    ["Brocas y tacos", /broca|taco/i],
    ["Escaleras", /escalera/i],
    ["Cierrapuertas", /cierrapuertas|cierre ts|brazo/i],
    ["Protección de obra", /pl[aá]stico|lona|fieltro|cart[oó]n|cinta|protec|saco|escombro/i],
  ],
  "Ventiladores": [
    ["Ventiladores de techo con luz", (n) => /techo/i.test(n) && /luz|led|l[aá]mpara|light/i.test(n) && !/sin (luz|l[aá]mpara|iluminaci)|without light/i.test(n)],
    ["Ventiladores de techo sin luz", /techo/i],
    ["Ventiladores de pie y sobremesa", /pie|sobremesa|mesa|torre|columna/i],
    ["Ventiladores de pared", /pared/i],
    ["Mandos y accesorios", /mando|receptor|kit|accesorio|soporte|tubo|barra/i],
  ],
  "Fotovoltaica": [
    ["Estructura y fijación", /estructura|presor|clamp|rail|tornillo|gu[ií]a|fijaci|arriostr|soporte|sellador|perfil|uni[oó]n|tapa/i],
    ["Cable y protecciones", /cable|hilo|fusible|conector|sobretensi|desconect|caja|portafusible|empalme/i],
    ["Medida y monitorización", /monitoriz|vat[ií]metro|sensor|datalogger|dtu|medidor|shine|wifi|dongle/i],
    ["Kits completos", /kit/i],
    ["Inversores", /inversor|microinversor|optimizador/i],
    ["Baterías", /bater[ií]a|bms|bcu/i],
    ["Reguladores", /regulador/i],
    ["Paneles solares", /panel|placa|m[oó]dulo fotov/i],
  ],
};
export const VISTA = {
  "Baño": ["Muebles de baño", "Inodoros y cisternas", "Lavabos", "Platos de ducha", "Mamparas", "Bañeras", "Columnas y duchas", "Grifería de baño", "Espejos", "Accesorios de baño", "Recambios, desagües y fijaciones"],
  "Cocina": ["Muebles de cocina", "Fregaderos", "Grifería de cocina", "Encimeras", "Placas", "Hornos", "Campanas", "Lavavajillas y electrodomésticos", "Recambios y accesorios"],
  "Calefacción y agua caliente": ["Termos hasta 50 L", "Termos de 65 a 90 L", "Termos de 100 L o más", "Termos (otros)", "Calentadores de gas", "Calderas de gas", "Otras calderas", "Aerotermia y bombas de calor", "Radiadores y emisores", "Termostatos y válvulas", "Accesorios de instalación"],
  "Aire acondicionado": ["Splits de pared", "Multisplit", "Conductos y cassette", "Suelo-techo y techo", "Portátiles", "Splits y unidades (otros)", "Calefactores y ventiladores", "Accesorios de instalación"],
  "Electricidad": ["Mecanismos: interruptores y enchufes", "Bases múltiples, clavijas y prolongadores", "Cuadro y protecciones", "Cables e hilos", "Tubos y canaletas", "Cajas", "TV y antena", "Emergencias y detectores", "Bornas y conexión", "Fijación y cinta aislante"],
  "Iluminación": ["Empotrados: downlights y paneles", "Focos de superficie y carril", "Iluminación decorativa: colgantes, apliques y lámparas", "Plafones", "Tiras LED y perfiles", "Pantallas y regletas", "Bombillas", "Exterior", "Drivers, conectores y accesorios"],
  "Fontanería y saneamiento": ["Tubería y PVC", "Codos, tes y uniones", "Llaves y válvulas", "Latiguillos y flexibles", "Desagües, sifones y sumideros", "Cisternas y mecanismos", "Canalones y bajantes"],
  "Cerámica y colocación": ["Formato medio (hasta 60 cm)", "Gran formato (más de 60 cm)", "Mosaico y formato pequeño (hasta 20 cm)", "Azulejos y pavimentos (otros)", "Peldaños, listelos y rodapiés", "Adhesivos, cementos cola e impermeabilizantes", "Juntas y masillas", "Perfiles, cantoneras y nivelación"],
  "Terrazas y patios": ["Porcelánico de exterior y piscina", "Porcelánico de 2 cm (sobre plots)", "Tarima composite", "Tarima de madera", "Losetas y baldosas encajables", "Césped artificial", "Plots, rastreles y fijaciones", "Accesorios para césped"],
  "Suelos": ["Laminado AC4", "Laminado AC5", "Laminado AC6", "Laminado (otras clases)", "Vinílico SPC/LVT", "Madera y parquet", "Porcelánico imitación", "Rodapiés", "Bases y accesorios"],
  "Decoración y revestimientos": ["Papel pintado vinílico", "Papel pintado tejido no tejido", "Papel pintado (otros)", "Papel pintado infantil", "Murales y fotomurales", "Pósters y láminas", "Paneles de listones y acústicos", "Frisos, zócalos y revestimientos de madera", "Colas y herramientas para papel"],
  "Puertas": ["Puertas de interior abatibles", "Puertas correderas", "Puertas de entrada y blindadas", "Manillas, pomos y condenas", "Tapajuntas y molduras", "Guías y herrajes"],
  "Ventanas": ["Ventanas de PVC", "Ventanas de aluminio", "Ventanas de madera", "Balconeras", "Persianas y mosquiteras"],
  "Armarios": ["Armarios y módulos", "Frentes y puertas de armario", "Interiores: cajones, baldas y barras"],
  "Pintura": ["Pintura plástica", "Esmaltes, barnices y lacas", "Imprimaciones y fondos", "Plastes y masillas", "Rodillos, brochas y cinta"],
  "Albañilería y morteros": ["Cemento, mortero y yeso", "Ladrillo y bloque", "Siliconas, selladores y espumas", "Molduras y varillas"],
  "Tabiquería seca": ["Placas de yeso", "Perfiles, montantes y canales"],
  "Aislamiento": ["Lana mineral", "Poliestireno (XPS/EPS)", "Láminas y bases", "Accesorios y fijación"],
  "Obra y protección": ["Herramienta eléctrica", "Herramienta de mano", "Brocas y tacos", "Escaleras", "Protección de obra", "Cierrapuertas"],
  "Ventiladores": ["Ventiladores de techo con luz", "Ventiladores de techo sin luz", "Ventiladores de pie y sobremesa", "Ventiladores de pared", "Mandos y accesorios"],
  "Fotovoltaica": ["Kits completos", "Paneles solares", "Inversores", "Baterías", "Reguladores", "Estructura y fijación", "Cable y protecciones", "Medida y monitorización"],
};
// Nombres de subgrupo de un área en el orden en que se muestran (más «Otros» al final).
export function gruposVista(c) {
  const todos = (SUBGRUPOS[c] || []).map(([g]) => g);
  const v = (VISTA[c] || []).filter((g) => todos.includes(g));
  return [...v, ...todos.filter((g) => !v.includes(g)), "Otros"];
}
export function litros(n) {
  const m = String(n).match(/(\d{2,3})\s*(?:l\b|litros|lts?\b)/i); if (m) return Number(m[1]);
  const t = [...String(n).matchAll(/(?:^|[^\d])0?(30|35|40|45|50|65|75|80|100|120|125|150|200)(?:[^\d]|$)/g)]; return t.length ? Number(t[t.length - 1][1]) : 0;
}
// Ancho en cm de un módulo de cocina. Obramat escribe alto×ancho×fondo («MÓDULO COCINA … 80X60X58CM», puertas «80X45»);
// el resto, ancho primero («60x76,8x58», IKEA «60x60x80»).
export function anchoMod(n) {
  const L = String(n).match(/\bL\.?\s*(\d+(?:[.,]\d+)?)/); if (L) return parseFloat(L[1].replace(",", "."));
  const m = String(n).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i); if (!m) { const c = String(n).match(/\b(\d{2,3})\s*cm\b/i); return c ? Number(c[1]) : 0; }
  const altoPrimero = /^\W*(kit )?m[oó]dulo cocina|^\W*puerta para mueble de cocina/i.test(n) || (parseFloat(m[1].replace(",", ".")) > 130 && !/cocina,|cocina (en kit|completa)/i.test(n));
  const v = parseFloat((altoPrimero ? m[2] : m[1]).replace(",", "."));
  return v > 300 ? v / 10 : v;
}
// Altura del césped en mm.
export function mmC(n) { const m = String(n).match(/(\d{1,2})\s*mm/i); return m ? Number(m[1]) : 0; }
// Lado mayor en cm de un formato tipo «30x60», «7,5x30 cm».
export function lado(n) { const m = String(n).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i); return m ? Math.max(parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", "."))) : 0; }
// «Baño y cocina» en los datos se separa en dos áreas: Cocina y Baño.
const COCINA = /\b(metod|delinia|enhet|knoxhult)\b|fregadero|encimera|placa (de )?(cocina|inducci|vitro|gas)|placa de inducci|vitrocer|inducci[oó]n|horno|campana|lavavajillas|frigor[ií]fico|nevera|microondas|grifo (de )?cocina|cocina/i;
// La iluminación sale de Electricidad a un área propia.
const LUZ = /downlight|dicroica|mr16|gu10|placa led|perfil led|controlador tiras|kit de superficie panel|fuente alimentaci[oó]n .*(12|24) ?v|bombilla|plaf[oó]n|aplique|colgante|l[aá]mpara|tira (de )?led|tira led|foco|panel led|pantalla led|proyector|baliza|farola|portal[aá]mparas|carril|\baro\b|luminaria|regleta led|neón|neon led/i;
// Orden del menú: primero acabados y equipos, al final el material de obra.
export const ORDEN = ["Cerámica y colocación", "Suelos", "Terrazas y patios", "Baño", "Cocina", "Iluminación", "Ventiladores", "Calefacción y agua caliente", "Aire acondicionado", "Fotovoltaica", "Decoración y revestimientos", "Puertas", "Ventanas", "Armarios", "Pintura",
  "Electricidad", "Fontanería y saneamiento", "Albañilería y morteros", "Tabiquería seca", "Aislamiento", "Obra y protección"];
const AIRE = /^(giatsu|gree|haier|hec|hisense|midea|lg|daikin|mitsubishi|panasonic|fujitsu|general|samsung|toshiba|daitsu|ciarra|mundoclima|kaysun|hyundai|tcl|cecotec)\b|fan coil|aire acondicionado|split|cassette|conductos|port[aá]til|calefactor|ventilador|frigor|\bmudo\b|kios|anori|giada|\b(asy|asg|aug)\b|garrafa|amortiguador|silentblock|bomba de condensados|canal clima|unidad (interior|exterior)/i;
export function area(categoria, nombre) {
  if (/ventilador/i.test(nombre) && !/extractor|ventilador de (caldera|horno)|recambio/i.test(nombre) && /Climatizaci|Electricidad|Iluminaci|Ventiladores/.test(categoria)) return "Ventiladores";
  if (categoria === "Climatización y agua caliente") return AIRE.test(nombre) && !/aerotermia|aerotermo|altherma|bomba de calor|termo|caldera|radiador|ecodan|aquarea|hydro|monobloc|bibloc|depósito|interacumulador/i.test(nombre) ? "Aire acondicionado" : "Calefacción y agua caliente";
  if (categoria === "Electricidad" && LUZ.test(nombre) && !/interruptor|enchufe|detector|emergencia|magnetot|diferencial|cable|caja|tapa|marco|tecla/i.test(nombre)) return "Iluminación";
  if (categoria === "Puertas y ventanas") {
    if (/ventana|balconera|persiana|mosquitera/i.test(nombre) && !/^\W*(\w+ )?(pack )?puerta|bloque de puerta|puerta (corredera|interior|abatible)/i.test(nombre)) return "Ventanas";
    if (/^\W*(spaceo|ikea)|evo'?m|komplement|para m[oó]dulo/i.test(nombre)) return "Armarios";
    if (/armario|komplement|vestidor|casoneto|zapatero|pantalonero|balda|ikea|spaceo/i.test(nombre) && !/puerta (de )?(interior|entrada|blindad|corredera|abatible|paso)/i.test(nombre)) return "Armarios";
    return "Puertas";
  }
  if (categoria !== "Baño y cocina") return categoria;
  return COCINA.test(nombre) && !/ba[ñn]o|lavabo|ducha|inodoro|mampara/i.test(nombre) ? "Cocina" : "Baño";
}
export function subgrupo(categoria, nombre) {
  for (const [g, r] of SUBGRUPOS[categoria] || []) if (typeof r === "function" ? r(nombre) : r.test(nombre)) return g;
  return "Otros";
}
// Piezas sueltas (tapas, marcos, recambios…): dentro de cada subgrupo van después de los productos completos.
export const esPieza = (n) => /^\W*(tapa|marco|premarco|tecla|embellecedor|recambio|repuesto|kit de|juego de tornillos|tornillo|soporte|tap[oó]n|conector|accesorio|adaptador|rejilla|v[aá]lvula|brazo|flexo|mango)\b/i.test(n);
// Explicación corta que sale al principio de algunos subgrupos.
export const EXPLICA = {
  "Porcelánico de 2 cm (sobre plots)": "Baldosas gruesas de 2 cm para colocar en seco sobre soportes regulables (plots): no hace falta obra, el agua drena por debajo y se pueden levantar.",
  "Porcelánico de exterior y piscina": "Para exterior conviene antideslizante C3 (o R11) y resistente a la helada. Compara siempre el precio por m².",
  "Tarima composite": "Composite (madera y plástico): casi sin mantenimiento, no se astilla ni hay que barnizarla. Se coloca sobre rastreles.",
  "Tarima de madera": "Madera natural tratada para exterior (pino autoclave, ipe, cumaru…): más cálida, pero pide aceite o lasur cada año.",
  "Césped artificial": "Compara el precio por m². Más altura (30-40 mm) es más mullido y natural; 15-20 mm es más barato y fácil de limpiar. Más puntadas por m² = más denso.",
  "Laminado AC4": "AC4 (clase 32): el más habitual en casa. Aguanta bien salón, pasillo y dormitorios con uso normal.",
  "Laminado AC5": "AC5 (clase 33): más resistente a golpes y arañazos. Recomendable con niños, mascotas o mucho paso, y en locales pequeños.",
  "Laminado AC6": "AC6 (clase 34): la máxima resistencia. Para zonas de mucho tráfico; en una vivienda normal suele bastar con AC4 o AC5.",
  "Laminado (otras clases)": "Laminados en los que la tienda no indica la clase de uso. Fíjate en la ficha: para casa conviene AC4 o más.",
};
// Filtros por estilo, color, acabado… dentro de un área: [{nombre, aplica: subgrupos (o todos), opciones: [[etiqueta, prueba]]}].
const MOLD = /moldura|plaf[oó]n|cuarter[oó]n|\b\dc\b|\blola\b|cl[aá]sic|provenz|relieve/i;
const RANURA = /\bvt\s?\d|\bvt\b|\bline\b|ranura|rayas|fresad|\b\dl\b|\blu\d/i;
const GRIFO = /grifo|monomando|mezclador|termost[aá]tic|columna|teleducha|rociador|grifer/i;
const color = [["Negro", /negr|black/i], ["Inox / acero", /inox|acero|steel|cepillad/i], ["Dorado", /dorad|\boro\b|gold|lat[oó]n cepillado|champagne/i], ["Cromo", /crom/i], ["Blanco", /blanc|white/i]];
// Filtro «Marca»: [etiqueta, patrón] en orden de popularidad.
const marcas = (l) => l.map((m) => [m, new RegExp("\\b(" + m.toLowerCase().replace(/ \/ /g, "|").replace(/ /g, "[ -]?") + ")\\b", "i")]);
const MARCAS_AIRE = marcas(["Daikin", "Mitsubishi", "Panasonic", "LG", "Fujitsu / General", "Samsung", "Toshiba", "Haier", "Hisense", "Gree", "Daitsu", "Midea", "Giatsu", "Baxi", "Ferroli"]);
const MARCAS_AERO = marcas(["Daikin", "Panasonic", "Mitsubishi", "Vaillant", "Saunier Duval", "Baxi", "Ferroli", "Ariston", "Thermor", "LG", "Samsung", "Domusa"]);
export const FACETAS = {
  "Calefacción y agua caliente": [
    { nombre: "Marca", aplica: (g) => /Aerotermia/.test(g), opciones: MARCAS_AERO },
  ],
  "Aire acondicionado": [
    { nombre: "Marca", aplica: (g) => !/Accesorios/.test(g), opciones: MARCAS_AIRE },
  ],
  "Cerámica y colocación": [
    { nombre: "Estilo", aplica: (g) => /formato|Azulejos/.test(g), opciones: [
      ["Retro", /\bnais\b|retro|vintage|zellige|kasbah|artisan|craft|manual|hidr[aá]ulic|patchwork|encaustic|\bdeco\b|decorado|\bmetro\b|subway|biselad|majolica|colou?r/i],
      ["Elegante", /m[aá]rmol|marble|calacatta|carrara|statuario|marquina|onyx|[oó]nix|pulid|lappat|polished|\bgold\b|brillo/i],
      ["Natural", /piedra|stone|pizarra|slate|caliza|travertino|bestile|madera|wood|roble|nogal|\boak\b|natur|terracota|barro|r[uú]stic/i],
      ["Minimal", (n) => /cemento|concrete|minimal|microcemento|urban|industrial|\bliso|plain|mate|porcelanosa|cosentino|dekton|laminam|ascale|neolith|blanco|gris|grey/i.test(n) && !/hidr[aá]ulic|decorado|m[aá]rmol|madera|piedra/i.test(n)],
    ] },
  ],
  "Baño": [
    // Lavabos, muebles y espejos por estilo (los mismos 4 que en azulejos, con foto de baño real).
    { nombre: "Estilo", aplica: (g) => /Lavabos|Muebles de baño|Espejos/.test(g), opciones: [
      ["Retro", /retro|vintage|cl[aá]sic|pedestal|columna|art ?d[eé]co|victoria|ondulad|estriad|fluted|acanalad|verde|rosa|azul(?!ej)|terracota|lat[oó]n envejecido|ovalad[oa] con marco/i],
      ["Elegante", /m[aá]rmol|marble|calacatta|carrara|[oó]nix|onyx|dorad|gold|oro|negro brillo|lacado brillo|cristal|vidrio|brillo/i],
      ["Natural", /piedra|stone|madera|wood|teca|roble|nogal|oak|bamb[uú]|travertino|r[uú]stic|natur|terrazo|caliza|r[aá]tan|mimbre/i],
      ["Minimal", (n) => /blanc|white|mate|rectangular|cuadrad|slim|fino|liso|solid ?surface|resina|minimal|porcel[aá]nic|gris|grey|antracita|negro mate/i.test(n) && !/m[aá]rmol|marble|madera|wood|roble|nogal|piedra|dorad|retro|vintage|pedestal|cl[aá]sic/i.test(n)],
    ] },
    // Gama de lavabos: baratos pero bonitos (con un estilo claro) o de gama superior (precio o marca).
    { nombre: "Gama de lavabo", aplica: (g) => /Lavabos/.test(g), opciones: [
      ["Económicos monísimos", (n, p) => p > 0 && p <= 90 && /m[aá]rmol|marble|piedra|stone|madera|wood|terrazo|retro|vintage|estriad|fluted|acanalad|negro|black|dorad|gold|verde|rosa|terracota|beige|ovalad|redond|bol\b|cer[aá]mica de color|mate/i.test(n)],
      ["Gamas superiores", (n, p) => p >= 250 || /villeroy|duravit|laufen|porcelanosa|noken|cosentino|silestone|krion|geberit|catalano|flaminia|agape|antonio lupi|roca inspira|ideal standard ipalyss/i.test(n)],
    ] },
    { nombre: "Tipo de lavabo", aplica: (g) => /Lavabos/.test(g), opciones: [
      ["Sobre encimera", /sobre ?encimera|sobreencimera|sobreponer|de apoyo|apoyo/i],
      ["Encastrado", /encastr|bajo encimera|bajoencimera|empotr|semiencastr/i],
      ["Suspendido", /suspendid|mural|de pared|colgad/i],
      ["De pie o pedestal", /de pie|pedestal|columna|exento|freestanding|totem/i],
      ["Con mueble", /con mueble|mueble/i],
    ] },
    { nombre: "Tipo de bañera", aplica: (g) => /Bañeras/.test(g), opciones: [
      ["Exenta", /exenta|independiente|freestanding|isla/i],
      ["Para empotrar", (n) => /empotr|encastr|rectangular|de obra|chapa de acero|contesa/i.test(n) && !/exenta|independiente/i.test(n)],
      ["Rinconera o asimétrica", /rincon|angular|asim[eé]tric|esquina/i],
      ["Hidromasaje", /hidromasaje|jacuzzi|whirlpool|spa\b|burbujas/i],
    ] },
    { nombre: "Material de bañera", aplica: (g) => /Bañeras/.test(g), opciones: [
      ["Acrílica", /acr[ií]lic/i], ["Acero", /acero|chapa/i], ["Resina / solid surface", /resina|solid ?surface|mineral|piedra|krion|cast stone/i], ["Hierro fundido", /hierro|fundici/i],
    ] },
    { nombre: "Instalación", aplica: (g) => /Grifer|Columnas/.test(g), opciones: [["Empotrada", /empotr/i], ["Vista (no empotrada)", (n) => GRIFO.test(n) && !/empotr/i.test(n)]] },
    { nombre: "Color", aplica: (g) => /Grifer|Columnas|Mamparas|Accesorios/.test(g), opciones: color },
  ],
  "Cocina": [
    { nombre: "Tipo de mueble", aplica: (g) => /Muebles de cocina/.test(g), opciones: [
      ["Cocinas completas", /cocina (completa|modular|en kit|lineal)|kit de cocina|cocina \d+(,\d+)? ?m\b|^\W*[a-z]+ cocina,/i],
      ["Módulos bajos", (n) => /(mueble|m[oó]dulo|armario) bajo|\bbajo\b/i.test(n) && !/fregadero|esquin|rinc/i.test(n)],
      ["Bajo fregadero", /fregadero/i],
      ["Módulos altos", (n) => /(mueble|m[oó]dulo) (alto|de pared|mural)|armario (de pared|mural)|\balto\b/i.test(n) && !/armario alto|columna/i.test(n)],
      ["Columnas (horno, frigo, despensa)", /columna|despensa|armario alto|estructura alta/i],
      ["Rinconeros y esquinas", /esquin|rinc/i],
      ["Puertas y frentes", /^\W*(\w+ )?(puerta|frente|cajón|caj[oó]n)|frente de|puerta (de|para)/i],
    ] },
    { nombre: "Ancho del módulo", aplica: (g) => /Muebles de cocina/.test(g), opciones: [
      ["Hasta 40 cm", (n) => anchoMod(n) > 0 && anchoMod(n) <= 40], ["45 a 60 cm", (n) => anchoMod(n) > 40 && anchoMod(n) <= 60], ["Más de 60 cm", (n) => anchoMod(n) > 60 && anchoMod(n) <= 120],
    ] },
    { nombre: "Color del frente", aplica: (g) => /Muebles de cocina/.test(g), opciones: [["Blanco", /blanc|white/i], ["Madera", /roble|nogal|madera|pino|haya|fresno|natural/i], ["Gris o antracita", /gris|grafito|antracita|grey/i], ["Negro", /negr|black/i], ["Verde o azul", /verde|azul|salvia/i]] },
    { nombre: "Color", aplica: (g) => /Grifer|Fregaderos/.test(g), opciones: color },
  ],
  "Puertas": [
    { nombre: "Acabado", aplica: (g) => /Puertas de interior|correderas/.test(g), opciones: [
      ["Lisas", (n) => /\blisa|\bliso|ciega|enrasad|\bhoja\b/i.test(n) && !MOLD.test(n) && !RANURA.test(n) && !/vidrio|cristal|acristalad/i.test(n)],
      ["Con molduras", MOLD],
      ["Con ranuras o rayas", RANURA],
      ["Con vidrio", /vidrio|cristal|vidriera|acristalad/i],
    ] },
    { nombre: "Color", aplica: (g) => /Puertas|Manillas/.test(g), opciones: [["Blanco", /blanc|white|lacad/i], ["Madera", /roble|nogal|haya|sapel|madera|cerezo|pino|wengu/i], ["Negro", /negr|black/i], ["Gris", /gris|grey|gray/i]] },
  ],
  "Iluminación": [
    { nombre: "Color", aplica: () => true, opciones: [["Blanco", /blanc|white/i], ["Negro", /negr|black/i], ["Dorado", /dorad|\boro\b|gold|lat[oó]n/i], ["Madera", /madera|ratán|ratan|mimbre|bamb[uú]/i]] },
  ],
  "Terrazas y patios": [
    { nombre: "Altura del césped", aplica: (g) => /Césped/.test(g), opciones: [["Hasta 15 mm", (n) => mmC(n) > 0 && mmC(n) <= 15], ["De 20 a 30 mm", (n) => mmC(n) >= 16 && mmC(n) <= 30], ["Más de 30 mm", (n) => mmC(n) > 30]] },
    { nombre: "Color", aplica: (g) => /Porcel|Tarima|Losetas/.test(g), opciones: [["Gris", /gris|grey|gray|cemento|ash|perla|pearl|plata/i], ["Madera o marrón", /madera|wood|roble|oak|marr[oó]n|teca|nogal|tabaco|cumar|ipe|pino|acacia|teja/i], ["Beige o arena", /beige|arena|sand|crema|cream|bone|hueso|ivory|marfil|moka/i], ["Negro o antracita", /negr|black|antracita|grafito/i], ["Blanco", /blanc|white/i]] },
    { nombre: "Antideslizante", aplica: (g) => /Porcel/.test(g), opciones: [["Antideslizante (C3, R11…)", /antidesliz|\bc3\b|\br1[1-3]\b|antislip/i]] },
  ],
  "Ventiladores": [
    { nombre: "Marca", aplica: () => true, opciones: [["Sulion", /sulion/i], ["Faro", /\bfaro\b/i], ["CREATE / Ikohs", /create|ikohs/i], ["Cecotec", /cecotec/i], ["Leds-C4", /leds[- ]?c4/i], ["Westinghouse", /westinghouse/i], ["Orbegozo", /orbegozo/i], ["Taurus", /taurus/i]] },
  ],
};
const prueba = (t, n, p) => (typeof t === "function" ? t(n, p) : t.test(n));
// Claves de filtro de un producto («estilo:mármol color:negro»), según su área y subgrupo.
export function facetas(area, g, nombre, precio = 0) {
  const out = [];
  for (const f of FACETAS[area] || []) if (f.aplica(g)) for (const [et, t] of f.opciones) if (prueba(t, nombre, precio)) out.push(clave(f.nombre, et));
  return out;
}
export const clave = (f, o) => (f + ":" + o).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9:]+/g, "-");
