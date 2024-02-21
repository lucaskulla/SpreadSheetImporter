import React, { createContext, ReactNode, useContext, useState } from "react"
import { Field, Fields } from "../types" // Ensure this import reflects the correct type

interface FieldContextType {
  fields: Fields<string>; // This should be an array of Field objects
  addField: (field: Field<string>) => void; // Adjusted for clarity
  getFields: () => Fields<string>;
  getSpecificField: (key: string) => Field<string> | undefined;
}

const FieldContext = createContext<FieldContextType | undefined>(undefined)

export const FieldProvider = ({ children }: { children: ReactNode }) => {
  const [fields, setFields] = useState<Field<string>[]>([])

  const addField = (newField: Field<string>) => {
    // Check if the field key is provided
    if (!newField.key) {
      console.log("Field key is empty")
      return // Early return if the key is empty or undefined
    }

    setFields(prevFields => {
      const fieldIndex = prevFields.findIndex(field => field.key === newField.key)

      if (fieldIndex === -1) {
        // Field does not exist, add as new entry
        return [...prevFields, newField]
      } else {
        // Field exists, update the existing entry
        console.log("Field already exists", newField.key)
        return prevFields.map((field, index) => index === fieldIndex ? newField : field)
      }
    })
  }

  const getFields = () => fields

  const getSpecificField = (key: string) => fields.find(field => field.key === key)

  const value = { fields, addField, getFields, getSpecificField }

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}

export const useFieldContext = () => {
  const context = useContext(FieldContext)
  if (!context) {
    throw new Error("useFieldContext must be used within a FieldProvider")
  }
  return context
}
