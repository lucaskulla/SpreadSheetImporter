import React, { ReactNode } from "react"
import { SchemaProvider } from "./SchemaProvider"
import { FieldProvider } from "./FieldProvider"
import { DataProvider } from "./DataProvider"

interface CompositeProviderProps {
  children: ReactNode; //children to be wrapped by the provider
}

export const CompositeProvider: React.FC<CompositeProviderProps> = ({ children }) => {
  return (
    <DataProvider>
      <SchemaProvider>
        <FieldProvider>
          {children}
        </FieldProvider>
      </SchemaProvider>
    </DataProvider>
  )
}
