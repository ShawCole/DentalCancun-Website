# Administrador del sitio (CMS)

Panel tipo WordPress en `/admin` para editar textos (español e inglés) e imágenes sin tocar código.
Usa el Firebase que ya tiene el proyecto: **Authentication** para entrar, **Firestore** para los
textos y **Storage** para las imágenes.

## Qué incluye esta primera versión

| Sección del panel | Qué hace |
|---|---|
| Escritorio | Accesos rápidos. |
| Páginas y textos | Edita cada página por secciones, con pestañas Español / English y campos de SEO. |
| Imágenes | Sube, reutiliza y borra imágenes (máx. 8 MB, JPG/PNG/WebP/GIF/SVG). |

Páginas editables hoy: **Datos generales** (WhatsApp, teléfono, correo, dirección, horario, logo, redes)
e **Inicio** (portada y SEO). La versión en español del inicio vive en `/es`.

Al guardar, el sitio se actualiza en segundos (`/api/cms/revalidate`). Si Firebase no responde,
el sitio muestra los textos por defecto de `lib/cms/defaults.ts`, así que nunca se cae.

## Puesta en marcha (una sola vez)

1. **Variables en Netlify** (Site configuration → Environment variables), las mismas del proyecto Firebase:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`,
   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
   Para el build del monorepo, también `APP_NAME=marketing`. No hace falta la llave de servicio para el panel.
2. **Reglas de seguridad**: agrega el contenido de `firebase/firestore.cms.rules` y `firebase/storage.cms.rules`
   a las reglas actuales del proyecto (Firebase Console → Firestore → Reglas, y Storage → Reglas). No borres las existentes.
3. **Storage**: actívalo en Firebase Console si aún no está activo.
4. **Usuario administrador**: en Authentication crea el usuario (correo y contraseña). Luego en
   Firestore → `users` → documento con el **UID** de ese usuario, campos `email`, `displayName` y `role: "admin"`.
5. Entra a `/admin` con ese correo.

## Cómo agregar un campo o una página editable

1. Agrega la página, sección o campo en `lib/cms/schema.ts` (el panel genera el formulario solo).
2. Pon el texto inicial en `lib/cms/defaults.ts` (ES y EN).
3. En la página, lee el valor con `getPageContent(pageId, lang)` y `reader()` de `lib/cms/content.ts`.

## Seguridad

- Solo usuarios con `role: "admin"` pueden escribir textos e imágenes; el público solo puede leerlos.
- Nunca se guardan datos de pacientes en el CMS ni en este repositorio.
- `/admin` no se indexa en Google.
