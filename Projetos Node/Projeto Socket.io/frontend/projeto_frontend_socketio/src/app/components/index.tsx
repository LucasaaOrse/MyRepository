"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import EmojiPicker, { Theme } from "emoji-picker-react";

interface Mensagem {
  nome: string;
  texto: string;
  tipo?: "sistema" | "usuario";
  timestamp: string;
}

const socket: Socket = io("http://10.0.18.70:3001");

function gerarCorPorNome(nome: string) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 70%)`;
}

export default function Chat() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [nomeDefinido, setNomeDefinido] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [quemEstaDigitando, setQuemEstaDigitando] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mostrarBotaoScroll, setMostrarBotaoScroll] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("chat-username");
    if (nomeSalvo) {
      setNome(nomeSalvo);
      setNomeDefinido(true);
      socket.emit("entrou", nomeSalvo);
    }

    socket.on("users_count", (count: number) => setOnlineCount(count));
    
    socket.on("user_typing", (data: { nome: string; isTyping: boolean }) => {
      setQuemEstaDigitando(data.isTyping ? data.nome : null);
    });

    socket.on("mensagem", (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("users_count");
      socket.off("user_typing");
      socket.off("mensagem");
    };
  }, []);

  // Monitorar scroll para mostrar botão "Ir para o fim"
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setMostrarBotaoScroll(!isBottom);
    }
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (!mostrarBotaoScroll) scrollToBottom();
  }, [mensagens]);

  const handleTyping = (val: string) => {
    setMensagem(val);
    socket.emit("typing", { nome, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { nome, isTyping: false });
    }, 2000);
  };

  const enviar = () => {
    if (!mensagem.trim()) return;
    const novaMsg: Mensagem = {
      nome,
      texto: mensagem,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit("mensagem", novaMsg);
    socket.emit("typing", { nome, isTyping: false });
    setMensagem("");
    setShowEmojiPicker(false);
  };

  if (!nomeDefinido) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center">Entrar no Chat</h2>
          <input
            className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-xl w-full mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Seu apelido..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (localStorage.setItem("chat-username", nome), setNomeDefinido(true), socket.emit("entrou", nome))}
          />
          <button 
            onClick={() => { localStorage.setItem("chat-username", nome); setNomeDefinido(true); socket.emit("entrou", nome); }}
            className="w-full bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shadow-lg z-10">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Chat Global
          </h2>
          <p className="text-xs text-slate-400">{onlineCount} usuários conectados</p>
        </div>
        <span className="text-xs opacity-50">@{nome}</span>
      </header>

      {/* Área de Mensagens */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
      >
        {mensagens.map((msg, i) => {
          const ehMeu = msg.nome === nome;
          if (msg.tipo === "sistema") {
            return <div key={i} className="text-center text-[10px] text-slate-500 uppercase tracking-widest my-4">{msg.texto}</div>;
          }
          return (
            <div key={i} className={`flex ${ehMeu ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-xl ${ehMeu ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-100 rounded-tl-none"}`}>
                {!ehMeu && <span className="text-[10px] font-black block mb-1 opacity-80" style={{ color: gerarCorPorNome(msg.nome) }}>{msg.nome}</span>}
                <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                <span className="text-[9px] block mt-1 text-right opacity-40">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
        
        {/* Botão Flutuante Scroll */}
        {mostrarBotaoScroll && (
          <button 
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 bg-blue-600 p-2 rounded-full shadow-2xl animate-bounce hover:bg-blue-500 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
          </button>
        )}
      </div>

      {/* Rodapé e Inputs */}
      <footer className="p-4 bg-slate-900 border-t border-slate-800 relative">
        {quemEstaDigitando && (
          <div className="absolute -top-6 left-4 text-[10px] text-blue-400 italic animate-pulse">
            {quemEstaDigitando} está digitando...
          </div>
        )}
        
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="relative flex-1 flex items-center bg-slate-800 rounded-xl border border-slate-700">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 opacity-60 hover:opacity-100 transition-opacity"
            >
              😊
            </button>
            <textarea
              className="flex-1 bg-transparent border-none py-3 px-2 focus:ring-0 outline-none resize-none text-sm max-h-32"
              rows={1}
              value={mensagem}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), enviar())}
              placeholder="Mensagem..."
            />
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 shadow-2xl">
                <EmojiPicker 
                  theme={Theme.DARK} 
                  onEmojiClick={(emoji) => setMensagem(prev => prev + emoji.emoji)}
                  lazyLoadEmojis
                />
              </div>
            )}
          </div>
          <button onClick={enviar} className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl transition-all active:scale-90">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}