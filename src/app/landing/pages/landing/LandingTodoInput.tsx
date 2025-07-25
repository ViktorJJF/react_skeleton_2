import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TodoInputProps {
  onAdd: (title: string) => void
}

export function LandingTodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Añadir una nueva tarea..."
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  )
}