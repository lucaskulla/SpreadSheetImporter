// SchemaContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SchemaContextType {
  isSchemaUsed: boolean;
  setSchemaUsed: (used: boolean) => void;
  schemaToUse: string | undefined;
  setSchemaToUse: (schema: string | undefined) => void;
  selectedSchema: any;
  setSelectedSchema: (schema: any) => void;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [isSchemaUsed, setSchemaUsed] = useState<boolean>(false);
  const [schemaToUse, setSchemaToUse] = useState<string | undefined>(undefined);
  const [selectedSchema, setSelectedSchema] = useState<any>(null);

  const value = {
    isSchemaUsed,
    setSchemaUsed,
    schemaToUse,
    setSchemaToUse,
    selectedSchema,
    setSelectedSchema,
  };

  return <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>;
};

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (context === undefined) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
};
