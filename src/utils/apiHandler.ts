import { useCallback, useState } from "react"
import { useToast } from "@chakra-ui/react"
import apiClient from "../api/apiClient"
import fieldsToJsonSchema from "./fieldsToSchema"
import { Data, Fields } from "../types"

// Custom hook for using the API with built-in toast notifications
export const useApi = () => {
  const toast = useToast()

  const [schemaUploadScuccess, setSchemaUploadSuccess] = useState(false)

  const errorToast = useCallback((description: string) => {
    toast({
      status: "error",
      variant: "left-accent",
      position: "bottom-left",
      title: "Upload / Download failed",
      description,
      isClosable: true,
    })
  }, [toast])

  const uploadDataToAPI = useCallback((data: Data<any>[] | Data<any>, schemaToUse: string | undefined) => async () => {
    console.log(schemaUploadScuccess)
    if (!schemaUploadScuccess) return
    try {
      console.log("Upload Data with schema: " + schemaToUse)


      // Initial validation to ensure there's data to process.
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("No data to upload")
      }

      // Extract validData from the first item if data is an array, otherwise directly from data.
      const validData = Array.isArray(data) ? data[0]?.validData : data.validData

      // Validate validData is not empty.
      if (validData === undefined || validData === null || validData === "") {
        throw new Error("Data to upload is empty")
      }

      // Ensure validData is in an array format for uniform handling.
      const uploadItems = Array.isArray(validData) ? validData : [validData]

      // Further validate that we have uploadable items.
      if (uploadItems.length === 0) {
        throw new Error("No valid data to upload")
      }

      await Promise.all(uploadItems.map(item =>
        apiClient.post(`/object/${schemaToUse}`, item, { params: { skip_validation: true } }),
      ))


      toast({
        title: "Upload successful.",
        description: "Your data have been successfully uploaded.",
        status: "success",
        duration: 10000,
        isClosable: true,
      })
    } catch (error) {
      const message = (error instanceof Error) ? error.message : "An unexpected error occurred"
      errorToast(message)
    }
  }, [toast, errorToast])


  const uploadNewSchemaToAPI = useCallback((schemaToUse: string | undefined, fields: Fields<string>) => async () => {
    try {
      const conversion = fieldsToJsonSchema(fields, schemaToUse)
      conversion["$id"] = schemaToUse

      conversion["version"] = conversion["version"] || "0.0.1"

      await apiClient.post("/schema", conversion)
      setSchemaUploadSuccess(true)
      toast({
        title: "Upload successful.",
        description: "Your schema has been successfully uploaded.",
        status: "success",
        duration: 10000,
        isClosable: true,
      })
    } catch (error) {
      setSchemaUploadSuccess(false) //prevent data upload if schema upload fails
      const message = (error as Error).message || "An unexpected error occurred"
      errorToast(message)
    }
  }, [toast, errorToast])

  // Correct return statement
  return { uploadDataToAPI, uploadNewSchemaToAPI }
}
