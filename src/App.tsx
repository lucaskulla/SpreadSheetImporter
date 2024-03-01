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
} from "@chakra-ui/react"
import { mockRsiValues } from "./stories/mockRsiValues"
import React, { useState } from "react"
import { RsiProps } from "./types"
import EditorModal from "./components/Editor/EditorModal"
import EditorModalJSONSchema from "./components/Editor/EditorJsonSchema"
import UploadModal from "./components/UploadToAPI"
import { translations } from "./translationsRSIProps"
import merge from "lodash/merge"
import { rtlThemeSupport } from "./theme"
import { Providers } from "./components/Providers"
import { useSchemaContext } from "./context/SchemaProvider"
import { useFieldContext } from "./context/FieldProvider"
import { handleDownloadButtonClick } from "./utils/csvHanlder"
import { useApi } from "./utils/apiHandler"
import { saveDataFromEditor } from "./utils/editorHandler"


export const Basic = () => {

  const props: RsiProps<any> = mockRsiValues
  const mergedTranslations =
    props.translations !== translations
      ? merge(translations, props.translations)
      : translations
  const mergedThemes = props.rtl
    ? merge(defaultTheme, rtlThemeSupport, props.customTheme)
    : merge(defaultTheme, props.customTheme)


  const [data, setData] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditorOpen, onOpen: onOpenEditor, onClose: onCloseEditor } = useDisclosure()

  const [isOpenJsonEditor, setIsOpenJsonEditor] = useState(false)

  const [uploadModalOpen, setUploadModalOpen] = useState(false)


  const {
    schemaToUse,
  } = useSchemaContext() // Use the context to get schema-related states and setters

  const {
    getFields,
  } = useFieldContext()

  const { uploadDataToAPI, uploadNewSchemaToAPI } = useApi()


  const onUploadData = uploadDataToAPI(data, schemaToUse)
  const onUploadSchema = uploadNewSchemaToAPI(schemaToUse, getFields())


  const handleEditorChange = (value: string) => {
    const valueAsJSON = JSON.parse(value)
    console.log(valueAsJSON)
  }


  return (
    <Providers theme={mergedThemes} rsiValues={{ ...props, translations: mergedTranslations }}>
      <>
        <Box py={20} display="flex" flexDirection="column" alignItems="center" gap="16px">
          <Text fontSize="2xl" mb="4">1. Import and harmonize</Text>
          <Button
            onClick={() => {
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
                                   onSave={handleEditorChange} />
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
                onClick={() => handleDownloadButtonClick("all", data)}
                p="8px"
                border="2px solid #718096"
                borderRadius="8px"
              >
                Download data as .csv
              </Button>
              <Button
                onClick={() => handleDownloadButtonClick("invalidData", data)}
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
                onUploadData={onUploadData}
                onUploadSchema={onUploadSchema}
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
