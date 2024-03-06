import React, { useCallback, useEffect, useState } from "react"
import type { WorkBook } from "xlsx"
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useStyleConfig,
  useToast,
} from "@chakra-ui/react"

import { DropZone } from "./components/DropZone"
import { useRsi } from "../../hooks/useRsi"

import type { themeOverrides } from "../../theme"
import apiClient from "../../api/apiClient"
import type { AxiosResponse } from "axios"
import type { RJSFSchema } from "@rjsf/utils"
import { useSchemaContext } from "../../context/SchemaProvider"
import schemaToFields from "../../utils/schemaToFields"

type UploadProps = {
  onContinue: (data: WorkBook) => Promise<void>;
}

interface SchemaOption {
  value: string;
  label: string;
}


function getHighestVersionAndSchema(response: RJSFSchema): { version: string, schema: RJSFSchema } {
  // Extract version keys from the response object
  const versions = Object.keys(response)

  // Sort the version keys. The sort function compares each part of the version numbers.
  versions.sort((a, b) => {
    const partsA = a.split(".").map(Number)
    const partsB = b.split(".").map(Number)

    // Compare each part of the version number until a difference is found
    for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
      if (partsA[i] !== partsB[i]) {
        return partsA[i] - partsB[i]
      }
    }

    // If all compared parts are equal, the longer version string is considered higher
    return partsA.length - partsB.length
  })

  // The last element in the sorted array is the highest version
  const highestVersion = versions[versions.length - 1]

  // Return the highest version object from the response
  return { version: response[highestVersion]["version"], schema: response[highestVersion] }
}


export const UploadStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const styles = useStyleConfig("UploadStep") as typeof themeOverrides["components"]["UploadStep"]["baseStyle"]
  const { translations } = useRsi()
  const [fetchedOptions, setFetchedOptions] = useState<SchemaOption[]>([])
  const {
    isSchemaUsed,
    setSchemaUsed,
    schemaToUse,
    setSchemaToUse,
    selectedSchema,
    setSelectedSchema,
    convertedSchema,
    setSchemaVersion,
    setConvertedSchema,
  } = useSchemaContext()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const toast = useToast()

  // Function to handle displaying error messages in a centralized way
  const showErrorAlert = (message: string) => {
    console.error("Alert error: " + message)
    toast({
      status: "error",
      variant: "left-accent",
      position: "bottom-left",
      title: "Error fetching schema",
      description: message,
      isClosable: true,
    })
  }

  const fetchSchema = async () => {
    if (!schemaToUse) { // If no schema is selected, reset the selected schema
      setSchemaToUse(undefined)
      setSelectedSchema({})
      setSchemaVersion("0.0.1")
    } else {
      try {
        const response: AxiosResponse<RJSFSchema> = await apiClient.get(`/schema/${schemaToUse}`)

        const { version, schema } = getHighestVersionAndSchema(response.data)

        setSchemaVersion(version)
        setSelectedSchema(schema)
        setConvertedSchema(schemaToFields(schema))
      } catch
        (error) {
        console.log("Error fetching schema", error)
        toast({
          status: "error",
          variant: "left-accent",
          position: "bottom-left",
          title: "Error fetching schema",
          description: (error as Error).message,
          isClosable: true,
        })
      }
    }
  }


  const fetchOptions = async () => {
    if (!isSchemaUsed) {
      setFetchedOptions([]) // Optionally clear options when the checkbox is unchecked
      setSelectedSchema({})
      setSchemaToUse(undefined)
      return // Do not fetch options if the checkbox is unchecked
    }
    try {
      const response = await apiClient.get("/schema/", { params: { include_version: false } })
      if (Array.isArray(response.data)) {
        setFetchedOptions(response.data.map((item) => ({ value: item, label: item })))
      } else {
        showErrorAlert("Fetching options failed")

      }
    } catch (error) {
      showErrorAlert((error as Error).message)
    }
  }


  const handleOnContinue = useCallback(async (data: WorkBook) => {
    setIsLoading(true)
    await onContinue(data)
    setIsLoading(false)
  }, [onContinue])

  const handleSelectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectValue = e.target.value
    setSchemaToUse(selectValue)
  }

  const handlePreviewClick = useCallback(() => setIsPreviewOpen(true), [])

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSchemaUsed(e.target.checked)
  }, [setSchemaUsed])

  useEffect(() => {
    fetchSchema()
  }, [schemaToUse]) // Depend on schemaToUse to trigger fetchSchema,


  useEffect(() => {
    fetchOptions()
  }, [isSchemaUsed]) // Add isSchemaUsed as a dependency

  return (
    <ModalBody>
      <Heading>{translations.uploadStep.title}</Heading>
      <Checkbox isChecked={isSchemaUsed} onChange={handleCheckboxChange}>
        Reuse an existing schema
      </Checkbox>
      {isSchemaUsed && (
        <Box>
          <Select placeholder="Select an option" value={schemaToUse || ""} onChange={handleSelectBoxChange}>
            {fetchedOptions.map((option: SchemaOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button onClick={handlePreviewClick}>Preview</Button>
        </Box>
      )}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <ModalOverlay />
        <ModalContent maxW="80vw" maxH="80vh" overflow="auto">
          <ModalHeader>Schema Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre>{JSON.stringify(selectedSchema, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
      <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
    </ModalBody>
  )
}

