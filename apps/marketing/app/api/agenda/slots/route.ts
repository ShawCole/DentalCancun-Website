import { NextRequest, NextResponse } from "next/server";
import { getSlots } from "@/lib/agenda/slots";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const tipo = req.nextUrl.searchParams.get("tipo") === "clinica" ? "clinica" : "virtual";
    const data = await getSlots(tipo);
    return NextResponse.json({ ok: !data.error, tz: "America/Cancun", ...data }, { headers: { "Cache-Control": "no-store" } });
}
