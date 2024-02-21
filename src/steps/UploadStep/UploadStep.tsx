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
    } else {
      try {
        const response: AxiosResponse<RJSFSchema> = await apiClient.get(`/schema/${schemaToUse}`)
        const version = schemaToUse.substring(schemaToUse.lastIndexOf(":") + 1) // "0.0.1"

        if (response.data[version]) {
          setSelectedSchema(response.data[version])
          setConvertedSchema(schemaToFields(response.data[version]))
        } else {
          console.log("No version in schema found")
          showErrorAlert("No version in schema found")
        }
      } catch (error) {
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
      const response = await apiClient.get("/schema", { params: { include_version: true } })
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

