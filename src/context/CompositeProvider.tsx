import React, { ReactNode } from "react"
import { SchemaProvider } from "./SchemaProvider"
import { FieldProvider } from "./FieldProvider"

interface CompositeProviderProps {
  children: ReactNode; //children to be wrapped by the provider
}

export const CompositeProvider: React.FC<CompositeProviderProps> = ({ children }) => {
  return (
    <SchemaProvider>
      <FieldProvider>
        {children}
      </FieldProvider>
    </SchemaProvider>
  )
}
