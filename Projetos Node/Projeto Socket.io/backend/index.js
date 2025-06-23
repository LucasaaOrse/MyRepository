const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ou "http://localhost:3000" se quiser restringir
    methods: ["GET", "POST"]
  }
});

// Quando um cliente se conecta
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("mensagem", (data) => {
    console.log("Mensagem recebida:", data);

    // reenviar a todos os clientes (broadcast)
    io.emit("mensagem", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Servidor rodando em http://0.0.0.0:3001");
});
