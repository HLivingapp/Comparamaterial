// Lo que más se vende en cada área, en orden: lo primero de la lista sale primero en su grupo.
// Para cambiarlo basta con añadir, quitar o reordenar líneas (cada línea es un patrón del nombre del producto).
// Los productos que no encajan con ninguna línea van después, del más barato al más caro.
// Lista inicial orientativa: se ajusta con lo que nos diga el equipo que más se vende.
export const MAS_VENDIDOS = {
  "Cerámica y colocación": [/\b60\s*[x×]\s*120\b|\b120\s*[x×]\s*60\b/i, /\b30\s*[x×]\s*60\b|\b60\s*[x×]\s*30\b/i, /\b60\s*[x×]\s*60\b/i, /\b7[.,]5\s*[x×]\s*15\b|\b10\s*[x×]\s*20\b|metro/i, /\b20\s*[x×]\s*120\b|\b23\s*[x×]\s*120\b/i],
  "Terrazas y patios": [/porcel.*\b60 ?x ?60\b.*(antidesliz|c3)|(antidesliz|c3).*\b60 ?x ?60\b/i, /composite.*\b(antracita|gris)\b/i, /c[eé]sped.*\b(20|25|30) ?mm/i, /plot/i, /encajable/i],
  "Suelos": [/laminado.*\bac ?5\b|\bac ?5\b.*laminado/i, /vin[ií]lico|spc|lvt/i, /laminado.*\bac ?4\b/i],
  "Baño": [/plato de ducha.*(80\s*[x×]\s*1[24]0|1[24]0\s*[x×]\s*80|70\s*[x×]\s*1[24]0)/i, /inodoro.*(compacto|completo|rimless|sin brida)/i, /mueble de ba[ñn]o.*(60|80)\s*(cm)?/i, /mampara.*(corredera|fija|frontal)/i, /grifo.*lavabo.*monomando|monomando.*lavabo/i, /(columna|conjunto) de ducha.*termost/i],
  "Cocina": [/^(?!.*fregadero).*\bbajo\b.*\b60\b/i, /(mueble|m[oó]dulo|armario).*fregadero/i, /^(?!.*(armario alto|columna)).*\b(alto|de pared)\b.*\b60\b/i, /columna.*horno|horno.*columna/i, /fregadero.*(1 seno|un seno|bajo encimera)/i, /grifo.*cocina/i, /placa.*inducci[oó]n/i, /campana.*(extraíble|integrable|decorativa)/i],
  "Calefacción y agua caliente": [/termo.*\b(50|80)\s*l/i, /caldera.*condensaci[oó]n/i, /radiador.*aluminio/i],
  "Aire acondicionado": [/split.*(3000|2500|3500)\s*(frigor|fg)|\b(09|9)k|\b12k/i],
  "Iluminación": [/downlight|empotrable/i, /panel led/i, /tira led/i, /foco.*carril/i],
  "Puertas": [/puerta.*(lacad|blanc).*(lisa|ciega)|lisa.*(lacad|blanc)/i, /blindad/i, /manilla/i],
  "Ventanas": [/pvc/i, /aluminio.*rpt|rotura de puente/i],
  "Electricidad": [/enchufe|base schuko/i, /interruptor|conmutador/i, /cable.*(1[.,]5|2[.,]5)\s*mm/i],
  "Pintura": [/pl[aá]stica.*blanc|blanco.*pl[aá]stic/i],
};
// Posición en la lista (0 = lo más vendido); 99 si no está en la lista.
export function prioridad(area, nombre) {
  const l = MAS_VENDIDOS[area] || [];
  const i = l.findIndex((r) => r.test(nombre));
  return i < 0 ? 99 : i;
}
