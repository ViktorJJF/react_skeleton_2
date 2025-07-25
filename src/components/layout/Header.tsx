import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Todo App</h1>
      <ThemeToggle />
    </header>
  )
} 