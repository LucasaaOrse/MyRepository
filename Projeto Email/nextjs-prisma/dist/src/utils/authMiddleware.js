import prisma from "./../lib/prisma.js";
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Chave de API ausente" });
        return;
    }
    const apiKey = authHeader.split(" ")[1];
    try {
        const key = await prisma.apiKey.findUnique({
            where: { key: apiKey },
        });
        if (!key) {
            res.status(403).json({ error: "Chave de API inválida" });
            return;
        }
        // Anexar à requisição (se quiser tipar corretamente, veja abaixo)
        req.apiUserId = key.userId;
        next();
    }
    catch (error) {
        console.error("Erro ao validar chave de API:", error);
        res.status(500).json({ error: "Erro interno na autenticação" });
    }
}
