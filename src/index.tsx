import React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./App"
import { CompositeProvider } from "./context/CompositeProvider"
import { ErrorBoundary } from "./components/ErrorBoundary"


const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <CompositeProvider>
        <App />
      </CompositeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
