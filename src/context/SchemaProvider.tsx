// SchemaProvider.tsx
import React, { createContext, ReactNode, useContext, useState } from "react"
import { Fields } from "../types"
import { JSONSchema7 } from "json-schema"

interface SchemaContextType {
  isSchemaUsed: boolean; //is the schema used?
  setSchemaUsed: (used: boolean) => void;
  schemaToUse: string | undefined; //which schema to use?
  setSchemaToUse: (schema: string | undefined) => void;
  selectedSchema: JSONSchema7 | undefined; //selected schema from the dropdown
  setSelectedSchema: (schema: JSONSchema7) => void;
  convertedSchema: Fields<string> | undefined; //converted schema based on the selected schema
  setConvertedSchema: (fields: Fields<string> | undefined) => void;
  schemaVersion: string; //version of the schema
  setSchemaVersion: (version: string) => void;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined)

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [isSchemaUsed, setSchemaUsed] = useState<boolean>(false)
  const [schemaToUse, setSchemaToUse] = useState<string | undefined>(undefined)
  const [selectedSchema, setSelectedSchema] = useState<JSONSchema7>({})
  const [convertedSchema, setConvertedSchema] = useState<Fields<string> | undefined>(undefined)
  const [schemaVersion, setSchemaVersion] = useState<string>("0.0.0")

  const value = {
    isSchemaUsed,
    setSchemaUsed,
    schemaToUse,
    setSchemaToUse,
    selectedSchema,
    setSelectedSchema,
    convertedSchema,
    setConvertedSchema,
    schemaVersion,
    setSchemaVersion,
  }

  return <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>
}

export const useSchemaContext = () => {
  const context = useContext(SchemaContext)
  if (context === undefined) {
    throw new Error("useSchema must be used within a SchemaProvider")
  }
  return context
}
