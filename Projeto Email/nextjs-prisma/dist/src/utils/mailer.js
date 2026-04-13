import nodemailer from "nodemailer";
import mustache from "mustache";
import fs from "fs/promises";
import path from "path";
export async function sendEmail({ to, subject, templateName, variables }) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const templatePath = path.resolve("templates", `${templateName}.mustache`);
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const html = mustache.render(templateContent, variables);
    const info = await transporter.sendMail({
        from: `"Sistema" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    return info;
}
