import React, { useState, useEffect } from "react"
import { Machine, assign } from "xstate"
import { useMachine } from "@xstate/react"
import { inspect } from "@xstate/inspect"

const states = {
    id: "machine",
    type: "parallel",
    context: {
        timer: 0,
        savedValue: 0,
    },
    states: {
        timer: {
            id: "timer",
            initial: "unset",
            states: {
                unset: {
                    on: {
                        INCREMENT: {
                            target: "set",
                            actions: ["increment", "storeValue"],
                        },
                        RESET: "set",
                    },
                },
                set: {
                    on: {
                        INCREMENT: {
                            actions: ["increment", "storeValue"],
                        },
                        DECREMENT: [
                            {
                                cond: "isOne",
                                target: "unset",
                                actions: ["decrement", "storeValue"],
                            },
                            {
                                actions: ["decrement", "storeValue"],
                            },
                        ],
                        START: "running",
                    },
                },
                running: {
                    invoke: {
                        src: "countdown",
                    },
                    on: {
                        STOP: "set",
                        COUNTDOWN: [
                            {
                                cond: "isOne",
                                target: "unset",
                                actions: "decrement",
                            },
                            {
                                actions: "decrement",
                            },
                        ],
                    },
                },
            },
        },
        reset: {
            id: "reset",
            initial: "disabled",
            states: {
                disabled: {
                    on: {
                        STOP: {
                            target: "enabled",
                            cond: "hasSavedValue",
                        },
                        COUNTDOWN: {
                            cond: "isOne",
                            target: "enabled",
                        },
                    },
                },
                enabled: {
                    on: {
                        RESET: {
                            target: "disabled",
                            actions: "reset",
                        },
                        START: "disabled",
                    },
                },
            },
        },
    },
}

const options = {
    actions: {
        increment: assign({
            timer: (ctx) => ctx.timer + 1,
        }),
        decrement: assign({
            timer: (ctx) => ctx.timer - 1,
        }),
        storeValue: assign({
            savedValue: (ctx) => ctx.timer,
        }),
        reset: assign({
            timer: (ctx) => ctx.savedValue,
        }),
    },
    guards: {
        isOne: (ctx) => ctx.timer === 1,
        hasSavedValue: (ctx) =>
            ctx.savedValue !== ctx.timer && ctx.savedValue !== 0,
    },
    services: {
        countdown: () => (send) => {
            const interval = setInterval(() => send("COUNTDOWN"), 1000)
            return () => clearInterval(interval)
        },
    },
}

const timerMachine = Machine(states, options)

inspect()

const Timer = () => {
    const [uiState, send] = useMachine(timerMachine, { devTools: true })
    const { timer } = uiState.context
    const increment = () => send("INCREMENT")
    const decrement = () => send("DECREMENT")
    const start = () => send("START")
    const stop = () => send("STOP")
    const reset = () => send("RESET")

    return (
        <>
            <div>
                <h2>The Great Timer</h2>
            </div>
            <div>
                <button
                    disabled={uiState.matches("timer.running")}
                    onClick={increment}
                >
                    +
                </button>
                <button
                    disabled={!uiState.matches("timer.set")}
                    onClick={decrement}
                >
                    -
                </button>
                <button
                    disabled={!uiState.matches("timer.set")}
                    onClick={start}
                >
                    Start
                </button>
                <button
                    disabled={!uiState.matches("timer.running")}
                    onClick={stop}
                >
                    Stop
                </button>
                <button
                    disabled={uiState.matches("reset.disabled")}
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
