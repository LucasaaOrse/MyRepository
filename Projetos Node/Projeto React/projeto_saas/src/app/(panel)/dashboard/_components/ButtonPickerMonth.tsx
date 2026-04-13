"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"

export function ButtonPickerMonth({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="month"
      className="border p-1 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
