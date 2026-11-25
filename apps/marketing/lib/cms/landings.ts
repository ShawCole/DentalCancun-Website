/**
 * Treatment landing pages: one shared layout, seven pages.
 * Spanish copy comes from the approved WordPress staging (without the doctor's name);
 * English is written for US patients, not translated word for word.
 * [VALIDAR] marks prices and terms the clinic still has to approve.
 */
import type { PageDoc, PageValues } from "./schema";

type Pair = [string, string];
export interface LandingCopy {
    kicker: string;
    title: string;
    subtitle: string;
    facts: Pair[];
    introTitle: string;
    introText: string;
    fitTitle: string;
    fit: Pair[];
    fitNote: string;
    processTitle: string;
    steps: Pair[];
    expertTitle: string;
    expertText: string;
    priceAmount: string;
    priceNote: string;
    faqTitle: string;
    faq: Pair[];
    closingTitle: string;
    waMsg: string;
    seoTitle: string;
    seoDesc: string;
}

export interface Landing {
    id: string;
    slug: { es: string; en: string };
    label: string;
    images: [string, string];
    videos: string;
    es: LandingCopy;
    en: LandingCopy;
}

const fitTitleEs = "Un tratamiento pensado para quien valora su imagen y su *tiempo*.";
const fitTitleEn = "Made for people who care about how they look, and *value their time*.";
const processEs = "Cada paso, planeado contigo *antes* de que viajes.";
const processEn = "Every step planned with you *before* you travel.";
const faqEs = "Pregúntale a nuestro *equipo*.";
const faqEn = "Ask our *dental team*.";
const closingEs = "Tu transformación comienza con una *valoración privada*.";
const closingEn = "Your smile makeover starts with a *private consultation*.";

export const LANDINGS: Landing[] = [
    {
        id: "carillas-directas",
        slug: { es: "carillas-directas-en-composite", en: "direct-composite-veneers" },
        label: "Carillas directas en composite",
        images: ["/dsc/carillas-directas-02.jpg", "/dsc/carillas-directas-01.jpg"],
        videos: "2,5,10",
        es: {
            kicker: "Carillas directas en composite",
            title: "Carillas directas: una sonrisa nueva, esculpida en *una sola cita*.",
            subtitle: "Color, forma y proporción trabajados a mano sobre tus dientes, con la precisión de 25 años de trayectoria y la calma de una clínica boutique en Puerto Cancún.",
            facts: [["Citas", "1, de alrededor de 3 horas"], ["Estancia sugerida", "2 a 3 días"], ["Garantía", "1 año [VALIDAR]"], ["Inversión de referencia", "USD 250 por carilla [VALIDAR]"]],
            introTitle: "Una transformación delicada, que respeta *lo que eres*.",
            introText: "Las carillas directas permiten mejorar el color, la forma y pequeños espacios sin desgastes innecesarios. Cada capa de resina se modela directamente en tu boca, de modo que puedes ver cómo tu sonrisa toma forma y opinar en cada paso. El resultado es luminoso, armónico y profundamente tuyo.",
            fitTitle: fitTitleEs,
            fit: [["Color que no te representa", "Dientes opacos, manchados o con tonos irregulares."], ["Formas desiguales", "Bordes desgastados, dientes cortos o asimétricos."], ["Pequeños espacios", "Separaciones discretas que prefieres cerrar."], ["Tiempo valioso", "Buscas un cambio notable sin varias visitas."]],
            fitNote: "La técnica directa se indica en casos seleccionados. Si tu caso necesita otra solución, te lo diremos con claridad.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos tus fotos y conversamos por videollamada antes de que viajes."], ["Diseño de tu sonrisa", "Definimos contigo forma, tono y proporción según tu rostro."], ["Una sola cita", "Nuestro equipo modela cada carilla a mano; hasta 20 en alrededor de 3 horas, según el caso."], ["Pulido y ajustes", "Revisamos mordida, brillo y comodidad antes de que te vayas."], ["Seguimiento", "Te acompañamos a distancia cuando regresas a casa."]],
            expertTitle: "Precisión artesanal y materiales de *alta estética*.",
            expertText: "Trabajamos con resinas de la línea Ivoclar Vivadent, elegidas por su estabilidad de color y su naturalidad, y conservamos tu estructura dental siempre que es posible.",
            priceAmount: "USD 250 por carilla [VALIDAR]",
            priceNote: "El monto final se confirma después de tu valoración clínica, según el número de carillas y las necesidades de tu caso. Garantía de 1 año sujeta a mantenimiento y condiciones.",
            faqTitle: faqEs,
            faq: [
                ["¿Cuánto dura la cita para carillas directas?", "En casos seleccionados, la colocación de hasta 20 carillas se realiza en una sola cita de alrededor de 3 horas. El tiempo exacto depende de tu caso y se confirma en la valoración."],
                ["¿Las carillas directas desgastan mis dientes?", "La técnica directa busca conservar la mayor cantidad de estructura dental posible. En muchos casos el desgaste es mínimo o nulo; en tu valoración te explicamos lo que necesita tu caso."],
                ["¿Cuánto tiempo duran las carillas de resina?", "Su duración depende de tus hábitos, del cuidado diario y de las revisiones de mantenimiento. Te entregamos una guía de cuidados y una garantía de 1 año sujeta a condiciones."],
                ["¿Puedo saber si soy candidato antes de viajar?", "Sí. Con 5 fotos de tu sonrisa y una videollamada hacemos una pre-evaluación sin costo; la indicación final se confirma en la valoración clínica en Cancún."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesan las carillas directas",
            seoTitle: "Carillas directas en Cancún en una sola cita | Dental Solutions",
            seoDesc: "Carillas de resina modeladas a mano en una cita de alrededor de 3 horas, con valoración virtual sin costo en Puerto Cancún.",
        },
        en: {
            kicker: "Direct composite veneers",
            title: "Direct veneers: a brand-new smile, sculpted in *a single visit*.",
            subtitle: "Color, shape and proportion hand-sculpted right on your teeth, backed by 25 years of experience and the calm of a boutique clinic in Puerto Cancún.",
            facts: [["Visits", "1 visit, about 3 hours"], ["Recommended stay", "2–3 days"], ["Guarantee", "1 year [VALIDAR]"], ["Starting at", "USD 250 per veneer [VALIDAR]"]],
            introTitle: "A subtle transformation that still *looks like you*.",
            introText: "Direct veneers fix color, shape and small gaps without grinding down healthy tooth. Each layer of composite is sculpted right in your mouth, so you watch your smile take shape and weigh in at every step. The result is bright, balanced and completely yours.",
            fitTitle: fitTitleEn,
            fit: [["A color that isn’t you", "Dull, stained or uneven teeth."], ["Uneven shapes", "Worn edges, short or lopsided teeth."], ["Small gaps", "Little spaces you’d rather close."], ["Short on time", "You want a big change without multiple visits."]],
            fitNote: "Direct veneers aren’t right for everyone. If your case needs something else, we’ll tell you straight.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your photos and talk over video before you travel."], ["Your smile design", "Together we choose shape, shade and proportion to suit your face."], ["One visit", "Our team sculpts each veneer by hand — up to 20 in about 3 hours, depending on your case."], ["Polish and fine-tune", "We check your bite, shine and comfort before you leave."], ["Follow-up", "We stay in touch after you fly home."]],
            expertTitle: "Hand-crafted precision and *premium materials*.",
            expertText: "We use Ivoclar Vivadent composites, chosen because they hold their color and look natural, and we save as much of your natural tooth as we can.",
            priceAmount: "USD 250 per veneer [VALIDAR]",
            priceNote: "Your final price is confirmed after your exam, based on how many veneers you need. The 1-year guarantee requires regular maintenance and follows our terms.",
            faqTitle: faqEn,
            faq: [
                ["How long is the appointment for direct veneers?", "For the right candidates, up to 20 veneers can be placed in one visit of about 3 hours. We confirm the exact time at your consultation."],
                ["Do direct veneers damage my teeth?", "This technique is designed to save as much natural tooth as possible. Often there’s little or no drilling at all; we’ll walk you through what your case needs."],
                ["How long do composite veneers last?", "It depends on your habits, daily care and maintenance visits. You’ll get a care guide and a 1-year guarantee, subject to our terms."],
                ["Can I find out if I’m a candidate before I travel?", "Yes. Send us 5 photos of your smile and hop on a video call for a free evaluation. Your dentist confirms the treatment at your exam in Cancun."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in direct veneers",
            seoTitle: "Direct Composite Veneers in Cancun, One Visit | Dental Solutions",
            seoDesc: "Hand-sculpted composite veneers in about 3 hours, with a free virtual consultation, at our boutique clinic in Puerto Cancún.",
        },
    },
    {
        id: "carillas-ceramicas",
        slug: { es: "carillas-e-max-y-zirconio", en: "emax-zirconia-veneers" },
        label: "Carillas E-max y zirconio",
        images: ["/dsc/stock-carilla-detalle.jpg", "/dsc/stock-sonrisa-01.jpg"],
        videos: "3,6,11",
        es: {
            kicker: "Carillas cerámicas E-max y zirconio",
            title: "Carillas E-max y zirconio: la luminosidad de la cerámica, *diseñada para tu rostro*.",
            subtitle: "Una restauración de alta estética que imita la translucidez natural del diente, planificada con detalle y realizada en una estancia breve en Puerto Cancún.",
            facts: [["Citas", "3"], ["Estancia sugerida", "3 a 4 días"], ["Garantía", "5 años [VALIDAR]"], ["Inversión de referencia", "USD 450 por carilla [VALIDAR]"]],
            introTitle: "Cerámica que se ve y se siente *natural*.",
            introText: "Las carillas E-max y de zirconio son láminas cerámicas de gran resistencia y brillo natural. Se diseñan a partir del análisis de tu rostro, tu sonrisa y tu expresión, para que el resultado se perciba elegante, armónico y fiel a quien eres.",
            fitTitle: fitTitleEs,
            fit: [["Cambios de color profundos", "Tonos que no mejoran con blanqueamiento."], ["Forma y proporción", "Dientes desiguales, desgastados o con fracturas pequeñas."], ["Búsqueda de durabilidad", "Prefieres un material de alta resistencia y estabilidad."], ["Restauraciones antiguas", "Deseas renovar trabajos previos que ya no te representan."]],
            fitNote: "La cerámica no es la opción ideal para todos. En tu valoración comparamos alternativas para elegir la menos invasiva que resuelva tu caso.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos tus fotos y estudios antes de que reserves tu vuelo."], ["Cita 1 · Diseño y preparación", "Planificamos forma y tono, preparamos y tomamos registros."], ["Laboratorio", "Tus carillas se elaboran con cuidado artesanal mientras disfrutas Cancún."], ["Cita 2 · Prueba", "Revisamos ajuste, color y armonía contigo."], ["Cita 3 · Cementado", "Colocamos tus carillas y verificamos mordida y comodidad."]],
            expertTitle: "Materiales de alta estética y *planificación precisa*.",
            expertText: "Utilizamos cerámicas de la línea Ivoclar Vivadent y protocolos de adhesión cuidadosos, porque una carilla bella también debe ser estable y cómoda con el paso del tiempo.",
            priceAmount: "USD 450 por carilla [VALIDAR]",
            priceNote: "El monto final se confirma después de tu valoración clínica. Garantía de 5 años sujeta a mantenimiento, revisiones y condiciones.",
            faqTitle: faqEs,
            faq: [
                ["¿Cuántos días necesito en Cancún para carillas de porcelana?", "Las carillas E-max o de zirconio suelen requerir 3 citas y una estancia de 3 a 4 días. Te confirmamos el itinerario exacto en tu plan personalizado, antes de que reserves."],
                ["¿Qué diferencia hay entre carillas de resina y de cerámica?", "La resina se modela directamente en una cita; la cerámica se elabora en laboratorio y ofrece mayor estabilidad de color y resistencia. En tu valoración te recomendamos la opción adecuada para tu caso."],
                ["¿Se verán naturales?", "Diseñamos forma, tono y translucidez a partir de tu rostro y tu expresión, y revisamos el resultado contigo antes del cementado."],
                ["¿Qué incluye la garantía?", "Cubre la solución clínica cuando el caso califica, sujeta a mantenimiento y condiciones. No incluye vuelos, hospedaje ni traslados."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesan las carillas cerámicas",
            seoTitle: "Carillas E-max y zirconio en Cancún | Dental Solutions",
            seoDesc: "Carillas de porcelana E-max y zirconio en 3 citas y 3 a 4 días en Cancún, con valoración virtual sin costo.",
        },
        en: {
            kicker: "E-max and zirconia porcelain veneers",
            title: "E-max and zirconia veneers: the glow of porcelain, *designed for your face*.",
            subtitle: "Premium porcelain that mimics the natural translucency of real teeth, carefully planned and done in a short stay in Puerto Cancún.",
            facts: [["Visits", "3"], ["Recommended stay", "3–4 days"], ["Guarantee", "5 years [VALIDAR]"], ["Starting at", "USD 450 per veneer [VALIDAR]"]],
            introTitle: "Porcelain that looks and feels *natural*.",
            introText: "E-max and zirconia veneers are thin, very strong porcelain shells with a natural shine. We design them around your face, your smile and your expression, so the result looks elegant, balanced and true to who you are.",
            fitTitle: fitTitleEn,
            fit: [["Deep discoloration", "Stains that whitening can’t fix."], ["Shape and proportion", "Uneven, worn or slightly chipped teeth."], ["Built to last", "You want a strong, stain-resistant material."], ["Old dental work", "You want to replace work that no longer looks right."]],
            fitNote: "Porcelain isn’t right for everyone. At your consultation we compare options and pick the least invasive one that works for you.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your photos and records before you book your flight."], ["Visit 1 · Design and prep", "We plan shape and shade, prep your teeth and take impressions."], ["Dental lab", "Your veneers are hand-crafted while you enjoy Cancun."], ["Visit 2 · Try-in", "We check the fit, color and look with you."], ["Visit 3 · Bonding", "We bond your veneers and check your bite and comfort."]],
            expertTitle: "Premium materials and *precise planning*.",
            expertText: "We use Ivoclar Vivadent porcelain and careful bonding protocols, because a beautiful veneer also has to stay stable and comfortable for years.",
            priceAmount: "USD 450 per veneer [VALIDAR]",
            priceNote: "Your final price is confirmed after your exam. The 5-year guarantee requires regular maintenance and check-ups, and follows our terms.",
            faqTitle: faqEn,
            faq: [
                ["How many days do I need in Cancun for porcelain veneers?", "E-max and zirconia veneers usually take 3 visits over a 3–4 day stay. We confirm your exact itinerary in your custom plan, before you book."],
                ["What’s the difference between composite and porcelain veneers?", "Composite is sculpted directly in one visit. Porcelain is made in a lab and holds its color and strength better. We’ll recommend the right one for you at your consultation."],
                ["Will they look natural?", "We design the shape, shade and translucency around your face and expression, and you approve the result before we bond them."],
                ["What does the guarantee cover?", "It covers the dental fix when your case qualifies, with regular maintenance and under our terms. It doesn’t cover flights, hotel or transportation."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in porcelain veneers",
            seoTitle: "E-max & Zirconia Porcelain Veneers in Cancun | Dental Solutions",
            seoDesc: "Porcelain veneers in 3 visits over 3–4 days in Cancun, with a free virtual consultation and concierge support.",
        },
    },
    {
        id: "implantes",
        slug: { es: "implantes-dentales", en: "dental-implants" },
        label: "Implantes dentales",
        images: ["/dsc/implantes.jpg", ""],
        videos: "4,8,13",
        es: {
            kicker: "Implantes dentales",
            title: "Implantes dentales en Cancún: recupera la *firmeza* de tu sonrisa con seguridad.",
            subtitle: "Planificación digital, sistemas de implantes de calidad internacional y un equipo que te acompaña en cada etapa, desde la primera valoración hasta tu regreso a casa.",
            facts: [["Etapas", "Colocación e integración, y prótesis final"], ["Estancia", "Según tu plan [VALIDAR]"], ["Sistemas", "Neodent y Alpha-Bio Tec"], ["Inversión", "Según tu valoración"]],
            introTitle: "Volver a comer, hablar y sonreír *sin pensarlo*.",
            introText: "Un implante reemplaza la raíz de un diente perdido y sostiene una corona diseñada para integrarse con tu sonrisa. Más allá de la estética, devuelve algo invaluable: la tranquilidad de morder, conversar y sonreír con naturalidad.",
            fitTitle: fitTitleEs,
            fit: [["Un diente ausente", "Deseas reponerlo sin afectar los dientes vecinos."], ["Varios dientes", "Buscas una solución fija y estable."], ["Prótesis incómodas", "Quieres dejar atrás lo removible."], ["Planificación previa", "Prefieres conocer tu plan antes de viajar."]],
            fitNote: "La indicación depende de tu salud general, del hueso disponible y de tus estudios de imagen. Todo se confirma en la valoración clínica.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos tus fotos y radiografías, o CBCT si ya lo tienes."], ["Planificación 3D", "Definimos posición y tipo de implante con imagen tridimensional."], ["Colocación", "Nuestro especialista en implantología coloca tus implantes con protocolos de seguridad."], ["Integración", "Tu hueso y el implante se unen; te acompañamos a distancia."], ["Prótesis final", "Diseñamos y colocamos tu corona o prótesis definitiva."]],
            expertTitle: "Seguridad clínica y *sistemas reconocidos*.",
            expertText: "Trabajamos con sistemas de implantes Neodent y Alpha-Bio Tec, según la indicación de cada caso, y planificamos con imagen 3D para cuidar cada milímetro.",
            priceAmount: "Plan personalizado",
            priceNote: "La inversión depende del número de implantes, de los estudios y de la prótesis que necesites. Te la presentamos por escrito después de tu valoración, antes de que reserves.",
            faqTitle: faqEs,
            faq: [
                ["¿Cuántas visitas necesito para un implante dental?", "Por lo general, dos etapas: la colocación del implante y, después de la integración, la prótesis definitiva. Tu plan personalizado define tiempos y estancias."],
                ["¿Quién coloca los implantes?", "Nuestro equipo de rehabilitación oral dirige tu tratamiento, y los implantes los coloca nuestro especialista en implantología."],
                ["¿Puedo saber si soy candidato antes de viajar?", "Sí. Con tus fotos, radiografías o CBCT hacemos una pre-evaluación y una videollamada; la decisión final se confirma con estudios en Cancún."],
                ["¿Qué pasa si necesito atención al volver a casa?", "Te acompañamos con seguimiento a distancia y, si hace falta, coordinamos tu siguiente visita a Cancún."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesan los implantes dentales",
            seoTitle: "Implantes dentales en Cancún | Dental Solutions",
            seoDesc: "Implantes Neodent y Alpha-Bio Tec con planificación 3D en Puerto Cancún, valoración virtual sin costo y seguimiento a distancia.",
        },
        en: {
            kicker: "Dental implants",
            title: "Dental implants in Cancun: get back a smile that feels *solid*.",
            subtitle: "Digital planning, internationally trusted implant systems and a team that’s with you at every stage, from your first consultation to your trip home.",
            facts: [["Stages", "Placement and healing, then the final crown"], ["Stay", "Based on your plan [VALIDAR]"], ["Implant systems", "Neodent and Alpha-Bio Tec"], ["Cost", "Based on your exam"]],
            introTitle: "Eat, talk and smile *without thinking twice*.",
            introText: "An implant replaces the root of a missing tooth and holds a crown designed to blend in with your smile. Beyond looks, it gives you back something priceless: the confidence to bite, talk and smile naturally.",
            fitTitle: fitTitleEn,
            fit: [["One missing tooth", "You want to replace it without touching the teeth next to it."], ["Several missing teeth", "You want something fixed and stable."], ["Uncomfortable dentures", "You’re ready to leave removable behind."], ["Plan ahead", "You’d like to see your plan before you travel."]],
            fitNote: "Whether implants are right for you depends on your overall health, your bone and your X-rays. We confirm everything at your exam.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your photos and X-rays, or your CBCT scan if you have one."], ["3D planning", "We map the position and type of implant with 3D imaging."], ["Placement", "Our implant specialist places your implants following strict safety protocols."], ["Healing", "Your bone bonds with the implant while we check in remotely."], ["Final restoration", "We design and place your permanent crown or bridge."]],
            expertTitle: "Clinical safety and *trusted implant systems*.",
            expertText: "We use Neodent and Alpha-Bio Tec implant systems, depending on each case, and plan with 3D imaging down to the millimeter.",
            priceAmount: "Custom plan",
            priceNote: "Your cost depends on how many implants you need, your scans and the type of restoration. You’ll get it in writing after your consultation, before you book anything.",
            faqTitle: faqEn,
            faq: [
                ["How many trips do I need for a dental implant?", "Usually two stages: placing the implant and, once it heals, the final crown. Your custom plan spells out the timing and how long you’ll stay."],
                ["Who places the implants?", "Our restorative team leads your treatment, and your implants are placed by our implant specialist."],
                ["Can I find out if I’m a candidate before I travel?", "Yes. Send us your photos and X-rays or CBCT for a free evaluation and video call. We confirm the final plan with scans in Cancun."],
                ["What if I need help after I get home?", "We check in with you remotely and, if needed, set up your next visit to Cancun."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in dental implants",
            seoTitle: "Dental Implants in Cancun | Dental Solutions",
            seoDesc: "Neodent and Alpha-Bio Tec implants with 3D planning in Puerto Cancún, a free virtual consultation and remote follow-up.",
        },
    },
    {
        id: "all-on-4",
        slug: { es: "all-on-4-y-all-on-6", en: "all-on-4-all-on-6" },
        label: "All-on-4 y All-on-6",
        images: ["/dsc/stock-ejecutivo.jpg", ""],
        videos: "1,9,14",
        es: {
            kicker: "Rehabilitación de arcada completa",
            title: "All-on-4 y All-on-6: una sonrisa fija para *volver a vivir* con confianza.",
            subtitle: "Una arcada completa sobre 4 o 6 implantes, planificada con precisión y acompañada de principio a fin, para recuperar la libertad de comer, hablar y sonreír.",
            facts: [["Estancias", "2, de 5 a 7 días"], ["Primera fase", "Prótesis provisional fija"], ["Garantía", "Hasta 5 años [VALIDAR]"], ["Inversión de referencia", "Desde USD 9,900 / 11,900 por arcada [VALIDAR]"]],
            introTitle: "Un nuevo comienzo, con la seguridad de *un plan claro*.",
            introText: "Cuando faltan muchos dientes o las prótesis ya no dan tranquilidad, una rehabilitación fija sobre implantes puede cambiarlo todo. Te explicamos cada etapa con transparencia, para que tomes tu decisión con calma y sepas exactamente qué esperar.",
            fitTitle: fitTitleEs,
            fit: [["Arcada con muchos dientes ausentes", "O dientes que ya no pueden conservarse."], ["Prótesis removible", "Que se mueve o limita lo que comes."], ["Deseo de una solución fija", "Que se sienta firme y natural."], ["Planificación integral", "Prefieres un plan completo antes de decidir."]],
            fitNote: "La elección entre 4 o 6 implantes depende de tu hueso, tu salud y tus estudios. La definimos juntos en la valoración clínica.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos fotos, radiografías o CBCT y conversamos contigo."], ["Plan integral", "Definimos número de implantes, tiempos y estancias."], ["Primera estancia · 5 a 7 días", "Colocación de implantes y prótesis provisional fija."], ["Integración en casa", "Seguimiento a distancia mientras tu hueso se adapta."], ["Segunda estancia · 5 a 7 días", "Prótesis definitiva, ajustes finales y cuidados."]],
            expertTitle: "Un equipo clínico para un *tratamiento integral*.",
            expertText: "Tu rehabilitación la dirige nuestro equipo de rehabilitación oral, con especialistas en implantología y periodoncia. Trabajamos con sistemas Neodent y Alpha-Bio Tec, según tu caso.",
            priceAmount: "Desde USD 9,900 (All-on-4) · USD 11,900 (All-on-6) por arcada [VALIDAR]",
            priceNote: "Corresponde a la primera fase con prótesis provisional fija; la prótesis definitiva se cotiza aparte. El monto final se confirma después de tu valoración clínica.",
            faqTitle: faqEs,
            faq: [
                ["¿Cuánto tiempo necesito estar en Cancún para All-on-4?", "El tratamiento suele realizarse en dos estancias de 5 a 7 días: una para los implantes y la prótesis provisional fija, y otra para la prótesis definitiva."],
                ["¿Cuál es la diferencia entre All-on-4 y All-on-6?", "La diferencia es el número de implantes que sostienen la arcada. La elección depende de tu hueso, tus estudios y tus necesidades, y se define en la valoración."],
                ["¿Saldré con dientes fijos en la primera estancia?", "En la mayoría de los casos colocamos una prótesis provisional fija en la primera estancia; tu plan confirma lo que aplica a tu caso."],
                ["¿Qué incluye la inversión de referencia?", "La primera fase con prótesis provisional fija. La prótesis definitiva se cotiza aparte y te presentamos todo por escrito antes de reservar."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesa el tratamiento All-on-4",
            seoTitle: "All-on-4 y All-on-6 en Cancún | Dental Solutions",
            seoDesc: "Arcada completa fija sobre 4 o 6 implantes en dos estancias en Cancún, con plan por escrito antes de viajar.",
        },
        en: {
            kicker: "Full-arch restoration",
            title: "All-on-4 and All-on-6: a fixed smile so you can *live fully again*.",
            subtitle: "A full arch of teeth on 4 or 6 implants, precisely planned and supported from start to finish, so you can eat, talk and smile freely again.",
            facts: [["Trips", "2 trips, 5–7 days each"], ["Phase one", "Fixed temporary teeth"], ["Guarantee", "Up to 5 years [VALIDAR]"], ["Starting at", "USD 9,900 / 11,900 per arch [VALIDAR]"]],
            introTitle: "A fresh start, with *a clear plan*.",
            introText: "When you’re missing a lot of teeth or your dentures just don’t feel secure, fixed teeth on implants can change everything. We walk you through each stage up front, so you can decide calmly and know exactly what to expect.",
            fitTitle: fitTitleEn,
            fit: [["Many missing teeth", "Or teeth that can’t be saved."], ["Removable dentures", "That slip or limit what you can eat."], ["You want fixed teeth", "That feel solid and natural."], ["The full picture", "You’d like a complete plan before deciding."]],
            fitNote: "Whether you need 4 or 6 implants depends on your bone, your health and your scans. We decide together at your exam.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your photos, X-rays or CBCT and talk it through."], ["Full treatment plan", "We set the number of implants, timing and trips."], ["Trip 1 · 5–7 days", "Implants placed and fixed temporary teeth."], ["Healing at home", "We check in remotely while your bone heals."], ["Trip 2 · 5–7 days", "Your final teeth, last adjustments and care tips."]],
            expertTitle: "One clinical team for *complete care*.",
            expertText: "Your treatment is led by our restorative team, with specialists in implants and gum health. We use Neodent and Alpha-Bio Tec implant systems, depending on your case.",
            priceAmount: "From USD 9,900 (All-on-4) · USD 11,900 (All-on-6) per arch [VALIDAR]",
            priceNote: "This covers phase one with fixed temporary teeth; the final teeth are quoted separately. Your final price is confirmed after your exam.",
            faqTitle: faqEn,
            faq: [
                ["How long do I need to stay in Cancun for All-on-4?", "Treatment is usually done in two trips of 5–7 days each: one for the implants and fixed temporary teeth, and one for your final teeth."],
                ["What’s the difference between All-on-4 and All-on-6?", "It’s the number of implants holding the arch. The right choice depends on your bone, your scans and your needs, and we decide at your exam."],
                ["Will I leave my first trip with fixed teeth?", "In most cases, yes — we place fixed temporary teeth on your first trip. Your plan confirms what applies to you."],
                ["What does the starting price include?", "Phase one with fixed temporary teeth. Your final teeth are quoted separately, and you’ll get everything in writing before you book."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in All-on-4",
            seoTitle: "All-on-4 & All-on-6 in Cancun | Dental Solutions",
            seoDesc: "A full fixed arch on 4 or 6 implants over two trips to Cancun, with a written plan before you travel.",
        },
    },
    {
        id: "coronas",
        slug: { es: "coronas-dentales", en: "dental-crowns" },
        label: "Coronas dentales",
        images: ["/dsc/coronas.jpg", ""],
        videos: "7,12,15",
        es: {
            kicker: "Coronas dentales",
            title: "Coronas dentales: protección y belleza para un diente que *merece cuidado*.",
            subtitle: "Cuando una carilla no es suficiente, una corona de alta estética devuelve fuerza, forma y naturalidad al diente, con la precisión de una clínica boutique.",
            facts: [["Citas", "Según tu caso"], ["Estancia sugerida", "Se define en tu plan"], ["Material", "Cerámica de alta estética"], ["Inversión", "Plan personalizado"]],
            introTitle: "Fuerza y estética en *un mismo gesto*.",
            introText: "Una corona cubre por completo el diente para protegerlo y devolverle su forma. La diseñamos para integrarse con el resto de tu sonrisa, de modo que nadie note dónde termina el tratamiento y comienza lo natural.",
            fitTitle: fitTitleEs,
            fit: [["Dientes debilitados", "Tras endodoncias o restauraciones extensas."], ["Fracturas", "Dientes con pérdida importante de estructura."], ["Coronas antiguas", "Que ya no se ven naturales o no ajustan bien."], ["Sobre implantes", "Como parte final de un tratamiento con implantes."]],
            fitNote: "No siempre se necesita una corona. Según la estructura del diente, su vitalidad y tu mordida, también valoramos restauraciones en composite o incrustaciones. Te recomendamos la opción menos invasiva que resuelva tu caso.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos tus fotos y estudios antes de viajar."], ["Plan y diseño", "Definimos material, tono y forma contigo."], ["Preparación", "Preparamos el diente y tomamos registros precisos."], ["Laboratorio", "Tu corona se elabora con detalle artesanal."], ["Colocación", "Ajustamos mordida, color y comodidad."]],
            expertTitle: "Cerámicas de alta estética, *ajuste preciso*.",
            expertText: "Seleccionamos cerámicas de la línea Ivoclar Vivadent según la zona y la función del diente, para lograr resistencia y naturalidad.",
            priceAmount: "Plan personalizado",
            priceNote: "La inversión depende del material y de las necesidades de tu caso. Te la presentamos por escrito después de tu valoración. [VALIDAR precio de referencia con la clínica]",
            faqTitle: faqEs,
            faq: [
                ["¿Cuándo se recomienda una corona en lugar de una carilla?", "Cuando el diente ha perdido mucha estructura, está fracturado o fue tratado con endodoncia, la corona ofrece la protección que una carilla no puede dar."],
                ["¿Siempre necesito una corona si tengo un diente roto o desgastado?", "No. Cuando se conserva suficiente estructura, una restauración directa en composite o una incrustación puede ser suficiente. La decisión depende de la estructura remanente, el estado del nervio y la función de tu mordida, y se toma en tu valoración."],
                ["¿Cuántos días necesito en Cancún para una corona?", "Depende del número de coronas y del caso. Te confirmamos citas y estancia en tu plan personalizado, antes de que reserves."],
                ["¿La corona se verá natural?", "Diseñamos forma y tono para que se integre con tus dientes y revisamos el resultado contigo antes de colocarla."],
                ["¿Puedo cambiar coronas antiguas?", "Sí. Valoramos su estado y te proponemos una renovación cuando sea conveniente para tu salud y tu estética."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesan las coronas dentales",
            seoTitle: "Coronas dentales en Cancún | Dental Solutions",
            seoDesc: "Coronas de cerámica de alta estética para dientes debilitados o fracturados, con valoración virtual sin costo en Puerto Cancún.",
        },
        en: {
            kicker: "Dental crowns",
            title: "Dental crowns: strength and beauty for a tooth that *needs protecting*.",
            subtitle: "When a veneer isn’t enough, a premium porcelain crown brings back strength, shape and a natural look — with boutique-clinic precision.",
            facts: [["Visits", "Based on your case"], ["Recommended stay", "Set in your plan"], ["Material", "Premium porcelain"], ["Cost", "Custom plan"]],
            introTitle: "Strength and beauty *in one*.",
            introText: "A crown covers the whole tooth to protect it and restore its shape. We design it to blend in with the rest of your smile, so no one can tell where the dental work ends and your natural teeth begin.",
            fitTitle: fitTitleEn,
            fit: [["Weak teeth", "After a root canal or large fillings."], ["Broken teeth", "Teeth that have lost a lot of structure."], ["Old crowns", "That don’t look natural or fit well anymore."], ["On implants", "The final step of implant treatment."]],
            fitNote: "You don’t always need a crown. Depending on how much tooth is left, the nerve and your bite, a composite filling or an inlay may be enough. We’ll recommend the least invasive option that works.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your photos and records before you travel."], ["Plan and design", "We choose the material, shade and shape with you."], ["Prep", "We prepare the tooth and take precise impressions."], ["Dental lab", "Your crown is hand-crafted in detail."], ["Placement", "We fine-tune your bite, color and comfort."]],
            expertTitle: "Premium porcelain, *precise fit*.",
            expertText: "We choose Ivoclar Vivadent porcelain based on where the tooth is and what it does, for a crown that’s strong and looks natural.",
            priceAmount: "Custom plan",
            priceNote: "Your cost depends on the material and what your case needs. You’ll get it in writing after your consultation. [VALIDAR starting price with the clinic]",
            faqTitle: faqEn,
            faq: [
                ["When do you recommend a crown instead of a veneer?", "When a tooth has lost a lot of structure, is broken or has had a root canal, a crown gives it protection a veneer can’t."],
                ["Do I always need a crown for a broken or worn tooth?", "No. If enough tooth is left, a composite filling or an inlay may do the job. It depends on how much tooth remains, the nerve and your bite, and we decide at your exam."],
                ["How many days do I need in Cancun for a crown?", "It depends on how many crowns you need and your case. We confirm your visits and stay in your custom plan, before you book."],
                ["Will my crown look natural?", "We design the shape and shade to match your teeth, and you see the result before we place it."],
                ["Can I replace old crowns?", "Yes. We check them and suggest replacing them when it’s best for your health and your smile."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in dental crowns",
            seoTitle: "Dental Crowns in Cancun | Dental Solutions",
            seoDesc: "Premium porcelain crowns for weak or broken teeth, with a free virtual consultation at our clinic in Puerto Cancún.",
        },
    },
    {
        id: "protesis",
        slug: { es: "protesis-fija-y-removible", en: "dentures" },
        label: "Prótesis fija y removible",
        images: ["/dsc/protesis.jpg", ""],
        videos: "9,13,15",
        es: {
            kicker: "Prótesis fija y removible",
            title: "Prótesis dentales: comodidad, función y una sonrisa que *vuelve a ser tuya*.",
            subtitle: "Soluciones fijas o removibles diseñadas a la medida de tu boca y de tu rostro, para comer, hablar y sonreír con tranquilidad.",
            facts: [["Opciones", "Fija o removible"], ["Estancia sugerida", "Se define en tu plan"], ["Diseño", "A la medida de tu rostro"], ["Inversión", "Plan personalizado"]],
            introTitle: "Una prótesis que se siente *como parte de ti*.",
            introText: "Una buena prótesis no solo reemplaza dientes: devuelve la seguridad de compartir una comida, hablar en público o sonreír en una fotografía. La diseñamos con atención a la mordida, la estética y tu comodidad diaria.",
            fitTitle: fitTitleEs,
            fit: [["Varios dientes ausentes", "Buscas recuperar función y estética."], ["Prótesis actual incómoda", "Que se mueve, lastima o ya no te representa."], ["Opción fija o removible", "Quieres comparar alternativas con claridad."], ["Plan por etapas", "Prefieres avanzar a tu ritmo."]],
            fitNote: "En la valoración comparamos opciones fijas, removibles y sobre implantes, para elegir juntos la más adecuada para ti.",
            processTitle: processEs,
            steps: [["Valoración privada", "Revisamos tu caso y tus expectativas."], ["Plan y diseño", "Elegimos tipo de prótesis, materiales y estética."], ["Registros", "Tomamos impresiones y medidas precisas."], ["Pruebas", "Revisamos ajuste, mordida y apariencia contigo."], ["Entrega y cuidados", "Te enseñamos a cuidarla y te acompañamos a distancia."]],
            expertTitle: "Función y estética *trabajando juntas*.",
            expertText: "Cuidamos la mordida, el soporte de los labios y la naturalidad de la sonrisa, porque una prótesis debe ser tan cómoda como bella.",
            priceAmount: "Plan personalizado",
            priceNote: "La inversión depende del tipo de prótesis y de tu caso. Te la presentamos por escrito después de tu valoración. [VALIDAR precio de referencia con la clínica]",
            faqTitle: faqEs,
            faq: [
                ["¿Qué es mejor, una prótesis fija o removible?", "Depende de tus dientes, tu hueso y tus objetivos. La fija ofrece mayor estabilidad; la removible puede ser una alternativa más sencilla. Te ayudamos a decidir en la valoración."],
                ["¿Cuántos días necesito en Cancún?", "Depende del tipo de prótesis y del número de pruebas. Te confirmamos el itinerario en tu plan personalizado."],
                ["¿Puedo cambiar mi prótesis actual?", "Sí. Valoramos su estado y te proponemos una opción más cómoda y estética, incluso sobre implantes si es adecuado."],
                ["¿Cómo se cuida una prótesis?", "Te entregamos una guía de higiene y revisiones, y te acompañamos a distancia después de tu visita."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesa una prótesis dental",
            seoTitle: "Prótesis dental fija y removible en Cancún | Dental Solutions",
            seoDesc: "Prótesis fijas, removibles y sobre implantes a la medida, con valoración virtual sin costo en Puerto Cancún.",
        },
        en: {
            kicker: "Fixed and removable dentures",
            title: "Dentures: comfort, function and a smile that *feels like yours again*.",
            subtitle: "Fixed or removable options custom-made for your mouth and your face, so you can eat, talk and smile with confidence.",
            facts: [["Options", "Fixed or removable"], ["Recommended stay", "Set in your plan"], ["Design", "Made for your face"], ["Cost", "Custom plan"]],
            introTitle: "Dentures that feel like *part of you*.",
            introText: "Good dentures do more than replace teeth. They give you back the confidence to share a meal, speak in public or smile in photos. We design them around your bite, your look and your everyday comfort.",
            fitTitle: fitTitleEn,
            fit: [["Several missing teeth", "You want your bite and your smile back."], ["Uncomfortable dentures", "They slip, hurt or just don’t look like you."], ["Fixed or removable", "You want to compare your options clearly."], ["Step by step", "You’d rather go at your own pace."]],
            fitNote: "At your consultation we compare fixed, removable and implant-supported options, and choose the best fit together.",
            processTitle: processEn,
            steps: [["Private consultation", "We review your case and what you’re hoping for."], ["Plan and design", "We pick the type of denture, materials and look."], ["Impressions", "We take precise molds and measurements."], ["Try-ins", "We check the fit, bite and look with you."], ["Delivery and care", "We show you how to care for them and check in remotely."]],
            expertTitle: "Function and looks *working together*.",
            expertText: "We pay close attention to your bite, lip support and a natural-looking smile, because dentures should be as comfortable as they are beautiful.",
            priceAmount: "Custom plan",
            priceNote: "Your cost depends on the type of denture and your case. You’ll get it in writing after your consultation. [VALIDAR starting price with the clinic]",
            faqTitle: faqEn,
            faq: [
                ["Which is better, fixed or removable dentures?", "It depends on your teeth, your bone and your goals. Fixed dentures are more stable; removable ones can be a simpler option. We’ll help you decide at your consultation."],
                ["How many days do I need in Cancun?", "It depends on the type of denture and how many try-ins you need. We confirm your itinerary in your custom plan."],
                ["Can I replace my current dentures?", "Yes. We check them and suggest a more comfortable, better-looking option — even on implants, if it’s right for you."],
                ["How do I take care of dentures?", "You’ll get a cleaning and check-up guide, and we’ll check in with you remotely after your visit."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in dentures",
            seoTitle: "Fixed & Removable Dentures in Cancun | Dental Solutions",
            seoDesc: "Custom fixed, removable and implant-supported dentures, with a free virtual consultation in Puerto Cancún.",
        },
    },
    {
        id: "alineadores",
        slug: { es: "alineadores-transparentes", en: "clear-aligners" },
        label: "Alineadores transparentes",
        images: ["/dsc/paciente-05.jpg", ""],
        videos: "5,6,10",
        es: {
            kicker: "Alineadores transparentes",
            title: "Alineadores transparentes: tu sonrisa, en su lugar, *con discreción*.",
            subtitle: "Mejora progresivamente la posición de tus dientes mediante un tratamiento ortodóncico personalizado, planeado con precisión digital y acompañado por nuestro equipo.",
            facts: [["Valoración", "Clínica y digital"], ["Duración", "Según tu caso"], ["Seguimiento", "Definido en tu plan [VALIDAR]"], ["Inversión", "Plan personalizado"]],
            introTitle: "Movimiento real, *planeado con detalle*.",
            introText: "Los alineadores mueven tus dientes de forma gradual hacia la posición planeada. Antes de empezar estudiamos tu mordida, tus encías y el espacio disponible, para saber si los alineadores son tu mejor camino o si un diseño de sonrisa puede lograr lo que buscas con menos tiempo.",
            fitTitle: fitTitleEs,
            fit: [["Apiñamiento", "Dientes encimados o con poco espacio."], ["Dientes girados", "Piezas rotadas o que sobresalen."], ["Espacios", "Separaciones entre dientes por posición."], ["Antes de estética", "Preparar la sonrisa para un diseño posterior."]],
            fitNote: "No descartamos el diseño de sonrisa: en algunas desalineaciones ligeras o moderadas, una corrección estética directa o indirecta puede ser suficiente. Lo definimos en tu valoración clínica, periodontal y oclusal.",
            processTitle: processEs,
            steps: [["Valoración", "Revisamos tus fotos, tus estudios y tu mordida."], ["Escaneo digital", "Registramos tus dientes con precisión."], ["Plan de movimiento", "Te mostramos el recorrido planeado."], ["Entrega", "Recibes tus alineadores y sus indicaciones."], ["Seguimiento", "Revisamos tu avance según tu plan. [VALIDAR modalidad a distancia]"]],
            expertTitle: "Planeación digital para un *movimiento controlado*.",
            expertText: "Escaneamos tus dientes y planeamos cada etapa del movimiento en digital, para que sepas desde el inicio cómo avanzará tu tratamiento.",
            priceAmount: "Plan personalizado",
            priceNote: "La inversión depende de la complejidad y la duración de tu tratamiento. Te la presentamos por escrito después de tu valoración. [VALIDAR precio de referencia con la clínica]",
            faqTitle: faqEs,
            faq: [
                ["¿Alineadores o diseño de sonrisa?", "Depende de tu caso. Los alineadores mueven los dientes; el diseño de sonrisa mejora forma, color y proporción, y en algunas desalineaciones ligeras puede corregirlas visualmente. En tu valoración te explicamos qué opción conviene más."],
                ["¿Cuánto dura el tratamiento?", "Varía según el movimiento que necesitan tus dientes. Te damos una estimación en tu plan personalizado."],
                ["¿Necesito viajar varias veces a Cancún?", "Te confirmamos en tu plan cuántas visitas necesitas y cómo será el seguimiento. [VALIDAR con la clínica]"],
                ["¿Se notan al usarlos?", "Son transparentes y discretos. Para lograr el resultado planeado, se usan la mayor parte del día y se retiran para comer."],
            ],
            closingTitle: closingEs,
            waMsg: "Hola, me interesan los alineadores transparentes",
            seoTitle: "Alineadores transparentes en Cancún | Dental Solutions",
            seoDesc: "Ortodoncia con alineadores transparentes y planeación digital, con valoración virtual sin costo en Puerto Cancún.",
        },
        en: {
            kicker: "Clear aligners",
            title: "Clear aligners: straighter teeth, *discreetly*.",
            subtitle: "Gradually straighten your teeth with a custom orthodontic plan, mapped out digitally and supported by our team.",
            facts: [["Evaluation", "In-clinic and digital"], ["Treatment time", "Depends on your case"], ["Follow-up", "Set in your plan [VALIDAR]"], ["Cost", "Custom plan"]],
            introTitle: "Real movement, *planned in detail*.",
            introText: "Aligners move your teeth little by little into the planned position. Before we start, we check your bite, your gums and the space you have, to see whether aligners are your best route or a smile makeover can get you there faster.",
            fitTitle: fitTitleEn,
            fit: [["Crowding", "Overlapping teeth or not enough room."], ["Rotated teeth", "Teeth that are turned or stick out."], ["Gaps", "Spaces caused by tooth position."], ["Before cosmetic work", "Getting your smile ready for veneers later."]],
            fitNote: "We don’t rule out a smile makeover: for some mild to moderate crowding, veneers can be enough. We decide after checking your teeth, gums and bite.",
            processTitle: processEn,
            steps: [["Evaluation", "We review your photos, records and bite."], ["Digital scan", "We scan your teeth with precision."], ["Movement plan", "We show you how your teeth will move."], ["Your aligners", "You get your aligners and instructions."], ["Follow-up", "We track your progress according to your plan. [VALIDAR remote follow-up]"]],
            expertTitle: "Digital planning for *controlled movement*.",
            expertText: "We scan your teeth and plan every stage digitally, so you know from day one how your treatment will progress.",
            priceAmount: "Custom plan",
            priceNote: "Your cost depends on how complex and how long your treatment is. You’ll get it in writing after your consultation. [VALIDAR starting price with the clinic]",
            faqTitle: faqEn,
            faq: [
                ["Aligners or a smile makeover?", "It depends on your case. Aligners move your teeth; a smile makeover improves shape, color and proportion, and can visually fix some mild crowding. We’ll explain which makes more sense at your consultation."],
                ["How long does treatment take?", "It depends on how much your teeth need to move. You’ll get an estimate in your custom plan."],
                ["Do I need to fly to Cancun more than once?", "Your plan spells out how many visits you need and how follow-up works. [VALIDAR with the clinic]"],
                ["Can people tell I’m wearing them?", "They’re clear and discreet. For the best results, you wear them most of the day and take them out to eat."],
            ],
            closingTitle: closingEn,
            waMsg: "Hi, I'm interested in clear aligners",
            seoTitle: "Clear Aligners in Cancun | Dental Solutions",
            seoDesc: "Clear aligner orthodontics with digital planning and a free virtual consultation in Puerto Cancún.",
        },
    },
];

/** Converts a landing into the CMS shape (shared + es + en). */
function toValues(c: LandingCopy): PageValues {
    const v: PageValues = {
        hero: { kicker: c.kicker, title: c.title, subtitle: c.subtitle },
        facts: {},
        intro: { title: c.introTitle, text: c.introText },
        fit: { title: c.fitTitle, note: c.fitNote },
        process: { title: c.processTitle },
        expert: { title: c.expertTitle, text: c.expertText },
        price: { amount: c.priceAmount, note: c.priceNote },
        faq: { title: c.faqTitle },
        closing: { title: c.closingTitle, waMsg: c.waMsg },
        seo: { title: c.seoTitle, description: c.seoDesc },
    };
    c.facts.forEach(([l, x], i) => Object.assign(v.facts, { [`k${i + 1}_label`]: l, [`k${i + 1}_value`]: x }));
    c.fit.forEach(([t, x], i) => Object.assign(v.fit, { [`f${i + 1}_title`]: t, [`f${i + 1}_text`]: x }));
    c.steps.forEach(([t, x], i) => Object.assign(v.process, { [`s${i + 1}_title`]: t, [`s${i + 1}_text`]: x }));
    c.faq.forEach(([q, a], i) => Object.assign(v.faq, { [`q${i + 1}_q`]: q, [`q${i + 1}_a`]: a }));
    return v;
}

export const LANDING_DEFAULTS: Record<string, PageDoc> = Object.fromEntries(
    LANDINGS.map((l) => [
        `tratamiento-${l.id}`,
        { shared: { media: { img1: l.images[0], img2: l.images[1] }, stories: { videos: l.videos } }, es: toValues(l.es), en: toValues(l.en) },
    ])
);
