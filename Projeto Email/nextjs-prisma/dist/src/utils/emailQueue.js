import { Queue } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
});
export const emailQueue = new Queue("emailQueue", { connection });
