import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/register/verify/error`)
    }

    const verificationRecord = await prisma.verificationToken.findFirst({
      where: { token },
    })

    if (!verificationRecord) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/register/verify/expired`)
    }

    if (verificationRecord.expires < new Date()) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: verificationRecord.identifier },
      })
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/register/verify/expired`)
    }

    // ✅ Atualiza emailVerified corretamente
    await prisma.user.update({
      where: { email: verificationRecord.identifier },
      data: { emailVerified: new Date() },
    })

    // ✅ Deleta o token sem usar chave composta
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: verificationRecord.identifier,
        token: verificationRecord.token,
      },
    })

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/register/verify/success`)
  } catch (error) {
    console.error("Erro ao confirmar e-mail:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/register/verify/error`)
  }
}
