// app/(auth)/login/page.tsx
import { LoginForm } from "./_components/loginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function LoginPage() {
    return (<main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Entrar no Email100</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>);
}
