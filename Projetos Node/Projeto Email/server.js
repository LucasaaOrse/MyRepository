import express from "express";
import dotenv from "dotenv";
import { authMiddleware } from "./authMiddleware.js";
import { sendEmail } from "./mailer.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/send-email", authMiddleware, async (req, res) => {
  const { to, subject, template, variables } = req.body;

  try {
    const result = await sendEmail({ to, subject, templateName: template, variables });
    res.status(200).json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao enviar e-mail" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
