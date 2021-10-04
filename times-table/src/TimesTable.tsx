import { type } from "os"
import React, { useEffect, useState } from "react"

type Mul = {
  multiplier: number
  multiplicand: number
}

type TimesStorage = {
  correct: number
  wrong: number
}
const rnd = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function TimesTable() {
  const [mul, setMul] = useState<Mul>({ multiplier: 3, multiplicand: 5 })
  const [options, setOptions] = useState<number[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [timesStorage, setTimesStorage] = useState<TimesStorage>(() => {
    let timesStorageStr: string | null =
      window.localStorage.getItem("timestable")

    let timesStorage: TimesStorage

    if (timesStorageStr) {
      timesStorage = JSON.parse(timesStorageStr)
    } else {
      timesStorage = { correct: 0, wrong: 0 }
    }

    return timesStorage
  })

  const init = () => {
    setIsCorrect(null)
    const multiplier = rnd(2, 10)
    const multiplicand = rnd(2, 10)
    setMul({ multiplier, multiplicand })

    const optionsMod: number[] = []
    // Get a random index to store the actual result
    const i = rnd(0, 4)
    // console.log(`i = ${i}`)

    optionsMod[i] = multiplier * multiplicand
    ;[0, 1, 2, 3, 4].forEach((j) => {
      if (j !== i) {
        optionsMod[j] = rnd(2, 100)
      }
    })
    setOptions(optionsMod)
  }
  useEffect(() => {
    init()
  }, [])

  const onSelect = (selected: number) => {
    if (isCorrect !== null) {
      init()
    } else {
      if (selected === mul.multiplier * mul.multiplicand) {
        setIsCorrect(true)
        timesStorage.correct = timesStorage.correct + 1
      } else {
        setIsCorrect(false)
        timesStorage.wrong = timesStorage.wrong + 1
      }
      const timesStorageStr = JSON.stringify(timesStorage)
      window.localStorage.setItem("timestable", timesStorageStr)
      setTimesStorage(timesStorage)
    }
  }
  return (
    <div className="m-20 text-xl">
      <TimesStatus stats={timesStorage} />
      <TimesHeader mul={mul} onNew={init} />
      <TimesOptions options={options} onSelect={onSelect} />
      {isCorrect !== null && <TimesResult isCorrect={isCorrect} />}
    </div>
  )
}

type TimesHeaderProps = {
  mul: Mul
  onNew: () => void
}

function TimesHeader({ mul, onNew }: TimesHeaderProps) {
  return (
    <div className="text-2xl">
      <div className="py-4 flex justify-between">
        <span>
          <span>{mul.multiplier}</span> X <span>{mul.multiplicand}</span> = ?
        </span>
        <button onClick={onNew}>New</button>
      </div>
      <hr />
    </div>
  )
}

type TimesOptions = {
  options: number[]
  onSelect: (selected: number) => void
}
function TimesOptions({ options, onSelect }: TimesOptions) {
  return (
    <div className="mt-5">
      {options.map((opt, i) => (
        <button
          className="block border mb-2 w-20 h-10"
          key={i}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
      <hr className="mt-5" />
    </div>
  )
}

function TimesResult({ isCorrect }: { isCorrect: boolean }) {
  return (
    <>
      {isCorrect && <h3>You&apos;re Correct!</h3>}
      {!isCorrect && <h3>You&apos;re Wrong!</h3>}
    </>
  )
}
function TimesStatus({ stats }: { stats: TimesStorage }) {
  return (
    <>
      <span>Correct: {stats.correct}</span>&nbsp;
      <span>Wrong: {stats.wrong}</span>
      <hr />
    </>
  )
}
export default TimesTable
