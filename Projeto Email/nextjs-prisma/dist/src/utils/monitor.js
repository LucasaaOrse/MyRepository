import express from "express";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { emailQueue } from "./emailQueue";
const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
    queues: [new BullMQAdapter(emailQueue)],
    serverAdapter,
});
app.use("/admin/queues", serverAdapter.getRouter());
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`📊 Bull Board rodando em http://localhost:${PORT}/admin/queues`);
});
