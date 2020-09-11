import React, { useState, useEffect } from "react"

const Timer = () => {
    const [timer, setTimer] = useState(0)
    const [started, setStarted] = useState(false)
    const [lastSetValue, setLastSetValue] = useState(0)

    const adjustTimer = (offset) => {
        if (started) return
        if (timer + offset >= 0) {
            setTimer(timer + offset)
            setLastSetValue(timer + offset)
        }
    }

    const increment = () => adjustTimer(1)
    const decrement = () => adjustTimer(-1)
    const start = () => {
        if (timer > 0) setStarted(true)
    }
    const stop = () => setStarted(false)
    const reset = () => {
        if (started) return
        setTimer(lastSetValue)
    }

    useEffect(() => {
        if (!started) return
        if (timer > 0) {
            setTimeout(() => setTimer(timer - 1), 1000)
        } else {
            stop()
        }
    }, [started, timer])

    return (
        <>
            <div>
                <h2>The Great Timer</h2>
            </div>
            <div>
                <button disabled={started} onClick={increment}>
                    +
                </button>
                <button disabled={started || timer === 0} onClick={decrement}>
                    -
                </button>
                <button disabled={started || timer === 0} onClick={start}>
                    Start
                </button>
                <button disabled={!started} onClick={stop}>
                    Stop
                </button>
                <button
                    disabled={started || lastSetValue === timer}
                    onClick={reset}
                >
                    Reset
                </button>
            </div>
            <div>{timer}</div>
        </>
    )
}

export default Timer
