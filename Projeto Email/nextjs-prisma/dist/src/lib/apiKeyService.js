import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
export async function getApiKeyForUser(userId) {
    return await prisma.apiKey.findFirst({
        where: { userId },
    });
}
export async function generateApiKey(userId) {
    const key = randomUUID().replace(/-/g, "");
    // Verifica se já existe uma chave para esse usuário
    const existingKey = await prisma.apiKey.findFirst({
        where: { userId },
    });
    if (existingKey) {
        return await prisma.apiKey.update({
            where: { id: existingKey.id },
            data: { key },
        });
    }
    // Se não existe, cria uma nova
    return await prisma.apiKey.create({
        data: {
            key,
            userId,
            name: "Chave padrão", // ou qualquer outro nome
        },
    });
}
