// Búsqueda por marca: eliges una marca y ves qué tienda la vende más barata.
// [nombre, patrón del nombre del producto]. Se publican solo las marcas con al menos 3 productos.
const m = (nombre, patron) => [nombre, patron || new RegExp("\\b" + nombre.toLowerCase().replace(/[&]/g, "\\&?").replace(/ /g, "[ -]?") + "\\b", "i")];
export const MARCAS = {
  "Baño y cocina de gama alta": [m("Villeroy & Boch", /villeroy/i), m("Grohe"), m("Hansgrohe", /hansgrohe|axor/i), m("Geberit"), m("Duravit"), m("Roca"), m("Tres", /\btres\b(?! (piezas|cajones|puertas|plazas))/i), m("Ramon Soler", /ram[oó]n soler/i), m("Porcelanosa", /porcelanosa|noken|systempool/i), m("Cosentino / Dekton / Silestone", /cosentino|dekton|silestone/i), m("Laminam"), m("Franke"), m("Blanco", /\bblanco (silgranit|subline|zia|metra|andano|supra|solis|axis)/i), m("Jacob Delafon", /jacob delafon/i), m("Kaldewei"), m("Ideal Standard", /ideal standard/i)],
  "Cerámica": [m("NAIS", /\bnais\b/i), m("Vives"), m("Grespania"), m("Marazzi"), m("Bestile"), m("Argenta"), m("Equipe"), m("Peronda"), m("Aparici"), m("Porcelanosa", /porcelanosa/i)],
  "Electrodomésticos": [m("Miele"), m("Siemens"), m("Bosch"), m("Neff"), m("Balay"), m("AEG"), m("Electrolux"), m("Smeg"), m("Samsung"), m("LG", /\blg\b/i), m("Whirlpool"), m("Teka"), m("Cata"), m("Beko"), m("Candy"), m("Haier"), m("Cecotec"), m("Liebherr")],
  "Climatización": [m("Daikin"), m("Mitsubishi"), m("Panasonic"), m("Fujitsu", /fujitsu|\bgeneral\b/i), m("Toshiba"), m("Vaillant"), m("Saunier Duval", /saunier/i), m("Baxi"), m("Junkers", /junkers|bosch thermotechnik/i), m("Ariston"), m("Ferroli"), m("Thermor")],
  "Suelos y carpintería": [m("Quick-Step", /quick[ -]?step/i), m("Faus"), m("Finfloor"), m("Meister"), m("Egger"), m("Cortizo"), m("Kömmerling", /k[oö]mmerling/i), m("Rijor")],
  "Iluminación y electricidad": [m("Philips"), m("Simon", /\bsimon\b/i), m("Niessen"), m("BJC", /\bbjc\b/i), m("Schneider"), m("Legrand"), m("Leds-C4", /leds[ -]?c4/i), m("Faro", /\bfaro\b/i)],
};
