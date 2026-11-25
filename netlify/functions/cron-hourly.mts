// Netlify scheduled function: appointment reminders, every hour.
export default async () => {
    const url = process.env.URL;
    if (!url || !process.env.CRON_SECRET) return new Response("not configured", { status: 200 });
    const r = await fetch(`${url}/api/cron/hourly`, { method: "POST", headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } });
    return new Response(await r.text(), { status: 200 });
};
export const config = { schedule: "@hourly" };
