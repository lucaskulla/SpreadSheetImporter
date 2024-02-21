import { defaultTheme, ReactSpreadsheetImport } from "./ReactSpreadsheetImport"
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { mockRsiValues } from "./stories/mockRsiValues"
import React, { useCallback, useEffect, useState } from "react"
import type { Data } from "./types"
import { Field, RsiProps } from "./types"
import { saveAs } from "file-saver"
import fieldsToJsonSchema from "./utils/fieldsToSchema"
import apiClient from "./api/apiClient"
import EditorModal from "./components/Editor/EditorModal"
import { JSONSchema7 } from "json-schema"
import EditorModalJSONSchema from "./components/Editor/EditorJsonSchema"
import UploadModal from "./components/UploadToAPI"
import { translations } from "./translationsRSIProps"
import merge from "lodash/merge"
import { rtlThemeSupport } from "./theme"
import { Providers } from "./components/Providers"
import { useSchemaContext } from "./context/SchemaProvider"


export const Basic = () => {
  const [data, setData] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditorOpen, onOpen: onOpenEditor, onClose: onCloseEditor } = useDisclosure()
  const [showPreview, setShowPreview] = useState(false)
  const [previewSchema, setPreviewSchema] = useState<JSONSchema7>()

  const [isOpenJsonEditor, setIsOpenJsonEditor] = useState(false)
  const [schemaRender, setSchemaRender] = useState(false)

  const toast = useToast()

  const [editor1Value, setEditor1Value] = useState("// After import of data the data is displayed here")


  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const [schemaName, setSchemaName] = useState("urn:kaapana:newSchema:0.0.1")

  const {
    isSchemaUsed,
  } = useSchemaContext() // Use the context to get schema-related states and setters

  const handleEditor1Change = (value: string) => {
    const valueAsJSON = JSON.parse(value)
    console.log(valueAsJSON)
    setEditor1Value(valueAsJSON)
  }

  function convertToCSV(data: Data<string>[]): string {
    const header = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(",")).join("\n")

    return `${header}\n${rows}`
  }

  // Function to download data as a CSV file
  function downloadCSV(data: Data<string>[], fileName: string): void {
    console.log(data, "fsjalf")
    if (data.length === 0) {
      errorToast("No data to download")
      return
    }
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, fileName)
  }

  function handleDownloadButtonClick(fileName: string): void {
    try {
      if (data) {
        console.log("Data avaiable", data)
        downloadCSV(data[fileName], fileName + ".csv")
      } else {
        console.log("Data not avaiable")
      }
    } catch (e) {
      errorToast("Error while downloading file, error message: " + e)
    }

  }

  function uploadDataToAPI(): void {
    const urn = localStorage.getItem("schemaToUse")

    if (data && data["validData"]) {
      let errorThrown = false
      data["validData"].forEach((item: any) => {
        // Send a POST request for each item
        apiClient
          .post("/object/" + urn, item, { params: { skip_validation: false } })
          .then((response: any) => {
            console.log(`Data uploaded successfully for item: ${JSON.stringify(item)}`)
          })
          .catch((error: any) => {
            console.error(`Error occurred while uploading data for item: ${JSON.stringify(item)}`)
            console.error(error)
            if (!errorThrown) {
              const errorMessage = error.message || "An unexpected error occurred"
              errorToast(errorMessage)
              errorThrown = true
            }
          })
      })
      if (!errorThrown) {
        toast({
          title: "Upload successful.",
          description: "Your data have been successfully uploaded.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      }
      errorThrown = false

    }
  }

  const errorToast = useCallback(
    (description: string) => {
      toast({
        status: "error",
        variant: "left-accent",
        position: "bottom-left",
        title: "Upload / Download failed",
        description: description,
        isClosable: true,
      })
    },
    [toast],
  )

  useEffect(() => {
    if (schemaRender) {
      const fields = localStorage.getItem("fieldsList")
      if (fields) {
        const conversion = fieldsToJsonSchema(JSON.parse(fields), isSchemaUsed)
        setPreviewSchema(conversion)
        setEditor1Value(JSON.stringify(conversion, null, 4))
      }
    }
  }, [schemaRender])

  function uploadNewSchemaToAPI(): void {
    const fields = localStorage.getItem("fieldsList")
    if (fields) {
      let conversion = fieldsToJsonSchema(JSON.parse(fields), isSchemaUsed)
      conversion["$id"] = localStorage.getItem("schemaName")
      console.log(JSON.stringify(conversion, null, 2), "conversion")
      apiClient
        .post("/schema", conversion)
        .then((r: any) => toast({
          title: "Upload successful.",
          description: "Your schema have been successfully uploaded.",
          status: "success",
          duration: 5000,
          isClosable: true,
        }))
        .catch((e: { message: string }) => {
          const errorMessage = e.message || "An unexpected error occurred"
          errorToast(errorMessage)
        })
    }
  }


  function saveDataFromEditor(dataEditor: string, changesInKeys: any): void {
    const dataAsJSON = JSON.parse(dataEditor)
    setData(dataAsJSON)
    let changeKeyOriginial = false
    let changeKeyNew = false

    const fieldsList = localStorage.getItem("fieldsList")
    if (!fieldsList) return

    let fieldsAsJSON = JSON.parse(fieldsList)

    const changesKeyInOriginal = changesInKeys[1]
    const changesKeyInNew = changesInKeys[3]

    if (changesKeyInOriginal.length > 0) {
      fieldsAsJSON = fieldsAsJSON.filter((jsonObject: any) => !changesKeyInOriginal.includes(jsonObject.key))
      changeKeyOriginial = true
      toast({
        title: "Changes in the data detected, it appears that properties have been removed.",
        description: "The fields list has been updated",
        status: "info",
        duration: 5000,
        isClosable: true,
      })
    }

    if (changesKeyInNew.length > 0) {
      changeKeyNew = true
      changesKeyInNew.forEach((key: string) => {
        if (fieldsAsJSON.find((field: any) => field.key === key)) {
          console.log("Field already exists")
        } else {
          const fieldToAdd: Field<string> = {
            alternateMatches: [key],
            description: "This field element is automatically generated after changes in the data",
            example: "",
            fieldType: {
              type: "input",
            },
            key: key,
            label: key,
            validations: [],
          }
          fieldsAsJSON.push(fieldToAdd)
        }
      })

      toast({
        title: "Changes in the data detected, it appears that properties have been added.",
        description: "The fields list has been updated",
        status: "info",
        duration: 5000,
        isClosable: true,
      })
    }

    localStorage.removeItem("fieldsList")
    localStorage.setItem("fieldsList", JSON.stringify(fieldsAsJSON))

    if (changeKeyOriginial || changeKeyNew) {
      setIsOpenJsonEditor(true)
    }
  }


  function removeOldStorage(): void {
    localStorage.removeItem("fieldsList")
    localStorage.removeItem("field")
    localStorage.removeItem("schemaToUse")
    localStorage.removeItem("schemaFromAPI")
    localStorage.removeItem("newField")
    localStorage.removeItem("schema")
    localStorage.removeItem("fields")
    localStorage.removeItem("schemaName")


  }

  const props: RsiProps<any> = mockRsiValues
  const mergedTranslations =
    props.translations !== translations
      ? merge(translations, props.translations)
      : translations
  const mergedThemes = props.rtl
    ? merge(defaultTheme, rtlThemeSupport, props.customTheme)
    : merge(defaultTheme, props.customTheme)

  return (
    <Providers theme={mergedThemes} rsiValues={{ ...props, translations: mergedTranslations }}>
      <>
        <Box py={20} display="flex" flexDirection="column" alignItems="center" gap="16px">
          <Text fontSize="2xl" mb="4">1. Import and harmonize</Text>
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
          <Box py={20} display="flex" flexDirection="column" alignItems="center" gap="16px">
            <Text fontSize="2xl" mb="4">2. Modify the data or schema</Text>
            <Button
              onClick={onOpenEditor}
              border="2px solid #718096"
              borderRadius="8px"
            >
              Edit data
            </Button>

            <Button
              onClick={() => setIsOpenJsonEditor(!isOpenJsonEditor)}
              p="8px"
              border="2px solid #718096"
              borderRadius="8px"
            >
              Edit schema
            </Button>

            <EditorModalJSONSchema isOpen={isOpenJsonEditor} onClose={() => setIsOpenJsonEditor(false)}
                                   onSave={handleEditor1Change} />
            <Modal isOpen={isEditorOpen} onClose={onCloseEditor} motionPreset="slideInBottom">
              <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
              <ModalContent>
                <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
                  Editor
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <EditorModal isOpen={isEditorOpen} onClose={onCloseEditor} data={data} onSave={saveDataFromEditor}
                  />
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
            <Text fontSize="2xl" mb="4">3. Export the data</Text>
            <Box display="flex" gap="16px">
              <Button
                onClick={() => handleDownloadButtonClick("all")}
                p="8px"
                border="2px solid #718096"
                borderRadius="8px"
              >
                Download data as .csv
              </Button>
              <Button
                onClick={() => handleDownloadButtonClick("invalidData")}
                p="8px"
                border="2px solid #718096"
                borderRadius="8px"
              >
                Download invalid data as .csv
              </Button>
              <Button
                onClick={() => setUploadModalOpen(true)}
                p="8px"
                border="2px solid #718096"
                borderRadius="8px"
              >
                Open upload dialog
              </Button>
              <UploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUploadData={uploadDataToAPI}
                onUploadSchema={uploadNewSchemaToAPI}
                setSchemaName={setSchemaName}
              />

            </Box>
          </Box>
        )}
        <ReactSpreadsheetImport {...mockRsiValues} isOpen={isOpen} onClose={onClose} onSubmit={setData} />
      </>
    </Providers>
  )


}

export default Basic
