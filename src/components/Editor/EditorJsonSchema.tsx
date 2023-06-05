import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import fieldsToJsonSchema from "../../utils/fieldsToSchema"

type EditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataEditor: string) => void;
};

const THEMES = {
  light: "light",
  dark: "vs-dark",
}

const EditorModalJSONSchema = ({ isOpen, onClose, onSave }: EditorModalProps) => {
  const [editor1Value, setEditor1Value] = useState("No schema avaiable")
  const [theme, setTheme] = useState(THEMES.dark)

  const handleEditor1Change = useCallback((value: any) => {
    setEditor1Value(value)
  }, [])

  const handleSave = useCallback(() => {
    onSave(editor1Value)
    onClose()
  }, [editor1Value, onSave, onClose])

  useEffect(() => {
    const schemaUsedStorage = localStorage.getItem("schemaUsed")
    const schemaUsed: boolean = schemaUsedStorage ? schemaUsedStorage === "true" : false
    const fields = localStorage.getItem("fieldsList")

    if (fields) {
      const conversion = fieldsToJsonSchema(JSON.parse(fields), schemaUsed)
      setEditor1Value(JSON.stringify(conversion, null, 4))
    }
  }, [])

  const handleEditorValidation = useCallback((markers: any[]) => {
    markers.forEach((marker) => console.log("onValidate:", marker.message))
  }, [])

  const onSaveAndSetEditor1Value = useCallback((dataEditorSchema: any) => {
    setEditor1Value(dataEditorSchema)
    onSave(dataEditorSchema)
  }, [onSave])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
      <ModalContent h="full" maxHeight="none">
        <ModalHeader>Schema Preview2</ModalHeader>
        <Select placeholder="Select theme" onChange={(e) => setTheme(e.target.value)}>
          {Object.entries(THEMES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <ModalCloseButton />
        <Flex justifyContent="flex-end" p={4}>
          <Button onClick={onSaveAndSetEditor1Value}>Save</Button>
        </Flex>
        <ModalBody flex="1" display="flex">
          <Editor
            height="100%"
            width="100%"
            language="JSON"
            theme={theme}
            value={editor1Value}
            onChange={handleEditor1Change}
            onValidate={handleEditorValidation}
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
