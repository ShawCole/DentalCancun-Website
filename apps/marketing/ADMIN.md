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


## Módulos del panel

| Sección | Qué hace | Quién la ve |
|---|---|---|
| Escritorio | Tablero de conversiones: visitas → diagnóstico → citas → anticipos, por idioma y tratamiento. | admin y staff |
| Pacientes | Mini CRM: une quiz, fotos y citas por WhatsApp o correo; etapa, responsable, próximo seguimiento, notas y exportación a Excel. | admin y staff |
| Agenda | Citas pedidas desde el sitio, estado, recordatorio y anticipo. | admin y staff |
| Constructor de páginas | Editor visual de bloques (Puck) para landings, promociones y páginas informativas en `/es/<dirección>` o `/en/<dirección>`. Borrador → publicar, historial y revisión de marca. | admin |
| Blog | Artículos en `/es/blog` y `/en/blog` con revisor de SEO y de marca, y versión en inglés con IA (borrador). | admin |
| Promociones | Barra superior o ventana con fechas de inicio y fin (hora de Cancún). | admin |
| Redirecciones | 301/302 sin publicar código; incluye las sugeridas para el día del cambio de dominio. | admin |
| Estado y respaldos | Servicios activos, respaldo descargable y dirección para el monitoreo. | admin |

Cada página de «Páginas y textos» guarda su historial y se puede restaurar. El botón «Sugerir inglés con IA» llena un borrador
en inglés natural de EE. UU. que siempre se revisa antes de guardar.

El rol `staff` (recepción) ve solo Escritorio, Pacientes, Agenda y Diagnósticos.

## Variables de los módulos (Netlify, secretas)

| Variable | Para qué | Si falta |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Cuenta de servicio de Firebase (Configuración del proyecto → Cuentas de servicio → Generar clave). Guarda citas, fotos (solo datos de contacto), estadísticas y respaldos. | Se usa `GOOGLE_SERVICE_ACCOUNT_JSON` si es del mismo proyecto; si no, esos módulos se apagan sin romper el sitio. |
| `CRON_SECRET` | Clave larga al azar para las tareas programadas (`netlify/functions/cron-*.mts`): recordatorios cada hora y respaldo diario a las 6:00 a.m. | No hay recordatorios ni respaldo automático. |
| `APPOINTMENT_SECRET` | Firma el enlace «cambiar o cancelar mi cita» (opcional: usa `CRON_SECRET`). | — |
| `SITE_URL` | Dirección pública (p. ej. `https://dentalcancun.com`) para enlaces de correo y el sitemap. | Usa la de Netlify. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Antispam gratuito de Cloudflare en citas y fotos. | Los formularios funcionan sin él (solo con el campo trampa). |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Anticipos en línea. Webhook: `https://<sitio>/api/stripe/webhook`, evento `checkout.session.completed`. Además, el monto en Concierge → Reglas de la agenda (vacío = sin cobro). | Sin cobro en línea. |
| `ANTHROPIC_API_KEY` (y opcional `ANTHROPIC_MODEL`) | Borradores de traducción al inglés en el panel. | El botón avisa que no está activo. |

Después de agregar las reglas nuevas de `firebase/firestore.cms.rules` y `firebase/storage.cms.rules`, crea el índice de
`firebase/firestore.cms.indexes.json` (Firestore → Índices) para el historial; Firebase también ofrece crearlo con un enlace la primera vez que se abre.

Monitoreo: da de alta `https://<sitio>/api/health` en UptimeRobot o Better Stack (responde 200 o 503, sin datos sensibles).

Cookies: los píxeles de Meta e IDPixel y el conteo de visitas solo se cargan si el visitante los acepta en el aviso de cookies.

## Cómo agregar un campo o una página editable

1. Agrega la página, sección o campo en `lib/cms/schema.ts` (el panel genera el formulario solo).
2. Pon el texto inicial en `lib/cms/defaults.ts` (ES y EN).
3. En la página, lee el valor con `getPageContent(pageId, lang)` y `reader()` de `lib/cms/content.ts`.

## Seguridad

- Solo usuarios con `role: "admin"` pueden escribir textos e imágenes; el público solo puede leerlos.
- Nunca se guardan datos de pacientes en el CMS ni en este repositorio. Las fotos de pacientes viajan solo por correo a la clínica.
- Citas, fotos (datos de contacto) y estadísticas las escribe solo el servidor; el panel puede leerlas y cambiar el estado.
- Un caso real de antes y después no se muestra en el sitio hasta marcar que hay autorización firmada del paciente.
- El constructor, el blog y las promociones no publican frases prohibidas por la marca ni datos marcados [VALIDAR] o [PENDIENTE].
- `/admin` no se indexa en Google.
