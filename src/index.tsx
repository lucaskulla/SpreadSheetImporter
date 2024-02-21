import React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./App"
import { CompositeProvider } from "./context/CompositeProvider"


const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <CompositeProvider>
      <App />
    </CompositeProvider>
  </React.StrictMode>,
)
