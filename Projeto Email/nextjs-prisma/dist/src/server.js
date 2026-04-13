import express from "express";
import dotenv from "dotenv";
import { authMiddleware } from "./utils/authMiddleware.js";
import { emailQueue } from "./utils/emailQueue.js";
dotenv.config();
const app = express();
app.use(express.json());
app.post("/send-email", authMiddleware, async (req, res) => {
    const { to, subject, templateName, variables } = req.body;
    try {
        await emailQueue.add("sendEmail", {
            to,
            subject,
            templateName,
            variables,
        });
        res.status(200).json({ success: true, message: "Email enfileirado com sucesso" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao adicionar email à fila" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
