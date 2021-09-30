import React, { useState, useEffect, useRef } from "react"

const MAX_WIDTH = 400
const MAX_HEIGHT = 400

enum Player {
  X = 1,
  O = 0,
  Draw = -99,
}

type Point = [number, number]
type WinnablePosition = [number, number, number]

type WinningInfo = {
  winner: Player
  position?: WinnablePosition
  line?: {
    from: Point
    to: Point
  }
}

const getCellCenter = (index: number): Point => {
  const x = Math.floor(index / 3)
  const y = index % 3

  // for getting the distance in horizontal(x) direction, we use y value
  // for getting the distance in vertical(y) direction, we use x value
  const cx = (MAX_HEIGHT / 6) * (y * 2 + 1)
  const cy = (MAX_WIDTH / 6) * (x * 2 + 1)

  return [cx, cy]
}

export function TicTacToe() {
  // Which player is playing?
  // true => PLAYER1 ('X')
  // false => PLAYER1 ('O')
  const [isXTurn, setIsXTurn] = useState(true)
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null)
  const [svgOffset, setSvgOffset] = useState<Point>([0, 0])
  const svgRef = useRef(null)

  const [boardState, setBoardState] = useState(
    Array(9).fill(Player.Draw) as number[]
  )

  useEffect(() => {
    if (svgRef.current) {
      const svgElement: SVGElement = svgRef.current
      const { x, y } = svgElement.getBoundingClientRect()

      setSvgOffset([x, y])
    }
  }, [])

  const resetBoard = () => {
    setIsXTurn(true)
    setWinningInfo(null)
    setBoardState(Array(9).fill(Player.Draw))
  }

  const checkWinner = (
    winnablePositions: Array<WinnablePosition>,
    boardState: number[]
  ): WinningInfo | null => {
    for (const position of winnablePositions) {
      const sum = position.reduce((a, b) => a + boardState[b], 0)
      if (sum === 3) {
        return { winner: Player.X, position }
      } else if (sum === 0) {
        return { winner: Player.O, position }
      }
    }

    return null
  }

  useEffect(() => {
    const winnablePositions: Array<WinnablePosition> = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    const winningInfoMod = checkWinner(winnablePositions, boardState)

    if (winningInfoMod !== null) {
      setWinningInfo(winningInfoMod)
    } else {
      const isGameDrawn =
        !winningInfo &&
        boardState.filter((it) => it === Player.Draw).length === 0

      if (isGameDrawn) {
        setWinningInfo({ winner: Player.Draw })
      }
    }
  }, [boardState])

  useEffect(() => {
    // once the game is finished we want to draw a line across the winning position
    drawWinningLine()
  }, [winningInfo])

  const drawWinningLine = () => {
    if (winningInfo && !winningInfo.line && winningInfo.winner != -99) {
      // starting point
      const [x1, y1] = getCellCenter(winningInfo.position![0])

      // ending point
      const [x2, y2] = getCellCenter(winningInfo.position![2])

      setWinningInfo({
        ...winningInfo,
        line: {
          from: [x1, y1],
          to: [x2, y2],
        },
      })
    }
  }

  const handlePlayerAction = (e: any): void => {
    // getting mouse point coordinates
    const { clientX, clientY } = e

    // computing grid position based on mouse click coordinates
    // clientX & clientY (0 to 400)
    // each cell is a square of width & height of 400/3 ~ 133
    // xGrid & yGrid => 0, 1, 2
    // here to find the xGrid position we use the y
    // coordinate and vice versa
    const xGrid = Math.floor((clientY - svgOffset[1]) / (MAX_HEIGHT / 3))
    const yGrid = Math.floor((clientX - svgOffset[0]) / (MAX_WIDTH / 3))

    // console.log("action ", xGrid, yGrid)

    // if the game is over, or the cell was already played, don't allow input
    const isPlayedCell = boardState[xGrid * 3 + yGrid] !== Player.Draw
    const isGameOver = !!winningInfo
    if (isPlayedCell || isGameOver) return

    const boardStateMod = [...boardState]

    //^ index math => xGrid * 3 + yGrid
    //* (0, 0) => 0       (0, 1) => 1      (0, 2) => 2
    //* (1, 0) => 3       (1, 1) => 4      (1, 2) => 5
    //* (2, 0) => 6       (2, 1) => 7      (2, 2) => 8
    boardStateMod[xGrid * 3 + yGrid] = isXTurn ? Player.X : Player.O

    setBoardState(boardStateMod)
    // Player Switch
    setIsXTurn(!isXTurn)
  }

  return (
    <>
      <div className="flex justify-center items-center pt-40">
        <svg
          width={MAX_WIDTH}
          height={MAX_HEIGHT}
          viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}
          onClick={handlePlayerAction}
          ref={svgRef}
        >
          <Grid />
          {boardState.map((point, index) => {
            const [cx, cy] = getCellCenter(index)

            return (
              <g key={index}>
                {point === Player.O && (
                  <Circle key={index} midpoint={[cx, cy]} />
                )}
                {point === Player.X && (
                  <Cross key={index} midpoint={[cx, cy]} />
                )}
                {/* {
                  <text x={cx} y={cy + 50}>
                    {index}
                  </text>
                } */}
              </g>
            )
          })}
          {winningInfo && winningInfo.line && (
            <Line
              color="text-red-400"
              from={winningInfo.line.from}
              to={winningInfo.line.to}
            />
          )}
        </svg>
      </div>
      <div className="flex flex-col justify-center items-center text-gray-100">
        <div>
          <input
            className="mt-6 p-2 bg-transparent cursor-pointer border-solid border border-gray-600 rounded"
            type="button"
            value="Play again"
            onClick={resetBoard}
          />
        </div>
        <div className="mt-4">
          {winningInfo &&
            winningInfo.winner != null &&
            (winningInfo.winner === Player.Draw ? (
              <h3 className="text-3xl">It is a draw</h3>
            ) : (
              <h3 className="text-3xl">{`${
                winningInfo.winner === Player.X ? "X" : "O"
              } wins`}</h3>
            ))}
        </div>
      </div>
    </>
  )
}

function Grid() {
  return (
    <>
      <Line from={[0, MAX_HEIGHT / 3]} to={[MAX_WIDTH, MAX_HEIGHT / 3]} />
      <Line
        from={[0, (MAX_HEIGHT * 2) / 3]}
        to={[MAX_WIDTH, (MAX_HEIGHT * 2) / 3]}
      />
      <Line from={[MAX_WIDTH / 3, 0]} to={[MAX_WIDTH / 3, MAX_HEIGHT]} />
      <Line
        from={[(MAX_WIDTH * 2) / 3, 0]}
        to={[(MAX_WIDTH * 2) / 3, MAX_HEIGHT]}
      />
    </>
  )
}

type LineProps = {
  from: Point
  to: Point
  color?: string
}

function Line({ from, to, color }: LineProps) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      className={`${color || "text-gray-500"} stroke-current`}
      strokeWidth={5}
    ></line>
  )
}

type CircleProps = {
  midpoint: Point
}

function Circle({ midpoint }: CircleProps) {
  const [x, y] = midpoint
  return (
    <circle
      className="text-green-400 stroke-current fill-transparent"
      fill="transparent"
      cx={x}
      cy={y}
      r="30"
      strokeWidth="5"
    />
  )
}

type CrossProps = {
  midpoint: Point
}

function Cross({ midpoint }: CrossProps) {
  const [x, y] = midpoint
  const length = 70
  const sin45 = 1 / Math.sqrt(2)

  const offset = (length / 2) * sin45

  return (
    <g>
      <Line
        color="text-blue-400"
        from={[x - offset, y - offset]}
        to={[x + offset, y + offset]}
      />
      <Line
        color="text-blue-400"
        from={[x - offset, y + offset]}
        to={[x + offset, y - offset]}
      />
    </g>
  )
}
