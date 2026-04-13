import { NextResponse } from "next/server";
import { registerUser } from "@/app/(public)/register/_actions/register";
export async function POST(req) {
    try {
        const body = await req.json();
        const user = await registerUser(body);
        return NextResponse.json({ success: true, user });
    }
    catch (error) {
        return NextResponse.json({ error: error.message || "Erro ao cadastrar" }, { status: 400 });
    }
}
