import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiKeyForUser } from "@/lib/apiKeyService";
import { GenerateApiKeyButton } from "./_components/GenerateApiKeyButton";
import { CopyToClipboardButton } from "./_components/CopyToClipboardButton";
export default async function DashboardPage() {
    var _a;
    const session = await auth();
    if (!(session === null || session === void 0 ? void 0 : session.user)) {
        return redirect("/login");
    }
    const apiKey = await getApiKeyForUser(session.user.id);
    return (<main className="min-h-screen bg-background py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold text-center">Bem-vindo, {(_a = session.user.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0]}</h1>
        <p className="text-muted-foreground text-center">
          Aqui você pode gerenciar sua chave de API para enviar e-mails com segurança.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Chave de API</CardTitle>
          </CardHeader>
          <CardContent>
            {apiKey ? (<div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg border text-sm flex justify-between items-center">
                  <span className="break-all">{apiKey.key}</span>
                  <div className="flex gap-2">
                    <CopyToClipboardButton value={apiKey.key}/>
                   <div className="text-center">
                    <GenerateApiKeyButton />
                  </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Essa chave será usada para autenticar chamadas à API de envio de e-mails.
                </p>
              </div>) : (<div className="text-center">
              <GenerateApiKeyButton />
            </div>)}
          </CardContent>
        </Card>
      </div>
    </main>);
}
