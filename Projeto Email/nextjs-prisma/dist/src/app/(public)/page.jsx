import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, KeyRound } from "lucide-react";
import Link from "next/link";
export default function Home() {
    return (<main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <Mail className="w-8 h-8 text-primary"/>
        Email100
      </h1>

      <p className="mt-4 text-muted-foreground text-center max-w-md">
        A forma mais simples e segura de enviar e-mails transacionais usando nossa API poderosa e flexível.
      </p>

      <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary"/>
              Envio Simples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integre nossa API em minutos e comece a enviar e-mails com templates personalizados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="text-primary"/>
              Segurança por API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cada cliente possui sua própria chave de autenticação. Segurança e rastreabilidade garantidas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="text-primary"/>
              Fila Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O sistema de filas garante desempenho, confiabilidade e tolerância a falhas nos envios.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Link href="/login">
          <Button size="lg">
            Comece Agora
          </Button>
        </Link>
      </div>
    </main>);
}
