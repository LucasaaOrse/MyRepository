import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendEmail } from "./mailer";
const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});
const worker = new Worker("emailQueue", async (job) => {
    const { to, subject, templateName, variables } = job.data;
    await sendEmail({ to, subject, templateName, variables });
    console.log(`✅ Email enviado para ${to}`);
}, { connection });
worker.on("failed", (job, err) => {
    if (job) {
        console.error(`❌ Falha no envio para ${job.data.to}:`, err);
    }
    else {
        console.error("❌ Falha no envio: job indefinido", err);
    }
});
