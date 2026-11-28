// Guías de compra de comparamaterial.com.
// Cada guía: textos propios (sin copiar de otras webs), productos de nuestro catálogo con precio público
// (filtro por nombre y categoría) y, si hay AMAZON_TAG, búsquedas en Amazon con el enlace de afiliado.
// Las cifras son orientativas y generales; nunca tarifas privadas.

export default [
  {
    slug: "mejor-termo-electrico",
    corto: "Termos eléctricos",
    titulo: "Mejor termo eléctrico: cómo elegir litros, tipo y precio",
    descripcion: "Guía para elegir termo eléctrico: cuántos litros necesitas según personas, resistencia blindada o sumergida, termo plano, consumo y precios reales comparados entre tiendas.",
    intro: "Un termo eléctrico parece todos igual, pero acertar con los litros y el tipo de resistencia cambia la factura y los años que dura. Aquí tienes lo que miramos en obra antes de elegir uno, con precios públicos de varias tiendas para comparar.",
    elegir: [
      ["1–2 personas", "50 L", "Piso pequeño o estudio. Si hay poco hueco, un termo plano o de 30 L bajo fregadero."],
      ["3 personas", "80 L", "El más vendido. Da para duchas seguidas sin quedarse frío."],
      ["4 personas", "100 L", "Con dos baños o duchas largas, mejor 100 L que 80 L."],
      ["5 o más", "150 L", "O pensar en bomba de calor ACS, que gasta mucho menos."],
    ],
    secciones: [
      ["Cuántos litros necesitas", [
        "La regla práctica es contar entre 25 y 40 litros por persona y día. Un termo pequeño para la familia obliga a encadenar duchas cortas; uno demasiado grande calienta agua que no se usa y pierde calor todo el día.",
        "Si dudas entre dos tamaños, mira el hueco antes que el precio: un termo de 80 L mide unos 75–80 cm de alto y unos 45 cm de diámetro. Los termos planos (slim) caben en armarios estrechos, pero suelen costar más.",
      ]],
      ["Resistencia blindada o sumergida", [
        "La resistencia sumergida está en contacto directo con el agua. Es más barata, pero con agua dura (como en buena parte de Madrid) acumula cal y se estropea antes.",
        "La blindada (o cerámica) va dentro de una vaina y no toca el agua. Cuesta algo más y se cambia sin vaciar el termo. En zonas de agua dura suele compensar.",
        "Mira también el ánodo de magnesio: protege la cuba de la corrosión y conviene revisarlo cada dos años. Algunos modelos traen ánodo electrónico, que no se gasta.",
      ]],
      ["Consumo y etiqueta energética", [
        "Todos calientan con 1.500–2.000 W, así que la diferencia está en el aislamiento y en el control. Un termostato digital con modo eco o programación evita calentar de noche o en horas caras.",
        "Si la familia es grande o pagas mucha luz por el agua caliente, compara con un aerotermo (bomba de calor para agua caliente): cuesta más al comprarlo, pero gasta en torno a un tercio de la electricidad. Lo explicamos en la guía de aerotermia.",
      ]],
      ["Instalación: lo que no se ve en el precio", [
        "El termo necesita válvula de seguridad conectada a un desagüe, un enchufe o línea propia y un soporte en pared que aguante el peso lleno (un termo de 80 L pesa más de 100 kg con agua). En tabique de pladur hay que reforzar o colgarlo de una pared maciza.",
        "Si cambias un termo viejo, comprueba que las tomas coinciden (vertical u horizontal, entrada a derecha o izquierda) para no tener que mover tuberías.",
      ]],
    ],
    faq: [
      ["¿Cuánto dura un termo eléctrico?", "Entre 8 y 12 años de media. Dura más si revisas el ánodo y vacías la cal cada cierto tiempo."],
      ["¿Es mejor termo o calentador de gas?", "Si ya tienes gas en casa, el calentador da agua sin límite y suele salir más barato de uso. Si no tienes gas, el termo o el aerotermo evitan dar de alta un suministro."],
      ["¿Puedo instalarlo yo?", "Colgarlo y conectarlo es sencillo, pero la válvula de seguridad y la conexión eléctrica deben quedar bien. Si dudas, que lo haga un fontanero."],
    ],
    filtros: [{ nombre: /^termo el[eé]ctrico|termo .*\d+ ?l/i, categoria: ["Calefacción y agua caliente", "Climatización y agua caliente"], n: 10 }],
    materiales: ["termo-electrico-80l", "termo-ariston-blu1-b-80-l", "termo-cointra-tnc-plus-80-l-vertical", "termo-ariston-velis-pro-wifi-50-l", "termo-ariston-velis-pro-wifi-80-l", "termo-fleck-duo-7-50-l", "calentador-gas-estanco-11l", "aerotermo-acs-200-l"],
    amazon: [["Termo eléctrico 80 litros", "termo electrico 80 litros"], ["Termo eléctrico 50 litros", "termo electrico 50 litros"], ["Termo plano (slim)", "termo electrico plano"], ["Ánodo de magnesio de recambio", "anodo magnesio termo"]],
    relacionadas: ["aerotermia-que-es-y-cuanto-cuesta", "mejor-caldera-de-gas-condensacion"],
  },
  {
    slug: "mejor-caldera-de-gas-condensacion",
    corto: "Calderas de gas",
    titulo: "Mejor caldera de gas de condensación: potencia, precios y qué mirar",
    descripcion: "Cómo elegir caldera de gas de condensación para un piso o una casa: potencia en kW, mixta o con acumulador, marcas, instalación, revisiones y precios comparados entre tiendas.",
    intro: "Cambiar la caldera es de las compras de reforma que más se repiten, y casi siempre con prisa porque la vieja se ha roto. Esta guía te ayuda a elegir bien sin pagar por potencia que no necesitas.",
    elegir: [
      ["Piso de 1 baño", "24 kW", "La más habitual. Da calefacción y agua caliente para un baño con holgura."],
      ["Piso de 2 baños", "28–30 kW", "Para ducharse en los dos baños a la vez sin perder temperatura."],
      ["Casa grande o 3 baños", "34–35 kW", "O caldera solo calefacción con acumulador de agua caliente."],
    ],
    secciones: [
      ["Por qué de condensación", [
        "Desde 2015 la normativa europea de diseño ecológico hace que casi todas las calderas de gas nuevas sean de condensación. Aprovechan el calor del vapor de los humos y gastan menos gas que una estanca antigua, sobre todo con radiadores a baja temperatura o suelo radiante.",
        "Necesitan un desagüe para el agua de condensados y una salida de humos adecuada. Si tu edificio tiene chimenea colectiva, pregunta antes al instalador: a veces hay que usar un modelo concreto.",
      ]],
      ["Mixta o con acumulador", [
        "La caldera mixta calienta el agua al momento. Es la opción normal en pisos.",
        "Si hay tres baños o duchas muy largas, una caldera solo calefacción con un acumulador de agua caliente da más caudal. Ocupa más sitio y cuesta más, pero no se queda corta.",
      ]],
      ["Qué mirar al comparar", [
        "Potencia para agua caliente (kW de ACS) y caudal en litros por minuto: es lo que notas en la ducha.",
        "Rango de modulación: cuanto más baja pueda trabajar, menos se enciende y apaga, y menos gasta en entretiempo.",
        "Termostato: muchas traen termostato wifi de la marca o compatible. Uno modulante (OpenTherm o el propio de la marca) ahorra más que un simple encendido y apagado.",
        "Garantía y servicio técnico en tu zona. En Madrid casi todas las marcas tienen servicio, pero los plazos cambian mucho.",
      ]],
      ["Instalación, papeles y revisiones", [
        "La caldera la debe instalar una empresa habilitada, que te dará el certificado de la instalación. Al precio de la caldera súmale la mano de obra, el kit de salida de humos y, si cambias de tipo, adaptar desagüe y tomas.",
        "Después hay que pasar el mantenimiento periódico obligatorio con una empresa habilitada y la inspección de gas que te avisará la distribuidora. Guarda los papeles: te los pedirán si vendes o alquilas.",
      ]],
    ],
    faq: [
      ["¿Cuánto cuesta cambiar una caldera?", "La caldera de condensación de 24 kW cuesta en tiendas desde unos 750–900 € con IVA. Con instalación, salida de humos y retirada de la vieja, el total suele quedar bastante por encima. Pide dos o tres presupuestos."],
      ["¿Merece la pena cambiar a aerotermia?", "Depende de la casa. En pisos con radiadores antiguos y sin espacio exterior, la caldera de condensación suele ser lo práctico. En casas con buen aislamiento y sitio para la unidad exterior, la aerotermia puede compensar. Mira nuestra guía de aerotermia."],
      ["¿Qué marca es mejor?", "Baxi, Ferroli, Saunier Duval, Vaillant, Bosch o Ariston tienen modelos buenos. Pesa más la potencia correcta, una buena instalación y el servicio técnico cercano que la marca."],
    ],
    filtros: [{ nombre: /caldera.*(condensaci|gas)/i, categoria: ["Calefacción y agua caliente", "Climatización y agua caliente"], n: 10 }],
    materiales: ["caldera-condensacion-24", "caldera-vaillant-ecotec-pure-vmw-236-7-2", "caldera-ferroli-kalis-24-c", "caldera-ferroli-bluehelix-alpha-24-c", "caldera-baxi-neodens-lite-24-24-f", "caldera-ariston-clas-one-wifi-24-ff", "caldera-saunier-duval-thema-condens-f25", "termostato-wifi", "valvula-termostatica-radiador"],
    amazon: [["Termostato wifi para caldera", "termostato wifi caldera"], ["Válvulas termostáticas de radiador", "cabezal termostatico radiador"], ["Purgador y llave de radiador", "llave purgador radiador"]],
    relacionadas: ["aerotermia-que-es-y-cuanto-cuesta", "mejor-termo-electrico"],
  },
  {
    slug: "aerotermia-que-es-y-cuanto-cuesta",
    corto: "Aerotermia",
    titulo: "Aerotermia: qué es, cuánto cuesta y cuándo compensa",
    descripcion: "Guía clara de aerotermia para casa: bomba de calor para agua caliente o para calefacción, monobloc o bibloc, potencia, ahorro, ruido, ayudas y precios reales comparados.",
    intro: "La aerotermia saca calor del aire de fuera con una bomba de calor y lo usa para el agua caliente, la calefacción o las dos cosas. Gasta mucha menos luz que un termo o un radiador eléctrico, pero no encaja en todas las casas. Te contamos cómo saberlo.",
    elegir: [
      ["Solo agua caliente", "Aerotermo ACS 100–200 L", "Sustituye al termo. Lo más fácil y barato de instalar."],
      ["Calefacción + agua, piso", "Bomba de calor 4–8 kW", "Mejor con suelo radiante o radiadores de baja temperatura."],
      ["Casa unifamiliar", "Bomba de calor 8–16 kW", "Conviene un estudio de cargas: no se elige a ojo."],
    ],
    secciones: [
      ["Dos productos distintos con el mismo nombre", [
        "El aerotermo de agua caliente (bomba de calor ACS) es un depósito con una pequeña bomba de calor encima o separada. Se instala casi como un termo y gasta en torno a un tercio de su electricidad.",
        "La aerotermia para calefacción es una bomba de calor aire-agua con unidad exterior que calienta el agua de radiadores o suelo radiante, y normalmente también el agua sanitaria. Es una instalación más grande, para reformas integrales o cambios de caldera.",
      ]],
      ["Monobloc o bibloc", [
        "En el monobloc todo el circuito frigorífico va en la unidad exterior y a casa llegan tubos de agua. Es más sencillo de instalar.",
        "En el bibloc (o split) hay unidad exterior e interior unidas por tubo de refrigerante. Ocupa menos fuera, pero la instalación la debe hacer un frigorista habilitado para gases fluorados.",
      ]],
      ["Cuándo compensa y cuándo no", [
        "Compensa cuando la casa está razonablemente aislada, trabaja a baja temperatura (suelo radiante o radiadores grandes) y hay sitio para la unidad exterior. El rendimiento se mide con el SCOP: cuanto más alto, más calor por cada kWh de luz.",
        "Compensa menos en pisos con radiadores pequeños pensados para caldera a 70 °C, sin balcón ni azotea para la máquina, o si la comunidad no deja colgar la unidad exterior en fachada.",
        "Fíjate en el ruido de la unidad exterior (dB) si va cerca de dormitorios o del vecino.",
      ]],
      ["Ayudas", [
        "Para aerotermia suele haber deducciones en el IRPF por mejora de eficiencia energética y ayudas autonómicas o municipales, que cambian cada año. Antes de comprar, revisa qué hay en tu comunidad en <a href=\"https://ayudasparavivienda.com\" rel=\"noopener\">ayudasparavivienda.com</a>: muchas exigen certificado energético antes y después.",
      ]],
    ],
    faq: [
      ["¿Cuánto cuesta la aerotermia?", "Un aerotermo de agua caliente de 100–200 L cuesta en tiendas desde unos 950 € con IVA. Una bomba de calor para calefacción empieza en torno a 2.000 € solo la unidad exterior, y la instalación completa con depósito, hidráulica y mano de obra suele multiplicar esa cifra."],
      ["¿La aerotermia enfría?", "Muchas bombas de calor aire-agua pueden dar frío por suelo radiante o fancoils. Con radiadores normales no se usa para frío."],
      ["¿Puedo poner aerotermia en un piso?", "El aerotermo de agua caliente, casi siempre. La de calefacción depende del espacio para la unidad exterior y de lo que permita la comunidad."],
    ],
    filtros: [
      { nombre: /bomba de calor acs|aerotermo/i, categoria: ["Calefacción y agua caliente", "Climatización y agua caliente"], n: 6 },
      { nombre: /^bomba de calor (?!acs)/i, categoria: ["Calefacción y agua caliente", "Climatización y agua caliente"], n: 6 },
    ],
    materiales: ["aerotermo-acs-200-l", "termo-electrico-80l"],
    amazon: [["Termostato para suelo radiante", "termostato suelo radiante"], ["Medidor de consumo eléctrico", "medidor consumo electrico enchufe"], ["Soporte antivibración unidad exterior", "soporte antivibratorio aire acondicionado suelo"]],
    relacionadas: ["mejor-termo-electrico", "kit-placas-solares-autoconsumo"],
  },
  {
    slug: "herramientas-para-reformas",
    corto: "Herramientas",
    titulo: "Herramientas para una reforma en casa: las que de verdad necesitas",
    descripcion: "Lista de herramientas para reformar en casa: taladro percutor o martillo SDS, atornillador de batería, amoladora, nivel láser, medidor, aspirador de obra y protección. Qué comprar y qué alquilar.",
    intro: "Antes de llenar el carro, piensa qué vas a hacer tú y qué hará el profesional. Esta es la lista que usamos para pequeñas reformas en casa, de lo imprescindible a lo que mejor alquilas.",
    elegir: [
      ["Colgar, montar muebles", "Atornillador 12–18 V", "Con dos baterías. Lo usarás más que ninguna otra."],
      ["Agujeros en ladrillo", "Taladro percutor", "Para tacos en ladrillo y yeso. En hormigón se queda corto."],
      ["Hormigón, rozas, picar", "Martillo SDS-plus", "Taladra hormigón sin esfuerzo y pica azulejo con cincel."],
      ["Cortar azulejo, metal", "Amoladora 115–125 mm", "Siempre con disco adecuado, gafas y guantes."],
    ],
    secciones: [
      ["Elige una plataforma de baterías", [
        "Casi todas las marcas venden herramientas «solo cuerpo» que comparten la misma batería de 18 V. Si eliges una marca para el atornillador, la amoladora o la sierra te saldrán mucho más baratas después.",
        "Para casa basta con baterías de 2–4 Ah. Mejor dos baterías pequeñas que una grande: mientras una carga, trabajas con la otra.",
      ]],
      ["Medir y nivelar", [
        "Un medidor láser de distancias y un nivel láser de líneas cruzadas ahorran muchos errores al colgar muebles de cocina, alinear cuadros o marcar azulejos. Los básicos ya son muy precisos para uso doméstico.",
        "Añade un nivel de burbuja de 60 cm, cinta métrica de 5 m, escuadra y lápiz de carpintero. Y un detector de cables y tuberías antes de taladrar cerca de enchufes o del baño.",
      ]],
      ["Cortar", [
        "Sierra de calar para madera, tablero y encimeras laminadas. Multiherramienta oscilante para cortes a ras: rodapiés, marcos de puertas al poner suelo nuevo o recortes en pladur.",
        "Para azulejo grande o porcelánico, una cortadora manual de buena longitud corta recto; la amoladora con disco de diamante sirve para huecos de enchufes y remates.",
      ]],
      ["Limpieza y protección", [
        "Un aspirador de obra (sólidos y líquidos) recoge polvo de yeso que un aspirador doméstico no aguanta. Con filtro para polvo fino si vas a lijar.",
        "Gafas, guantes, mascarilla FFP2 o FFP3 para lijar o picar, y protección auditiva para el martillo. Plástico de protección para suelos y muebles: es barato y evita disgustos.",
      ]],
      ["Qué conviene alquilar", [
        "Martillo demoledor, cortadora de agua para porcelánico grande, lijadora de paredes (jirafa) o andamio. Se usan pocos días y en tiendas de alquiler o grandes almacenes se alquilan por jornada.",
      ]],
    ],
    faq: [
      ["¿Taladro percutor o martillo SDS?", "El percutor vale para ladrillo y yeso. Si vas a taladrar hormigón, pilares o hacer rozas, el SDS-plus trabaja mucho mejor y además pica con cincel."],
      ["¿Herramienta con cable o batería?", "Batería para atornillar y taladrar en casa: más cómoda. Con cable para trabajos largos de potencia, como picar o lijar paredes."],
      ["¿Qué marca de herramienta comprar?", "Para uso ocasional, las gamas de bricolaje de las grandes marcas o las propias de los almacenes van bien. Si vas a usarlas a menudo, una gama profesional dura años."],
    ],
    filtros: [{ nombre: /taladr|atornill|amolad|nivel|cortador|llana|paleta|plástico de protección/i, categoria: "Obra y protección", n: 10 }],
    materiales: [],
    amazon: [["Atornillador de batería 18 V", "atornillador bateria 18v"], ["Martillo percutor SDS-plus", "martillo percutor sds plus"], ["Amoladora 125 mm", "amoladora 125mm"], ["Nivel láser de líneas cruzadas", "nivel laser lineas cruzadas"], ["Medidor láser de distancias", "medidor laser distancia"], ["Multiherramienta oscilante", "multiherramienta oscilante"], ["Detector de cables y tuberías", "detector cables tuberias pared"], ["Aspirador de obra sólidos y líquidos", "aspirador solidos liquidos"]],
    relacionadas: ["kit-placas-solares-autoconsumo", "mejor-termo-electrico"],
  },
  {
    slug: "kit-placas-solares-autoconsumo",
    corto: "Placas solares",
    titulo: "Kit de placas solares para autoconsumo: cuántas necesitas y precios",
    descripcion: "Cómo elegir un kit de placas solares para casa: calcular potencia según consumo, paneles, inversor, batería sí o no, trámites de autoconsumo y precios comparados entre tiendas.",
    intro: "Poner placas solares es una de las mejoras que más se nota en la factura, pero el kit hay que dimensionarlo con tu consumo real y no con el que viene en la oferta. Así lo calculamos.",
    elegir: [
      ["Piso o consumo bajo", "1–2 kWp", "3–4 paneles de 450–500 W. Sin batería suele bastar."],
      ["Casa media (3.500 kWh/año)", "3 kWp", "6 paneles. Batería solo si gastas mucho por la noche."],
      ["Casa con aerotermia o coche eléctrico", "5–6 kWp", "Inversor híbrido para poder añadir batería después."],
    ],
    secciones: [
      ["Calcula con tu factura", [
        "Busca en la factura o en la web de tu distribuidora el consumo del último año en kWh. En Madrid cada kWp de paneles bien orientado produce del orden de 1.400 a 1.600 kWh al año.",
        "Divide tu consumo anual entre unos 1.500 y tendrás los kWp aproximados. Luego ajusta: lo que más ahorra es la energía que gastas mientras hay sol (lavadora, lavavajillas, aerotermia, carga del coche de día).",
      ]],
      ["Paneles, inversor y batería", [
        "Paneles: hoy lo normal son monocristalinos de 450–500 W. Compara la potencia, la garantía de producción (25–30 años) y las medidas, por si el tejado es pequeño.",
        "Inversor: convierte la corriente de los paneles para tu casa. Si quieres batería ahora o más adelante, elige inversor híbrido. Los microinversores van bien en tejados con sombras parciales.",
        "Batería: las de litio (LiFePO4) de 5 kWh son las más habituales. Encarecen bastante el kit; compensan si consumes mucho de noche o si la compensación de excedentes de tu comercializadora es baja.",
      ]],
      ["Trámites de autoconsumo", [
        "Necesitas el permiso del ayuntamiento (según el municipio, licencia, declaración responsable o comunicación previa) y una instalación hecha y legalizada por un instalador autorizado, que registra el autoconsumo. En Madrid hay bonificaciones en el IBI y el ICIO en algunos casos.",
        "En un edificio, el tejado es zona común: hace falta acuerdo de la comunidad. Para autoconsumo compartido entre vecinos, revisa ayudas y trámites en <a href=\"https://ayudasparavivienda.com\" rel=\"noopener\">ayudasparavivienda.com</a>.",
        "Los kits pequeños «de balcón» se venden con enchufe, pero también deben comunicarse como autoconsumo. Pregunta antes de comprar.",
      ]],
    ],
    faq: [
      ["¿Cuánto cuesta un kit solar para casa?", "Un kit de 3 kWp sin batería sale en tiendas por menos que uno con batería, que puede duplicar el precio. Mira abajo precios públicos reales de paneles, baterías y kits."],
      ["¿Cuántos paneles necesito?", "Divide tu consumo anual en kWh entre unos 1.500 y luego entre la potencia del panel en kW. Ejemplo: 3.500 kWh ÷ 1.500 ≈ 2,3 kWp ≈ 5 paneles de 500 W."],
      ["¿Kit solar aislado o conectado a red?", "Si tu casa tiene luz de red, el kit conectado (autoconsumo) es lo normal. Los aislados son para casetas o casas sin suministro y necesitan baterías grandes."],
    ],
    filtros: [
      { nombre: /^kit (solar|autoconsumo)(?!.*camper)/i, categoria: "Fotovoltaica", n: 6 },
      { nombre: /^(micro)?inversor|^bater[ií]a (de )?litio/i, categoria: "Fotovoltaica", n: 6 },
    ],
    materiales: ["panel-solar-500w", "bateria-litio-pylontech-us5000", "bateria-litio-deye-se-g5-1-pro-b"],
    amazon: [["Medidor de consumo de enchufe", "medidor consumo electrico enchufe"], ["Cable solar 6 mm²", "cable solar 6mm"], ["Conectores MC4 y herramienta", "conectores mc4 crimpadora"], ["Estación de energía portátil", "estacion energia portatil"]],
    relacionadas: ["aerotermia-que-es-y-cuanto-cuesta", "herramientas-para-reformas"],
  },
];
