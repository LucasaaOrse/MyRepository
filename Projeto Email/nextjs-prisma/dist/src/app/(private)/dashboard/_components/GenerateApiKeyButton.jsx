// src/app/(private)/dashboard/_components/GenerateApiKeyButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
export function GenerateApiKeyButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const handleGenerate = async () => {
        const res = await fetch("/api/dashboard/generate", { method: "POST" });
        if (res.ok) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            startTransition(() => router.refresh());
        }
        else {
            alert("Erro ao gerar chave");
        }
    };
    return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Button size="lg" onClick={handleGenerate} disabled={isPending} className="flex gap-2 items-center">
        {isPending ? (<>
            <Loader2 className="animate-spin w-5 h-5"/>
            Gerando...
          </>) : success ? (<>
            ✅ Chave criada!
          </>) : (<>
            <KeyRound className="w-4 h-4"/>
            Gerar nova chave de API
          </>)}
      </Button>
    </motion.div>);
}
