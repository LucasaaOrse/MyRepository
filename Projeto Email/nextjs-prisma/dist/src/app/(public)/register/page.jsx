// app/(auth)/register/page.tsx
import { RegisterForm } from "./_components/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function RegisterPage() {
    return (<main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Criar conta no Email100</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>);
}
