import React, { useRef } from "react"
import { useMachine } from "@xstate/react"
import { machine } from "./lookup-machine"
import { inspect } from "@xstate/inspect"

inspect()

export default function ContryLookup() {
    const [state, send] = useMachine(machine, { devTools: true })

    const matches = (...targets) => targets.includes(state.value)

    const inputEl = useRef(null)

    const onClick = () => {
        send("SEARCH", { code: inputEl.current.value })
    }

    const loading = (text) => (matches("searching") ? "Loading..." : text)

    return (
        <div>
            <h1>Country - {state.value}</h1>
            <input ref={inputEl} type="text" />
            <button onClick={onClick}>{loading("Search")}</button>

            {matches("idle") && (
                <div>
                    <p>Don&apos;t be shy, hit the search</p>
                </div>
            )}

            {matches("found") && (
                <div>
                    <p>{state.context.country.name}</p>
                    <p>{state.context.country.native}</p>
                    <p>{state.context.country.phone}</p>
                </div>
            )}

            {matches("notFound") && (
                <div>
                    <p>
                        Sorry, no country with code {state.context.countryCode}
                    </p>
                </div>
            )}

            {matches("error") && (
                <div>
                    <p>Sorry, got an error {state.context.error.message}</p>
                </div>
            )}
        </div>
    )
}
