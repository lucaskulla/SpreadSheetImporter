// DataContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react"
import { Data } from "../types"

// Define the shape of the context data for TypeScript
interface DataContextType<T extends string> {
  setData: React.Dispatch<React.SetStateAction<Data<T>>>;
  getData: () => Data<T>;
  dataAvailable: () => boolean;
}

// Create the context with an undefined initial value
export const DataContext = createContext<DataContextType<any>>(null!)

// Create a provider component
export const DataProvider = <T extends string>({ children }: { children: ReactNode }) => {
  // Adjust the useState with a type assertion if needed
  const [data, setData] = useState<Data<T>>({} as Data<T>)

  const getData = () => data

  const dataAvailable = () => Object.keys(data).length > 0

  // Adjust the value object to use the generic type
  const value = {
    setData,
    getData,
    dataAvailable,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}


// Custom hook to use the data context
export const useDataConext = (): DataContextType<any> => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
