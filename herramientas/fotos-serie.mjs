// Fotos de nuestras obras en las que sabemos seguro qué azulejo hay puesto (la serie sale en la factura de NAIS).
// Se usan en las fichas de esa misma serie y color. Recortes sin direcciones ni personas.
export const FOTOS_SERIE = [
  [/\bargile khaki\b/i, "obra-nais-argile-khaki", "NAIS Argile Khaki 6×24,6, pared de baño"],
  [/\bvillage aubergine\b/i, "obra-nais-village-aubergine", "NAIS Village Aubergine 6,5×20, pared de baño"],
  [/\bmas[ií]a blue\b/i, "obra-nais-masia-blue", "NAIS Masía Blue 7,5×15, pared de baño"],
  [/\bcountry blanco\b(?! mate)/i, "obra-nais-country-blanco", "NAIS Country Blanco 13,2×13,2, pared de baño"],
  [/\bcurve aquarium\b/i, "obra-nais-curve-aquarium", "NAIS Curve Aquarium 8,3×12, pared de ducha"],
  [/\bcaprice chess colou?rs\b/i, "obra-nais-caprice-chess-colours", "NAIS Caprice Chess Colours 20×20, suelo de baño"],
  [/\bcosta nova aloe matt\b/i, "obra-nais-costa-nova-aloe-matt", "NAIS Costa Nova Aloe Matt 5×20, frente de cocina en espiga"],
];
export function fotoSerie(nombre) {
  const f = FOTOS_SERIE.find(([r]) => r.test(nombre));
  return f ? { miniatura: `img/${f[1]}.webp`, propia: true, serie: f[2] } : null;
}
