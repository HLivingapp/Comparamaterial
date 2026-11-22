# Comparamaterial

Web estática con precios públicos de materiales de obra en almacenes de Madrid, publicada en https://comparamaterial.com.

- Datos: `datos/precios.json`. Solo precios públicos de la web de cada almacén, IVA incluido, con enlace y fecha. Nunca tarifas privadas.
- Generar: `node generar.mjs dist` (sin dependencias). Variables: `SITE_URL`, `REGISTRO_URL`, `NOMBRE_WEB`, `INDEXAR=1`.
- Publicación: cada push a `main` genera la web y la publica en GitHub Pages (`.github/workflows/publicar.yml`).

## Puesta en marcha (una vez)
1. Settings → Pages → Source: «GitHub Actions». Custom domain: `comparamaterial.com`. Marcar «Enforce HTTPS» cuando esté disponible.
2. DNS en DonDominio: registros A de `comparamaterial.com` a 185.199.108.153, 185.199.109.153, 185.199.110.153 y 185.199.111.153; CNAME de `www` a `hlivingapp.github.io`.

## Actualizar precios
Editar `datos/precios.json` (precio, enlace) y cambiar `fecha`.
