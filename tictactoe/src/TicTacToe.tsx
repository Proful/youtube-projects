import React, { useState, useEffect } from "react"

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
  const x = index % 3
  const y = Math.floor(index / 3)
  const cx = (MAX_WIDTH / 6) * (x * 2 + 1)
  const cy = (MAX_WIDTH / 6) * (y * 2 + 1)

  return [cx, cy]
}

export function TicTacToe() {
  // Which player is playing?
  // true => PLAYER1 ('X')
  // false => PLAYER1 ('O')
  const [isXTurn, setIsXTurn] = useState(true)
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null)

  const [boardState, setBoardState] = useState(
    Array(9).fill(Player.Draw) as number[]
  )

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
      const [cx1, cy1] = getCellCenter(winningInfo.position![0])

      // ending point
      const [cx2, cy2] = getCellCenter(winningInfo.position![2])

      setWinningInfo({
        ...winningInfo,
        line: {
          from: [cx1, cy1],
          to: [cx2, cy2],
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
    const xGrid = Math.floor(clientX / (MAX_WIDTH / 3))
    const yGrid = Math.floor(clientY / (MAX_HEIGHT / 3))

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
      <svg
        width={MAX_WIDTH}
        height={MAX_HEIGHT}
        viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}
        onClick={handlePlayerAction}
      >
        <Grid />
        {boardState.map((point, index) => {
          const [cx, cy] = getCellCenter(index)

          return (
            <g key={index}>
              {point === Player.X && <Circle key={index} midpoint={[cx, cy]} />}
              {point === Player.O && <Cross key={index} midpoint={[cx, cy]} />}
              {
                <text x={cx} y={cy + 50}>
                  {index}
                </text>
              }
            </g>
          )
        })}
        {winningInfo && winningInfo.line && (
          <Line from={winningInfo.line.from} to={winningInfo.line.to} />
        )}
      </svg>
      {winningInfo &&
        winningInfo.winner != null &&
        (winningInfo.winner === Player.Draw ? (
          <h3 className="text-2xl">It is a draw</h3>
        ) : (
          <h3 className="text-2xl">{`${
            winningInfo.winner === Player.X ? "X" : "O"
          } is the winner`}</h3>
        ))}
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
  const [x, y] = midpoint
  const length = 60
  const sin45 = 1 / Math.sqrt(2)

  const offset = (length / 2) * sin45

  return (
    <g>
      <Line from={[x - offset, y - offset]} to={[x + offset, y + offset]} />
      <Line from={[x - offset, y + offset]} to={[x + offset, y - offset]} />
    </g>
  )
}
