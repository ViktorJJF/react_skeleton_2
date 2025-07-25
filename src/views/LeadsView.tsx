import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { Lead } from "@/types/lead"
import { MoreHorizontal, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"

const leads: Lead[] = [
    {
        id: "1",
        name: "Leslie Alexander",
        email: "leslie.alexander@example.com",
        phone: "958991764",
        country: "CL",
        status: "new",
        channel: "Chatbot web",
        initialQuestion: "El usuario Leslier Olave compró un calefón con boleta 3047...",
        createdAt: "2023-10-26",
    },
    {
        id: "2",
        name: "Michael Foster",
        email: "michael.foster@example.com",
        phone: "51935228405",
        country: "PE",
        status: "contacted",
        channel: "Chatbot WhatsApp",
        initialQuestion: "Quiero saber el nombre completo de una persona, solo son...",
        createdAt: "2023-10-25",
    },
];

const LeadsView = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline">Conectado</Button>
            <Button variant="outline">Previsualizar</Button>
            <Button>Chat</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar por Tags
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Tag 1</DropdownMenuItem>
              <DropdownMenuItem>Tag 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar correo, nc" className="pl-8" />
          </div>
          <Button variant="outline">Enviar plantilla</Button>
        </div>

        <div className="flex-1 overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[40px]">
                        <Checkbox />
                    </TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Pregunta inicial</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                    <TableRow key={lead.id}>
                        <TableCell>
                        <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium">{lead.email}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span>{lead.phone}</span>
                                <img src={`https://flagsapi.com/${lead.country}/flat/16.png`} alt={lead.country} />
                            </div>
                        </TableCell>
                        <TableCell>{lead.initialQuestion}</TableCell>
                        <TableCell>{lead.channel}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                19682 leads en total. 15 leads por página
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input type="number" defaultValue={1} className="w-16 text-center" />
                <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                    de 1313
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LeadsView; 