import { Badge } from "@/components/ui/badge"

interface TodoStatsProps {
  total: number
  completed: number
  pending: number
}

export function LandingTodoStats({ total, completed, pending }: TodoStatsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Badge variant="secondary">
        Total: {total}
      </Badge>
      <Badge variant="default">
        Completadas: {completed}
      </Badge>
      <Badge variant="outline">
        Pendientes: {pending}
      </Badge>
    </div>
  )
}