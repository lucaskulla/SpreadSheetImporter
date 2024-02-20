import React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./App"
import { SchemaProvider } from "./context/SchemaContext" // Ensure the path is correct based on your project structure

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <SchemaProvider>
        <App />
    </SchemaProvider>
  </React.StrictMode>,
)
