"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleRegister = async () => {
        setError("");
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
            router.push("/login");
        }
        else {
            const data = await res.json();
            setError(data.error || "Erro ao cadastrar");
        }
    };
    return (<div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleRegister}>Cadastrar</Button>

      <p className="text-sm text-muted-foreground text-center mt-2">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary underline">
          Entrar
        </Link>
      </p>
    </div>);
}
