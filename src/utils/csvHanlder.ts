import { saveAs } from "file-saver"
import { Data } from "../types" // Ensure correct path
import { useToast } from "@chakra-ui/react"

// Removed useCallback since it's not directly usable outside of a React component function body
export const useErrorToast = (description: string) => {
  const toast = useToast()
  return () => {
    toast({
      status: "error",
      variant: "left-accent",
      position: "bottom-left",
      title: "Upload / Download failed",
      description,
      isClosable: true,
    })
  }
}

export const convertToCSV = (data: Data<any>[]): string => {
  const header = Object.keys(data[0]).join(",")
  const rows = data.map((row) => Object.values(row).join(",")).join("\n")
  return `${header}\n${rows}`
}

export const downloadCSV = (data: Data<any>[], fileName: string): void => {
  // Adjusted to use the correct data structure and error handling
  try {
    const csvString = convertToCSV(data)
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, fileName)
  } catch (error) {
    console.error("Error downloading CSV", error)
    // Error handling e.g., using a toast, should be done in the calling component context
  }
}

// This function is meant to be used within a component where `useErrorToast` has been invoked
export const handleDownloadButtonClick = (fileName: string, data: Data<any> | null): void => {
  if (!data) {
    useErrorToast("No data available for download")
    return
  }
  downloadCSV([data], `${fileName}.csv`)
}
