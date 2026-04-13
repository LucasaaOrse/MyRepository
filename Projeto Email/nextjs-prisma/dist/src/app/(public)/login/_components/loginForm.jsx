"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleCredentialsLogin = async () => {
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/dashboard",
        });
        if ((res === null || res === void 0 ? void 0 : res.ok) && res.url) {
            router.push("/dashboard"); // <- aqui redireciona para o callbackUrl real
        }
        else {
            setError("Credenciais inválidas.");
        }
        setLoading(false);
    };
    const handleGoogleLogin = async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/" });
    };
    return (<div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleCredentialsLogin} disabled={loading}>
        Entrar com Email e Senha
      </Button>

      <div className="border-t pt-4 mt-2 text-center text-sm text-muted-foreground">
        ou continue com
      </div>

      <Button variant="outline" onClick={handleGoogleLogin} disabled={loading}>
        <FcGoogle className="mr-2 h-5 w-5"/>
        Entrar com Google
      </Button>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-primary underline">
          Criar conta
        </Link>
      </p>
    </div>);
}
