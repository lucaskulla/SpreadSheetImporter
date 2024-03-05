import React, { useEffect, useState } from "react"
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useStyleConfig,
} from "@chakra-ui/react"
import Editor from "@monaco-editor/react"
import fieldsToJsonSchema from "../../utils/fieldsToSchema"
import { useSchemaContext } from "../../context/SchemaProvider"
import { useFieldContext } from "../../context/FieldProvider"
import type { themeOverrides } from "../../theme"

type EditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const THEMES = {
  light: "light",
  dark: "vs-dark",
}

const EditorModalJSONSchema = ({ isOpen, onClose }: EditorModalProps) => {
  const [editorValue, setEditorValue] = useState("No schema available")
  const [theme, setTheme] = useState<string>(THEMES.light)

  const { schemaToUse, setSelectedSchema } = useSchemaContext()
  const { getFields } = useFieldContext()

  useEffect(() => {
    const fields = getFields()
    if (fields) {
      const conversion = fieldsToJsonSchema(fields, schemaToUse)
      setEditorValue(JSON.stringify(conversion, null, 4))
    }
  }, [getFields, schemaToUse])

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value
    if (newTheme in THEMES) {
      setTheme(THEMES[newTheme as keyof typeof THEMES])
    } else {
      console.error("Selected theme does not exist")
    }
  }

  const handleSave = () => {
    setSelectedSchema(JSON.parse(editorValue))
    onClose()
  }

  const styles = useStyleConfig("MatchColumnsStep") as typeof themeOverrides["components"]["MatchColumnsStep"]["baseStyle"]


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schema Editor</ModalHeader>
        <Heading {...styles.heading}></Heading>

        <ModalCloseButton />
        <Select placeholder="Select theme" value={theme} onChange={handleThemeChange} mb={4}>
          {Object.entries(THEMES).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </Select>
        <Flex justifyContent="flex-end" mt={4}>
          <Button colorScheme="blue" onClick={handleSave}>Save</Button>
        </Flex>
        <ModalBody>
          <Editor
            height="90vh"
            width="100%"
            language="JSON"
            theme={theme}
            value={editorValue}
            onChange={(value) => setEditorValue(value ?? "")}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: "line",
              automaticLayout: true,
            }}
          />


        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditorModalJSONSchema
