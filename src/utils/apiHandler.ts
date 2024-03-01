import { useCallback } from "react"
import { useToast } from "@chakra-ui/react"
import apiClient from "../api/apiClient"
import fieldsToJsonSchema from "./fieldsToSchema"
import { Data, Fields } from "../types"

// Custom hook for using the API with built-in toast notifications
export const useApi = () => {
  const toast = useToast()

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

  const uploadDataToAPI = useCallback((data: Data<any>[], schemaToUse: string | undefined) => async () => {
    try {
      if (data.length === 0) throw new Error("No data to upload")
      await Promise.all(data.map(item => apiClient.post(`/object/${schemaToUse}`, item, { params: { skip_validation: true } })))
      toast({
        title: "Upload successful.",
        description: "Your data have been successfully uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const message = (error as Error).message || "An unexpected error occurred"
      errorToast(message)
    }
  }, [toast, errorToast])

  const uploadNewSchemaToAPI = useCallback((schemaToUse: string | undefined, fields: Fields<string>) => async () => {
    try {
      const conversion = fieldsToJsonSchema(fields, schemaToUse)
      conversion["$id"] = schemaToUse
      conversion["version"] = conversion["version"] || "0.0.1"
      await apiClient.post("/schema", conversion)
      toast({
        title: "Upload successful.",
        description: "Your schema has been successfully uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const message = (error as Error).message || "An unexpected error occurred"
      errorToast(message)
    }
  }, [toast, errorToast])

  // Correct return statement
  return { uploadDataToAPI, uploadNewSchemaToAPI }
}
