// src/app/api/dashboard/generate/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateApiKey } from "@/lib/apiKeyService";
export async function POST() {
    var _a;
    const session = await auth();
    if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
        await generateApiKey(session.user.id);
        return new NextResponse(null, { status: 200 });
    }
    catch (err) {
        console.error("Erro ao gerar API key:", err);
        return new NextResponse("Erro ao gerar chave de API", { status: 500 });
    }
}
