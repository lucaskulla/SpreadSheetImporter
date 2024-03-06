import React from "react"
import { getEnvVar } from "../utils/getEnvVar"

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render can decide what to do.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    if (getEnvVar("REACT_APP_DEV_MODE") === "true") {
      console.error("Uncaught error:", error, errorInfo)
      // Here, you might want to log the error to an external service
    }
  }

  render() {
    if (this.state.hasError) {
      // In production, don't render a fallback UI, just render children as if nothing happened
      // This might not be the best practice as it leaves users without feedback on errors
      if (getEnvVar("REACT_APP_DEV_MODE") === "false") {
        return this.props.children
      } else {
        // During development, you might want to still show something to indicate an error occurred
        return <h1>Something went wrong.</h1>
      }
    }

    return this.props.children
  }
}
