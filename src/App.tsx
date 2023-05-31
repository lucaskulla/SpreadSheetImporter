import { ReactSpreadsheetImport } from "./ReactSpreadsheetImport"
import {
  Box,
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { mockRsiValues } from "./stories/mockRsiValues"
import React, { useCallback, useEffect, useState } from "react"
import type { Data } from "./types"
import { saveAs } from "file-saver"
import fieldsToJsonSchema from "./utils/fieldsToSchema"
import apiClient from "./api/apiClient"
import EditorModal from "./components/Editor/EditorModal"
import { JSONSchema6 } from "json-schema"

export const Basic = () => {
  const [data, setData] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditorOpen, onOpen: onOpenEditor, onClose: onCloseEditor } = useDisclosure()
  const [showPreview, setShowPreview] = useState(false)
  const [previewSchema, setPreviewSchema] = useState<JSONSchema6>()

  const toast = useToast()


  function convertToCSV(data: Data<string>[]): string {
    const header = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(",")).join("\n")

    return `${header}\n${rows}`
  }

  // Function to download data as a CSV file
  function downloadCSV(data: Data<string>[], fileName: string): void {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, fileName)
  }

  function handleDownloadButtonClick(fileName: string): void {
    if (data) {
      downloadCSV(data[fileName], fileName + ".csv")
    } else {
      console.log("Data not avaiable")
    }
  }

  function uploadDataToAPI(): void {
    const urn = localStorage.getItem("schemaToUse")

    if (data && data["validData"]) {
      data["validData"].forEach((item: any) => {
        // Send a POST request for each item
        apiClient
          .post("/object/" + urn, item, { params: { skip_validation: false } })
          .then((response: any) => {
            console.log(`Data uploaded successfully for item: ${JSON.stringify(item)}`)
            console.log(response)
          })
          .catch((error: any) => {
            console.error(`Error occurred while uploading data for item: ${JSON.stringify(item)}`)
            console.error(error)
          })
      })
    }
  }

  const errorToast = useCallback(
    (description: string) => {
      toast({
        status: "error",
        variant: "left-accent",
        position: "bottom-left",
        title: "Upload failed",
        description: description,
        isClosable: true,
      })
    },
    [toast],
  )

  useEffect(() => {
    const fields = localStorage.getItem("fieldsList")
    const schemaUsedStorage = localStorage.getItem("schemaUsed")
    const schemaUsed: boolean = schemaUsedStorage ? schemaUsedStorage === "true" : false
    if (fields) {
      const conversion = fieldsToJsonSchema(JSON.parse(fields), schemaUsed)
      setPreviewSchema(conversion)
    }
  }, [])

  function uploadNewSchemaToAPI(): void {
    const fields = localStorage.getItem("fieldsList")
    const schemaUsedStorage = localStorage.getItem("schemaUsed")
    const schemaUsed: boolean = schemaUsedStorage ? schemaUsedStorage === "true" : false
    if (fields) {
      const conversion = fieldsToJsonSchema(JSON.parse(fields), schemaUsed)
      console.log(JSON.stringify(conversion, null, 2), "conversion")
      apiClient
        .post("/schema", conversion)
        .then((r: any) => console.log(r))
        .catch((e: { message: string }) => {
          const errorMessage = e.message || "An unexpected error occurred"
          errorToast(errorMessage)
        })
    }
  }

  function saveDataFromEditor(dataEditor: string): void {
    const d = JSON.parse(dataEditor)
    setData(d)
    console.log("data from editor", data)
  }

  function removeOldStorage(): void {
    localStorage.removeItem("fieldsList")
    localStorage.removeItem("field")
    localStorage.removeItem("schemaToUse")
    localStorage.removeItem("schemaFromAPI")
    localStorage.removeItem("newField")
    localStorage.removeItem("schema")
    localStorage.removeItem("fields")

    localStorage.setItem("schemaUsed", "false")
  }


  return (
    <>
      <Box py={20} display="flex" gap="8px" alignItems="center">
        <Button
          onClick={() => {
            removeOldStorage()
            onOpen()
          }}
          border="2px solid #7069FA"
          p="8px"
          borderRadius="8px"
        >
          Start harmonizing your data
        </Button>
      </Box>

      {data && (
        <Box py={20} display="flex" gap="8px" alignItems="center">
          <Button
            onClick={onOpenEditor}
            border="2px solid #7069FA"
            p="8px"
            borderRadius="8px"
          >
            Open Editor
          </Button>
          <Modal isOpen={isEditorOpen} onClose={onCloseEditor} motionPreset="slideInBottom">
            <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
            <ModalContent>
              <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
                Editor
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <EditorModal isOpen={isEditorOpen} onClose={onCloseEditor} data={data} onSave={saveDataFromEditor} />
                {data && (
                  <Box marginTop="10px">
                  </Box>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      )}

      {data && (
        <Box py={20} display="flex" flexDirection="column" alignItems="center" gap="16px">
          <Box display="flex" gap="16px">
            <Button
              onClick={() => handleDownloadButtonClick("all")}
              bg="teal.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
            >
              Download all Data
            </Button>
            <Button
              onClick={() => handleDownloadButtonClick("validData")}
              bg="purple.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "purple.600" }}
              _active={{ bg: "purple.700" }}
            >
              Download Valid Data
            </Button>
            <Button
              onClick={() => handleDownloadButtonClick("invalidData")}
              bg="blue.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.700" }}
            >
              Download Invalid Data
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              bg="blue.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.700" }}
            >
              {showPreview ? "Hide Schema Preview" : "Show Schema Preview"}
            </Button>
            <Button
              onClick={uploadDataToAPI}
              bg="blue.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.700" }}
            >
              Upload Data to API
            </Button>
            <Button
              onClick={uploadNewSchemaToAPI}
              bg="blue.500"
              color="black"
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
              _hover={{ bg: "blue.600" }}
              _active={{ bg: "blue.700" }}
            >
              Upload new Schema to API
            </Button>
          </Box>
        </Box>
      )}

      <ReactSpreadsheetImport {...mockRsiValues} isOpen={isOpen} onClose={onClose} onSubmit={setData} />

      {showPreview && previewSchema && (
        <Box pt={64} display="flex" gap="8px" flexDirection="column">
          <b>Schema:</b>
          <Code
            display="flex"
            alignItems="center"
            borderRadius="16px"
            fontSize="12px"
            background="#4A5568"
            color="white"
            p={32}
          >
            <pre>{JSON.stringify(previewSchema, undefined, 4)}</pre>
          </Code>
        </Box>
      )}

      {data && (
        <Box pt={64} display="flex" gap="8px" flexDirection="column">
          <b>Returned data:</b>
          <Code
            display="flex"
            alignItems="center"
            borderRadius="16px"
            fontSize="12px"
            background="#4A5568"
            color="white"
            p={32}
          >
            <pre>{JSON.stringify(data, undefined, 4)}</pre>
          </Code>
        </Box>
      )}
    </>
  )


}

export default Basic