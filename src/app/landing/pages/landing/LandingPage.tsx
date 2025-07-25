import { useState } from "react"
import type { Todo } from "@/types/todo"
import { LandingTodoInput } from "@/app/landing/pages/landing/LandingTodoInput"
import { LandingTodoItem } from "@/app/landing/pages/landing/LandingTodoItem"
import { LandingTodoStats } from "@/app/landing/pages/landing/LandingTodoStats"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"

export function LandingPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Configurar proyecto con Shadcn UI",
      completed: true,
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Crear componente de Todo",
      completed: false,
      createdAt: new Date()
    }
  ])

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date()
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, newTitle: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, title: newTitle } : todo
    ))
  }

  const completedCount = todos.filter(t => t.completed).length
  const pendingCount = todos.length - completedCount

  return (
    <div className="max-w-2xl mx-auto p-4 relative">
      <div className="absolute top-0 left-0 w-full h-48 bg-primary/20 rounded-t-lg -z-10" />
      <Card className="p-6">
        <Header />
        <main className="mt-6">
          <LandingTodoStats 
            total={todos.length}
            completed={completedCount}
            pending={pendingCount}
          />
          
          <LandingTodoInput onAdd={addTodo} />
          
          <div className="mt-4 space-y-2">
            {todos.map(todo => (
              <LandingTodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                completed={todo.completed}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </div>

          {todos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay tareas pendientes</p>
              <p className="text-sm">¡Añade tu primera tarea!</p>
            </div>
          )}
        </main>
      </Card>
    </div>
  )
}