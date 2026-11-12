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
| Diagnósticos (quiz) | Lista de pacientes que hicieron el quiz, con ruta sugerida, prioridad, estado y enlace a WhatsApp. |

Páginas editables hoy (diseño «cristal boutique»):

- **Datos generales, menú y pie de página**: WhatsApp, teléfono, correo, dirección, horario, logo, redes, leyenda sanitaria.
- **Inicio** (`/es` y `/en`): las 12 secciones, cada una con sus textos e imágenes.
- **Diagnóstico digital** (`/es/diagnostico-digital` y `/en/digital-assessment`), con el quiz «Diseña tu sonrisa».

En los títulos, la palabra entre `*asteriscos*` se muestra en cursiva verde.
Las páginas anteriores del sitio (`/`, `/lp/...`, `/vip`, etc.) siguen en `app/(legacy)` sin cambios de diseño.

Al guardar, el sitio se actualiza en segundos (`/api/cms/revalidate`). Si Firebase no responde,
el sitio muestra los textos por defecto de `lib/cms/defaults.ts`, así que nunca se cae.

## Puesta en marcha (una sola vez)

1. **Variables en Netlify** (Site configuration → Environment variables), las mismas del proyecto Firebase:
   `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`,
   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
   Para el build del monorepo, también `APP_NAME=marketing`. No hace falta la llave de servicio para el panel.
2. **Reglas de seguridad** (incluyen las de los diagnósticos del quiz, colección `leads`): agrega el contenido de `firebase/firestore.cms.rules` y `firebase/storage.cms.rules`
   a las reglas actuales del proyecto (Firebase Console → Firestore → Reglas, y Storage → Reglas). No borres las existentes.
3. **Storage**: actívalo en Firebase Console si aún no está activo.
4. **Usuario administrador**: en Authentication crea el usuario (correo y contraseña). Luego en
   Firestore → `users` → documento con el **UID** de ese usuario, campos `email`, `displayName` y `role: "admin"`.
5. Entra a `/admin` con ese correo.

## Agenda (Google Calendar) y formulario de fotos

El botón flotante del concierge abre WhatsApp, llamada o la agenda. La agenda muestra solo los horarios
libres del Google Calendar de la clínica y, al reservar, crea el evento «[Videollamada · por confirmar] Nombre».
Las reglas (días, horario, duración, anticipación, fechas bloqueadas) se editan en
**Páginas y textos → Concierge, agenda y fotos**. Los enlaces `#agendar`, `#agendar-virtual` y `#agendar-clinica` abren la agenda.

Variables en Netlify (secretas, nunca en el código ni por chat):

| Variable | Qué es |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Contenido del archivo JSON de la cuenta de servicio de Google (se puede pegar tal cual o en base64). |
| `GCAL_ID` | ID del calendario de la clínica (Configuración del calendario → Integrar calendario). |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Correo de envío. Con Gmail: `smtp.gmail.com`, `465`, la cuenta y una contraseña de aplicación. |
| `CLINIC_EMAIL` | Correo donde llegan los avisos de citas y las fotos. |

Comparte el calendario con el correo de la cuenta de servicio con permiso **«Hacer cambios en los eventos»**.
Si el calendario no responde, la agenda no ofrece horarios y manda al paciente a WhatsApp (nunca ofrece un horario sin verificar).

El formulario de fotos reduce cada foto en el teléfono del paciente (máx. 1600 px) y las envía como adjuntos al
`CLINIC_EMAIL`, con una confirmación al paciente. Las fotos de ejemplo van en `public/dsc/ejemplos/`
(`sonrisa.webp`, `lado-derecho.webp`, `lado-izquierdo.webp`, `arcada-superior.webp`, `arcada-inferior.webp`) o se cambian desde el panel.

El anticipo con Stripe para la valoración en clínica queda pendiente hasta que la clínica apruebe monto y condiciones.

## Cómo agregar un campo o una página editable

1. Agrega la página, sección o campo en `lib/cms/schema.ts` (el panel genera el formulario solo).
2. Pon el texto inicial en `lib/cms/defaults.ts` (ES y EN).
3. En la página, lee el valor con `getPageContent(pageId, lang)` y `reader()` de `lib/cms/content.ts`.

## Seguridad

- Solo usuarios con `role: "admin"` pueden escribir textos e imágenes; el público solo puede leerlos.
- Nunca se guardan datos de pacientes en el CMS ni en este repositorio.
- `/admin` no se indexa en Google.
