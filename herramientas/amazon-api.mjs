// Carga precio, foto y título de los productos de datos/amazon.json desde la API de Amazon (Product Advertising API 5, GetItems)
// y los guarda en datos/amazon-api.json, que generar.mjs usa si el dato tiene menos de 24 h.
// Amazon solo da acceso a la API cuando la cuenta de afiliado tiene ventas (unas 10 en 30 días).
// Uso: AMAZON_ACCESS_KEY=… AMAZON_SECRET_KEY=… AMAZON_TAG=comparamateri-21 node herramientas/amazon-api.mjs
// Si Amazon cambia de API (anuncia sustituir PA-API 5 por la «Creators API»), solo hay que adaptar pedir().
import { readFileSync, writeFileSync } from "node:fs";
import { createHash, createHmac } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = join(dirname(fileURLToPath(import.meta.url)), "..");
const { AMAZON_ACCESS_KEY: AK, AMAZON_SECRET_KEY: SK } = process.env;
const TAG = process.env.AMAZON_TAG || "comparamateri-21";
if (!AK || !SK) { console.log("Sin AMAZON_ACCESS_KEY / AMAZON_SECRET_KEY: no se cargan precios de Amazon."); process.exit(0); }

const HOST = "webservices.amazon.es", REGION = "eu-west-1", PATH = "/paapi5/getitems";
const sha = (s) => createHash("sha256").update(s).digest("hex");
const hmac = (k, s) => createHmac("sha256", k).update(s).digest();

async function pedir(asins) {
  const body = JSON.stringify({ ItemIds: asins, PartnerTag: TAG, PartnerType: "Associates", Marketplace: "www.amazon.es",
    Resources: ["ItemInfo.Title", "Images.Primary.Medium", "Offers.Listings.Price"] });
  const fecha = new Date().toISOString().replace(/[-:]|\.\d{3}/g, ""), dia = fecha.slice(0, 8);
  const cab = { "content-encoding": "amz-1.0", "content-type": "application/json; charset=utf-8", host: HOST, "x-amz-date": fecha,
    "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems" };
  const nombres = Object.keys(cab).sort();
  const canon = ["POST", PATH, "", nombres.map((k) => `${k}:${cab[k]}\n`).join(""), nombres.join(";"), sha(body)].join("\n");
  const ambito = `${dia}/${REGION}/ProductAdvertisingAPI/aws4_request`;
  const firmar = ["AWS4-HMAC-SHA256", fecha, ambito, sha(canon)].join("\n");
  let k = hmac("AWS4" + SK, dia); for (const p of [REGION, "ProductAdvertisingAPI", "aws4_request"]) k = hmac(k, p);
  const firma = createHmac("sha256", k).update(firmar).digest("hex");
  const r = await fetch(`https://${HOST}${PATH}`, { method: "POST", body,
    headers: { ...cab, Authorization: `AWS4-HMAC-SHA256 Credential=${AK}/${ambito}, SignedHeaders=${nombres.join(";")}, Signature=${firma}` } });
  const j = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(j.Errors || j));
  return j.ItemsResult?.Items || [];
}

const productos = JSON.parse(readFileSync(join(aqui, "datos", "amazon.json"), "utf8")).productos;
const salida = {};
for (let i = 0; i < productos.length; i += 10) {
  const items = await pedir(productos.slice(i, i + 10).map((p) => p.asin));
  for (const it of items) {
    salida[it.ASIN] = { titulo: it.ItemInfo?.Title?.DisplayValue, precio: it.Offers?.Listings?.[0]?.Price?.Amount,
      imagen: it.Images?.Primary?.Medium?.URL, fecha: new Date().toISOString() };
  }
  await new Promise((ok) => setTimeout(ok, 1100)); // 1 petición por segundo
}
writeFileSync(join(aqui, "datos", "amazon-api.json"), JSON.stringify(salida, null, 1) + "\n");
console.log(`Amazon: ${Object.keys(salida).length} de ${productos.length} productos con datos de la API.`);
