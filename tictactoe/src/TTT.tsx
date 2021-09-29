import React, { useState, useEffect } from "react"

const maxWidth = 400
const maxHeight = 400
export function TTT() {
  const [midpoint, setMidpoint] = useState([0, 0] as number[])
  const [isXTurn, setIsXTurn] = useState(true)

  const [boardState, setBoardState] = useState([
    -1, -1, -1, -1, -1, -1, -1, -1, -1,
  ] as number[])

  const chunkArray = (arr: number[], size: number): (number | number[])[] =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [arr]

  useEffect(() => {
    // based on any changes in the board, we need to run the winner check algo
    const minusOne = boardState.filter((b) => b === -1)
    if (minusOne.length === 0) {
      const chunks = chunkArray([...boardState], 3)
      console.log(chunks)
    }
  }, [boardState])

  const placeTicTac = (e: any): void => {
    const { clientX, clientY } = e
    // console.log(`clientX = ${clientX}, clientY = ${clientY}`)
    const xGrid = Math.floor(clientX / (maxWidth / 3))
    const yGrid = Math.floor(clientY / (maxHeight / 3))

    const alreadyPlayedGrid = boardState[xGrid * 3 + yGrid] !== -1
    if (alreadyPlayedGrid) return

    const boardStateMod = [...boardState]
    boardStateMod[xGrid * 3 + yGrid] = isXTurn ? 1 : 0
    setBoardState(boardStateMod)
    setIsXTurn(!isXTurn)
  }

  return (
    <>
      <svg
        width={maxWidth}
        height={maxHeight}
        viewBox={`0 0 ${maxWidth} ${maxHeight}`}
        onClick={placeTicTac}
      >
        {/* <Circle midpoint={midpoint} /> */}
        <Line from={[0, maxHeight / 3]} to={[maxWidth, maxHeight / 3]} />
        <Line
          from={[0, (maxHeight * 2) / 3]}
          to={[maxWidth, (maxHeight * 2) / 3]}
        />
        <Line from={[maxWidth / 3, 0]} to={[maxWidth / 3, maxHeight]} />
        <Line
          from={[(maxWidth * 2) / 3, 0]}
          to={[(maxWidth * 2) / 3, maxHeight]}
        />
        {/* <Cross midpoint={[200, 200]} /> */}
        {boardState.map((point, index) => {
          const x = Math.floor(index / 3)
          const y = index % 3
          const cx = (maxWidth / 6) * (x * 2 + 1)
          const cy = (maxWidth / 6) * (y * 2 + 1)
          return (
            <>
              {point === 0 && <Circle key={index} midpoint={[cx, cy]} />}
              {point === 1 && <Cross key={index} midpoint={[cx, cy]} />}
            </>
          )
        })}
      </svg>
    </>
  )
}

type LineProps = {
  from: number[]
  to: number[]
}
function Line({ from, to }: LineProps) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      fill="red"
      stroke="red"
      strokeWidth={5}
    ></line>
  )
}
type CircleProps = {
  midpoint: number[]
}

function Circle({ midpoint }: CircleProps) {
  const [x, y] = midpoint
  return (
    <circle cx={x} cy={y} r="30" stroke="black" strokeWidth="5" fill="white" />
  )
}

type CrossProps = {
  midpoint: number[]
}

function Cross({ midpoint }: CrossProps) {
  //console.log(midpoint)
  const [x, y] = midpoint
  const length = 60
  const sin45 = 1 / Math.sqrt(2)

  const offset = (length / 2) * sin45
  // create a plus and then rotate it by 45deg
  //  className="transform origin-center rotate-45">
  return (
    <g>
      <Line from={[x - offset, y - offset]} to={[x + offset, y + offset]} />
      <Line from={[x - offset, y + offset]} to={[x + offset, y - offset]} />
    </g>
  )
}
