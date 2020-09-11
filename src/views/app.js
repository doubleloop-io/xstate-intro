import React, { useEffect } from "react"
import Timer from "./timer/timer-xstate"

const App = () => {
    useEffect(() => {
        document.getElementsByTagName("iframe").item(0).style.display = "block"
    })
    return (
        <div className="container-fluid">
            <h1>State machines - intro</h1>
            <Timer />
        </div>
    )
}

export default App
