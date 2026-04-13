// src/app/(private)/dashboard/_components/CopyToClipboardButton.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
export function CopyToClipboardButton({ value }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (<motion.div whileTap={{ scale: 0.95 }} className="transition-transform duration-200">
      <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar chave">
        {copied ? <Check className="text-green-500 w-4 h-4"/> : <Copy className="w-4 h-4"/>}
      </Button>
    </motion.div>);
}
