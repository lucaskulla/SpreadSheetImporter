import React, { useEffect, useState } from "react"
import {
  Box,
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
  useToast,
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
  onUploadData: () => void;
  onUploadSchema: () => void;
  setSchemaName: (name: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onUploadData,
                                                   onUploadSchema,
                                                   setSchemaName,
                                                 }) => {
  const [uploadData, setUploadData] = useState(false)
  const [uploadSchema, setUploadSchema] = useState(false)
  // const [schemaName, setSchemaNameLocal] = useState("")
  const toast = useToast()

  const isSchemaNameValid = (name: string | undefined) => {
    if (!name) return false
    const regex = /^urn:[a-zA-Z0-9]+:[a-zA-Z0-9]/
    return regex.test(name)
  }

  const
    {
      schemaToUse,
      setSchemaToUse,
    }
      = useSchemaContext()

  useEffect(() => {

    if (schemaToUse !== "urn:kaapana:newSchema:0.0.1") {
      setSchemaName(schemaToUse || "")
    }
  }, [])

  const handleSubmit = () => {
    if (uploadSchema && schemaToUse) {
      if (!isSchemaNameValid(schemaToUse)) {
        toast({
          status: "error",
          variant: "left-accent",
          position: "bottom-left",
          title: "Invalid schema name",
          description: "Schema name does not match the pattern: urn:String:String:SemverVersion",
          isClosable: true,
        })
        return
      }
      setSchemaToUse(schemaToUse)
      onUploadSchema()
    }
    if (uploadData) {
      onUploadData()
    }

    onClose()
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
            <Box my={2}>
              <Checkbox isChecked={uploadData} onChange={(e) => setUploadData(e.target.checked)}>
                Upload Data
              </Checkbox>
            </Box>
            <Box my={2}>
              <Checkbox isChecked={uploadSchema} onChange={(e) => setUploadSchema(e.target.checked)}>
                Upload Schema
              </Checkbox>
            </Box>
            {uploadSchema && (
              <Box my={4}>
                <FormControl>
                  <Input
                    value={schemaToUse}
                    onChange={(e) => setSchemaToUse(e.target.value)}
                    placeholder="Enter schema name"
                    isInvalid={!isSchemaNameValid(schemaToUse)}
                  />
                  <FormHelperText>{isSchemaNameValid(schemaToUse) ? "Valid Schema Name" : "Invalid Schema Name"}</FormHelperText>
                  <FormHelperText>Example: urn:namespace:schemaName</FormHelperText>
                </FormControl>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Providers>
  )
}

export default UploadModal
