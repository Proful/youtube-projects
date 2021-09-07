import React, { useState } from "react"

export function Adder() {
  const [x, setX] = useState(() => Math.floor(Math.random() * 100))
  const [y, setY] = useState(() => Math.floor(Math.random() * 100))
  const [carry, setCarry] = useState("")
  const [right, setRight] = useState("")
  const [left, setLeft] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  const onNew = () => {
    setX(Math.floor(Math.random() * 100))
    setY(Math.floor(Math.random() * 100))
    setCarry("")
    setRight("")
    setLeft("")
    setIsSuccess(false)
    setIsFailure(false)
  }
  const onCheck = () => {
    if (x + y === +(right + left)) {
      setIsSuccess(true)
      setIsFailure(false)
    } else {
      setIsSuccess(false)
      setIsFailure(true)
    }
  }
  return (
    <>
      <p>
        <input
          type="text"
          name="carry"
          className="text-9xl w-12 border border-green-200 -ml-20"
          value={carry}
          onChange={(e) => setCarry(e.target.value)}
        ></input>
      </p>
      <p className="text-9xl">{x < 10 ? `0${x}` : x}</p>
      <p className="text-9xl -ml-20">+ {y < 10 ? `0${y}` : y}</p>
      <hr />
      <p className="-ml-16 mt-2">
        <input
          type="text"
          name="right"
          className="text-9xl w-40 border border-green-200 mr-1"
          value={right}
          onChange={(e) => setRight(e.target.value)}
        ></input>
        <input
          type="text"
          name="left"
          className="text-9xl w-20 border border-red-200"
          value={left}
          onChange={(e) => setLeft(e.target.value)}
        ></input>
      </p>
      <div className="mt-12">
        <button onClick={onNew} className="p-5 bg-red-200 rounded-md mr-5">
          New
        </button>
        <button onClick={onCheck} className="p-5 bg-green-200 rounded-md">
          Check
        </button>
      </div>
      <div className="absolute top-0">
        {isSuccess && <Correct />}
        {isFailure && <Wrong />}
      </div>
    </>
  )
}

function Correct() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-96 w-96"
      fill="none"
      viewBox="0 0 50 50"
      stroke="green"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
function Wrong() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-96 w-96"
      fill="none"
      viewBox="0 0 50 50"
      stroke="red"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
