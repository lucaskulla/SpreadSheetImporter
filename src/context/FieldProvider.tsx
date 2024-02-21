import React, { createContext, ReactNode, useContext, useState } from "react"
import { Fields } from "../types"

interface FieldContextType {
  fields: Fields<string>;
  addField: (field: Fields<string>[number]) => void;
  getFields: () => Fields<string>;
  getSpecificField: (key: string) => Fields<string>[number] | undefined;
}

// Rename for clarity
const FieldContext = createContext<FieldContextType | undefined>(undefined)

// Correctly named Provider component
export const FieldProvider = ({ children }: { children: ReactNode }) => {
  const [fields, setFields] = useState<Fields<string>>([])

  const addField = (field: Fields<string>[number]) => {
    setFields((prevFields) => [...prevFields, field])
  }

  const getFields = () => fields

  const getSpecificField = (key: string) => fields.find((field) => field.key === key)

  const value = { fields, addField, getFields, getSpecificField }

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}

export const useFieldContext = () => {
  const context = useContext(FieldContext)
  if (context === undefined) {
    throw new Error("useFieldContext must be used within a FieldProvider")
  }
  return context
}
