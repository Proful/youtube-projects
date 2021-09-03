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

  useEffect(
    () => window.localStorage.setItem("todos", JSON.stringify(todos)),
    [todos]
  )

  const handleCreateTodo = (todo: string) => {
    const oldTodos = [...todos]
    oldTodos.push({
      id: todos.length + 1,
      text: todo,
      isCompleted: false,
    })
    setTodos(oldTodos)
  }

  const handleDeleteTodo = (todoId: number) => {
    let updatedTodos = [...todos]
    let selectedTodoIdx = todos.findIndex((todo) => todo.id === todoId)
    updatedTodos.splice(selectedTodoIdx, 1)
    setTodos(updatedTodos)
  }
  const handleComplete = (todoId: number) => {
    // clone the original array to avoid mutate by reference
    let updatedTodos = [...todos]
    // find the todo based on todo id
    let selectedTodo = todos.find((todo) => todo.id === todoId)
    // find the todo index based on todo id
    let selectedTodoIdx = todos.findIndex((todo) => todo.id === todoId)

    if (selectedTodo) {
      updatedTodos[selectedTodoIdx] = {
        ...selectedTodo,
        isCompleted: !selectedTodo.isCompleted,
      }
      setTodos(updatedTodos)
    }
  }
  return (
    <div className="bg-white shadow-md w-2/5 p-8 rounded-xl">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <hr className="mt-2" />
      <TodoNew createTodo={handleCreateTodo} />
      <div className="mt-4">
        You have {todos.filter((it) => it.isCompleted === false).length} pending
        task(s)
      </div>
      <div className="mt-4">
        {todos.map((it) => (
          <TodoItem
            key={it.id}
            item={it}
            deleteTodo={handleDeleteTodo}
            complete={handleComplete}
          />
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
interface TodoItemProps {
  item: Todo
  deleteTodo: (id: number) => void
  complete: (id: number) => void
}
function TodoItem({ item, deleteTodo, complete }: TodoItemProps) {
  return (
    <div className="bg-blue-50 px-4 py-2 rounded-full shadow mb-4 relative">
      <button
        type="button"
        onClick={() => deleteTodo(item.id)}
        className="absolute top-3 right-3"
      >
        <Delete />
      </button>
      <input
        type="checkbox"
        className="h-4 w-4 mr-2 -mt-2"
        checked={item.isCompleted}
        onChange={() => complete(item.id)}
      />
      <span className={item.isCompleted ? "line-through" : ""}>
        {item.text}
      </span>
    </div>
  )
}

function PlusCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#4B5563"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function Delete() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#4B5563"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

export default TodoList
