"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button"
import { BanknoteIcon, CalendarCheck, ChevronLeft, ChevronRight, Folder, List, Settings } from "lucide-react"
import { SidbarLinks } from "./sidebarlinks"

export function SidebarDashboard({children}: { children: React.ReactNode} ){

  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full">

      <aside className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
        "w-20": isCollapsed,
        "w-64": !isCollapsed,
        "hidden md:flex md:fixed": true
      })}>
        <div className="mb-6 mt-4">
          {!isCollapsed && (
            <span className="text-3xl font-bold text-zinc-800 tracking-tight">Viva<span className="text-emerald-500">Bem</span> </span>
          )}
        </div>

        <Button 
          className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end "
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className="w-12 h-12 "/> : <ChevronRight className="w-12 h-12 "/>}
        </Button>

        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            <SidbarLinks
                href="/dashboard"
                icon={<CalendarCheck className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Agendamento"
              />

              <SidbarLinks
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Serviços"
              />

              <SidbarLinks
                href="/dashboard/perfil"
                icon={<Settings className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Perfil"
              />
              <SidbarLinks
                href="/dashboard/plans"
                icon={<BanknoteIcon className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Planos"
              />
          </nav>
        )}
        
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-400 font-medium uppercase">
                Painel
              </span>

            
              <SidbarLinks
                href="/dashboard"
                icon={<CalendarCheck className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Agendamento"
              />

              <SidbarLinks
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Serviços"
              />

              <span className="text-sm text-gray-400 font-medium uppercase">
                Configurações
              </span>

              <SidbarLinks
                href="/dashboard/perfil"
                icon={<Settings className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Perfil"
              />
              <SidbarLinks
                href="/dashboard/plans"
                icon={<BanknoteIcon className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Planos"
              />

          </nav>    
          </CollapsibleContent>
        
        </Collapsible>
      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>

      <header className="md:hidden flex items-center justify-between border-b px-4 
      md:px-6 h-14 z-10 sticky top-0 bg-white">
        <Sheet >
          <div className="flex items-center gap-4">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsCollapsed(false)}>
                <List className="w-5 h-5"/>
              </Button>
            </SheetTrigger>

            <h1 className="text-base md:text-lg font-semibold">Menu VivaBem</h1>
          </div>

          <SheetContent side="right" className="sm:max-w-xs text-black">
            <SheetHeader>
              <SheetTitle>
                VivaBem
              </SheetTitle>
              <SheetDescription>
                Menu Admininstrativo
              </SheetDescription>
            </SheetHeader>

            <nav className="grid gap-2 text-base pt-5">
              <SidbarLinks
                href="/dashboard"
                icon={<CalendarCheck className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Agendamento"
              />

              <SidbarLinks
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Serviços"
              />
              <SidbarLinks
                href="/dashboard/perfil"
                icon={<Settings className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Perfil"
              />
              <SidbarLinks
                href="/dashboard/plans"
                icon={<BanknoteIcon className="w-6 h-6"/>}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Planos"
              />
            </nav>
          </SheetContent>
        </Sheet>

      </header>

      <main className="flex-1 py-4 px-2 md:p-6">
        {children}
      </main>

      </div>

      
    </div>
  )
}