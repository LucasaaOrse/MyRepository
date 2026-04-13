import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendEmailViaService } from "@/lib/send-email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = uuidv4();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm-email?token=${token}`;

    await sendEmailViaService({
      to: email,
      subject: "Confirme seu e-mail",
      template: "verify-email",
      variables: {
        nome: name,
        link: verificationLink,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro no registro:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
