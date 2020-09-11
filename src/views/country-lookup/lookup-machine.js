import { path } from "ramda"
import { Machine, assign } from "xstate"
import { createClient } from "urql"
import { query } from "./country-query"

const isFound = (ctx, ev) => !!path(["data", "data", "country"], ev)
const isNotFound = (ctx, ev) => !path(["data", "data", "country"], ev)
const isError = (ctx, ev) => path(["data", "error"], ev)

const client = createClient({
    url: "https://countries.trevorblades.com/",
    requestPolicy: "network-only",
})

const fetchCountry = (code) => {
    return client.query(query, { code: code })
}

const searchEvent = {
    SEARCH: "searching",
}

//TODO: too much SEARCH transitions
export const machine = Machine(
    {
        id: "lookup",
        initial: "idle",
        states: {
            idle: {
                on: {
                    ...searchEvent,
                },
            },
            searching: {
                entry: ["clearData", "setCountryCode"],
                invoke: {
                    src: "getCountry",
                    onDone: [
                        {
                            target: "error",
                            cond: "isError",
                            actions: "setError",
                        },
                        {
                            target: "found",
                            cond: "isFound",
                            actions: "setCountry",
                        },
                        { target: "notFound", cond: "isNotFound" },
                    ],
                    //onError: { target: "error", actions: "setError" },
                },
            },
            found: {
                on: {
                    ...searchEvent,
                },
            },
            notFound: {
                on: {
                    ...searchEvent,
                },
            },
            error: {
                on: {
                    ...searchEvent,
                },
            },
        },
    },
    {
        actions: {
            clearData: (ctx, ev) => assign({ country: null, error: null }),
            setCountryCode: assign({
                countryCode: (ctx, ev) => ev.code,
            }),
            setCountry: assign({
                country: (ctx, ev) => ev.data.data.country,
            }),
            setError: assign({
                error: (ctx, ev) => {
                    console.log("setError", ev)
                    return ev.data.error
                },
            }),
        },
        guards: {
            isFound,
            isNotFound,
            isError,
        },
        services: {
            getCountry: (ctx, ev) => fetchCountry(ev.code).toPromise(),
            // .then(
            //     () => console.log("resolved"),
            //     () => console.log("rejected"),
            // ),
            //This fucking client never reject. WTF???
        },
    },
)
