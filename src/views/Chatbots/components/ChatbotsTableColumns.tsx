"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  FileText,
  Bot,
  MessageSquare,
  Sparkles,
  Zap,
  Brain
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export type Chatbot = {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  model: string
  conversations: number
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Play className="h-3 w-3" />
    case "paused":
      return <Pause className="h-3 w-3" />
    case "draft":
      return <FileText className="h-3 w-3" />
    default:
      return null
  }
}

const getModelIcon = (model: string) => {
  if (model.includes("GPT-4")) return <Sparkles className="h-4 w-4" />
  if (model.includes("Claude")) return <Brain className="h-4 w-4" />
  if (model.includes("GPT-3.5")) return <Zap className="h-4 w-4" />
  return <Bot className="h-4 w-4" />
}

export const getColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (chatbot: Chatbot) => void
  onDelete: (chatbot: Chatbot) => void
}): ColumnDef<Chatbot>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant =
        status === "active"
          ? "default"
          : status === "paused"
          ? "secondary"
          : "outline"
      return (
        <Badge variant={variant} className="flex items-center gap-1.5 capitalize">
          {getStatusIcon(status)}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-auto p-0 font-semibold"
        >
          <Bot className="mr-2 h-4 w-4" />
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const chatbot = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{chatbot.name}</div>
            <div className="text-sm text-muted-foreground">ID: {chatbot.id}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => {
      const model = row.getValue("model") as string
      return (
        <div className="flex items-center gap-2">
          {getModelIcon(model)}
          <span className="font-medium">{model}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "conversations",
    header: "Conversations",
    cell: ({ row }) => {
      const conversations = row.getValue("conversations") as number
      return (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{conversations.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const chatbot = row.original

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(chatbot)}
            className="h-8 w-8 p-0 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(chatbot)}
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )
    },
  },
] 