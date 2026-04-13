'use server';
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
export async function registerUser(data) {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error("Dados inválidos");
    }
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("Email já está em uso.");
    }
    const hashedPassword = await hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            emailVerified: new Date(),
        },
    });
    return user;
}
