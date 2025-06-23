"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://10.0.20.116:3001"); // IP do backend

interface Mensagem {
  nome: string;
  texto: string;
  eu: boolean;
}

function gerarCorPorNome(nome: string) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  const cor = `hsl(${hash % 180}, 50%, 60%)`; // Ajustado para tons mais suaves e menos saturados
  return cor;
}

export default function Chat() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [nomeDefinido, setNomeDefinido] = useState(false);

  useEffect(() => {
    socket.on("mensagem", (msg: { nome: string; texto: string }) => {
      setMensagens((prev) => [
        ...prev,
        { ...msg, eu: msg.nome === nome },
      ]);
    });

    return () => {
      socket.off("mensagem");
    };
  }, [nome]);

  const enviar = () => {
    if (!mensagem.trim()) return;
    socket.emit("mensagem", { nome, texto: mensagem });
    setMensagem("");
  };

  if (!nomeDefinido) {
    return (
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">Digite seu nome para entrar</h2>
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button
          onClick={() => setNomeDefinido(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      <div className="h-96 overflow-y-auto bg-gray-100 p-4 rounded shadow mb-4 space-y-2">
      {mensagens.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-lg mb-2 text-white ${
              msg.nome === nome
                ? "bg-blue-800 self-end ml-auto"    // balão do próprio usuário
                : "bg-gray-700 self-start mr-auto"  // balão dos outros
            }`}
            style={{ whiteSpace: "pre-wrap" }} // permite quebra de linha
          >
            <span
              className="font-semibold block mb-1"
              style={{
                color: gerarCorPorNome(msg.nome), // Cor do nome do usuário
                padding: "2px 6px",
                borderRadius: "4px",
                display: "inline-block",
                fontSize: "0.875rem",
              }}
            >
              {msg.nome}
            </span>
            <p>{msg.texto}</p>
          </div>
        ))}

      </div>

      <div className="flex gap-2">
      <textarea
          className="w-full border px-2 py-1 rounded resize-none"
          rows={3}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // impede quebra de linha
              enviar(); // chama a função de envio
            }
          }}
          placeholder="Digite sua mensagem... (Shift + Enter para nova linha)"
        />
        <button
          onClick={enviar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
