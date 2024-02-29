import { saveAs } from "file-saver"


function convertToCSV(data: { [key: string]: string | boolean | undefined }[]): string {
  if (!data || data.length === 0) return ""

  // Assuming the first item represents all possible headers
  const headers = Object.keys(data[0]).join(",")
  const rows = data.map(row =>
    Object.values(row).map(value =>
      // Handle undefined values or other necessary formatting
      typeof value === "undefined" ? "" : value.toString(),
    ).join(","),
  ).join("\n")

  return `${headers}\n${rows}`
}

export function downloadCSV(dataCollection: {
  [fileName: string]: { [key: string]: string | boolean | undefined }[]
}, fileName: string): void {
  const dataToConvert = dataCollection[fileName]

  // Ensure dataToConvert is the correct format or adjust accordingly
  const csvData = convertToCSV(dataToConvert)
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
  saveAs(blob, fileName)
}

