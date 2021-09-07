import React, { FormEvent, useState } from "react"
import { PlusCircle } from "./icons/PlusCircle"

interface TodoNewProps {
  createTodo: (todo: string) => void
}

export function TodoNew({ createTodo }: TodoNewProps) {
  const [todo, setTodo] = useState("")
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTodo(todo)
    setTodo("")
  }
  return (
    <form onSubmit={onSubmit} className="relative">
      <span className="absolute top-5 right-3">
        <PlusCircle />
      </span>
      <input
        type="text"
        placeholder="Add new task"
        value={todo}
        className="bg-blue-50 p-3 rounded-full mt-2 w-full"
        onChange={(e) => setTodo(e.target.value)}
      />
    </form>
  )
}
