import nodemailer from "nodemailer";
import mustache from "mustache";
import fs from "fs/promises";
import path from "path";

export async function sendEmail({ to, subject, templateName, variables }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const templatePath = path.join("templates", `${templateName}.mustache`);
  const templateContent = await fs.readFile(templatePath, "utf-8");
  const html = mustache.render(templateContent, variables);

  const info = await transporter.sendMail({
    from: `"Sistema" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  transporter.verify((error, success) => {
  if (error) {
    console.error("Erro ao conectar com o SMTP do Gmail:", error);
  } else {
    console.log("Conexão SMTP com Gmail realizada com sucesso!");
  }
});

await transporter.sendMail({
  from: `"Sistema de Teste" <${process.env.EMAIL_USER}>`,
  to: "peyili4041@iridales.com",
  subject: "Teste com Gmail e senha de app",
  text: "Este é um e-mail de teste enviado via Nodemailer com senha de app do Gmail.",
});

  return info;

  
}
