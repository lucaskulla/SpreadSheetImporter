import React, { useCallback, useState } from "react"
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { RsiProps } from "../types"
import merge from "lodash/merge"
import { rtlThemeSupport } from "../theme"
import { Providers } from "./Providers"
import { defaultTheme } from "../ReactSpreadsheetImport"
import { mockRsiValues } from "../stories/mockRsiValues"
import { translations } from "../translationsRSIProps"
import { useSchemaContext } from "../context/SchemaProvider"


interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadData: () => Promise<void>;
  onUploadSchema: () => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadData, onUploadSchema }) => {
  const [uploadData, setUploadData] = useState(false)
  const [uploadSchema, setUploadSchema] = useState(false)
  const [uploadOngoing, setUploadOngoing] = useState(false)
  const { schemaToUse, setSchemaToUse } = useSchemaContext()

  const isSchemaNameValid = useCallback((name: string) => {
    const regex = /^urn:[a-zA-Z0-9]+:[a-zA-Z0-9]+(?<!\d+\.\d+\.\d+)$/
    return !!name && regex.test(name)
  }, [])


  const handleSubmit = async () => {
    setUploadOngoing(true) // Start loading indication
    try {
      if (uploadSchema && schemaToUse) {
        await onUploadSchema()
        console.log("Schema uploaded successfully")
      }
      if (uploadData) {
        await onUploadData()
        console.log("Data uploaded successfully")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUploadOngoing(false) // Stop loading indication regardless of outcome
      onClose() // Ensure modal closure happens after all operations
    }
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload your data and schema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Checkbox isChecked={uploadData} onChange={(e) => setUploadData(e.target.checked)}>
              Upload your Data
            </Checkbox>
            <br />
            <Checkbox isChecked={uploadSchema} onChange={(e) => setUploadSchema(e.target.checked)} my={4}>
              Upload your Schema
            </Checkbox>
            {uploadSchema && (
              <FormControl isInvalid={!isSchemaNameValid(schemaToUse || "")}>
                <Input
                  value={schemaToUse || ""} // Fallback to empty string if schemaToUse is undefined
                  onChange={(e) => setSchemaToUse(e.target.value)}
                  placeholder="Enter schema name"
                />
                <FormHelperText>{isSchemaNameValid(schemaToUse || "") ? "Valid Schema Name" : "Invalid Schema Name"}</FormHelperText>
                <FormHelperText>Example: urn:namespace:schemaName</FormHelperText>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} mr={3} isLoading={uploadOngoing}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Providers>
  )
}

export default UploadModal
