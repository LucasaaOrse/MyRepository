const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let usuariosOnline = 0;

io.on("connection", (socket) => {

  usuariosOnline++;
  io.emit("users_count", usuariosOnline);

  socket.on("typing", (data) => {
    socket.broadcast.emit("user_typing", data); // Envia para todos, exceto quem está digitando
  });

  // Notifica quando alguém entra
  socket.on("entrou", (nome) => {
    socket.data.nome = nome; // Salva o nome no objeto do socket
    io.emit("mensagem", {
      nome: "Sistema",
      texto: `${nome} entrou no chat`,
      tipo: "sistema",
      timestamp: ""
    });
  });

  

  socket.on("mensagem", (data) => {
    io.emit("mensagem", data);
  });

  socket.on("disconnect", () => {
    usuariosOnline--;
    io.emit("users_count", usuariosOnline);
    if (socket.data.nome) {
      io.emit("mensagem", {
        nome: "Sistema",
        texto: `${socket.data.nome} saiu do chat`,
        tipo: "sistema",
        timestamp: ""
      });
    }
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Servidor rodando em http://0.0.18.70:3001");
});