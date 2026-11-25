// Netlify scheduled function: daily backup of the site content (6:00 a.m. Cancún = 11:00 UTC).
export default async () => {
    const url = process.env.URL;
    if (!url || !process.env.CRON_SECRET) return new Response("not configured", { status: 200 });
    const r = await fetch(`${url}/api/cron/daily`, { method: "POST", headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } });
    return new Response(await r.text(), { status: 200 });
};
export const config = { schedule: "0 11 * * *" };
