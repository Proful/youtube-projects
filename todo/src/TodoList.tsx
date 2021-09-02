import React, { FormEvent, useEffect, useState } from "react"

type Todo = {
  id: number
  text: string
  isCompleted: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    let initialValue: Todo[] = []
    const todoList = window.localStorage.getItem("todos")
    if (todoList && todoList.length > 0) {
      initialValue = JSON.parse(todoList)
    }
    return initialValue
  })

  const handleCreateTodo = (todo: string) => {
    const oldTodos = [...todos]
    oldTodos.push({
      id: todos.length + 1,
      text: todo,
      isCompleted: false,
    })
    setTodos(oldTodos)
    window.localStorage.setItem("todos", JSON.stringify(oldTodos))
  }

  return (
    <div>
      <TodoNew createTodo={handleCreateTodo} />
      <div>
        {todos.map((it) => (
          <TodoItem key={it.id} item={it} />
        ))}
      </div>
    </div>
  )
}
interface TodoNewProps {
  createTodo: (todo: string) => void
}
function TodoNew({ createTodo }: TodoNewProps) {
  const [todo, setTodo] = useState("")
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTodo(todo)
    setTodo("")
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Add new task"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
    </form>
  )
}

function TodoItem({ item }: { item: Todo }) {
  return <div>{item.text}</div>
}

export default TodoList
