import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 h-full">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('leads.title')}</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline">{t('leads.connected')}</Button>
            <Button variant="outline">{t('leads.preview')}</Button>
            <Button>{t('leads.chat')}</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t('leads.filterByTags')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>{t('leads.tag1')}</DropdownMenuItem>
              <DropdownMenuItem>{t('leads.tag2')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('leads.searchPlaceholder')} className="pl-8" />
          </div>
          <Button variant="outline">{t('leads.sendTemplate')}</Button>
        </div>

        <div className="flex-1 overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[40px]">
                        <Checkbox />
                    </TableHead>
                    <TableHead>{t('common.email')}</TableHead>
                    <TableHead>{t('leads.phone')}</TableHead>
                    <TableHead>{t('leads.initialQuestion')}</TableHead>
                    <TableHead>{t('leads.channel')}</TableHead>
                    <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
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
                        <TableCell className="max-w-xs truncate">{lead.initialQuestion}</TableCell>
                        <TableCell>{lead.channel}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">{t('common.openMenu')}</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                                    <DropdownMenuItem>{t('leads.viewDetails')}</DropdownMenuItem>
                                    <DropdownMenuItem>{t('leads.sendMessage')}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {t('leads.showingResults', { count: leads.length })}
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous')}
                </Button>
                <Button variant="outline" size="sm">
                    {t('common.next')}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsView; 