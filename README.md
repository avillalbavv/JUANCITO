# Consulta Electoral — Juancito Zalazar

Aplicación para consultar el padrón de Piribebuy por número de cédula o por nombre y apellido. Incluye una web adaptable y un proyecto de Android Studio que funciona sin conexión.

## Contenido

- `app/`: interfaz web y API de consulta.
- `data/padron/`: padrón de Piribebuy dividido en fragmentos utilizados únicamente por el servidor web.
- `android-studio/`: aplicación Android offline con la misma base local.
- `public/candidatos/`: fotos, icono y logos oficiales utilizados por la web.
- `android-studio/app/src/main/assets/candidatos/`: copia offline de los mismos recursos para Android.

La consulta pública devuelve solamente nombre, cédula enmascarada, local, mesa y orden. No expone fecha de nacimiento ni afiliación.

## Ejecutar la web

Requiere Node.js 22 o posterior.

```bash
npm install
npm run dev
```

Para validar la versión final:

```bash
npm run build
npm start
```

## Publicar en Cloudflare Pages

En **Settings → Build → Build configuration** usar exactamente:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: dejar vacío

El build prepara automáticamente `dist/_worker.js` para Cloudflare Pages en modo avanzado. Esto permite servir tanto la interfaz como `/api/consulta`; no hay que cambiar el directorio de salida a `dist/client`.

## Abrir en Android Studio

1. Abrir Android Studio.
2. Elegir **Open**.
3. Seleccionar la carpeta `android-studio`.
4. Esperar la sincronización de Gradle.
5. Ejecutar en un teléfono o emulador con Android 8.0 o superior.

La app Android consulta los fragmentos de `app/src/main/assets/padron/` localmente, sin enviar la cédula ni el nombre a Internet.

## Recursos oficiales incluidos

La web y la aplicación Android ya incluyen las fotografías transparentes de Juancito Zalazar y Enmanuel Gini, el icono circular y los logos de Lista 1 / Opción 3. Si alguna fotografía faltara, el diseño mantiene un monograma `JZ` o `EG` para no mostrar imágenes rotas.

## Antes de publicar

- Revisar los nombres políticos y las leyendas de Lista 1 / Opción 3.
- Confirmar que la base electoral sea la versión autorizada más reciente.
- Aplicar límites de consultas y protección contra automatización en el despliegue público.
