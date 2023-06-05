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
import React, { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import fieldsToJsonSchema from "../../utils/fieldsToSchema"

type EditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataEditor: string) => void;
};

const EditorModalJSONSchema = ({ isOpen, onClose, onSave }: EditorModalProps) => {
  const [editor1Value, setEditor1Value] = useState("No schema avaiable")
  const [theme, setTheme] = useState("dark")

  const handleEditor1Change = (value: any) => {
    setEditor1Value(value)
  }

  const handleSave = () => {
    onSave(editor1Value)
    onClose()
  }


  useEffect(() => {
    const fields = localStorage.getItem("fieldsList")
    const schemaUsedStorage = localStorage.getItem("schemaUsed")
    const schemaUsed: boolean = schemaUsedStorage ? schemaUsedStorage === "true" : false
    if (fields) {
      const conversion = fieldsToJsonSchema(JSON.parse(fields), schemaUsed)
      setEditor1Value(JSON.stringify(conversion, null, 4))
    }
  }, [])


  function handleEditorValidation(markers: any[]) {
    markers.forEach((marker) => console.log("onValidate:", marker.message))
  }

  const onSaveAndSetEditor1Value = (dataEditorSchema: any) => {
    setEditor1Value(dataEditorSchema)
    onSave(dataEditorSchema)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
      <ModalContent h="full" maxHeight="none">
        <ModalHeader>Schema Preview2</ModalHeader>
        <Select placeholder="Select theme" onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="vs-dark">Dark</option>
        </Select>
        <ModalCloseButton />
        <Flex justifyContent="flex-end" p={4}>
          <Button onClick={() =>
            onSaveAndSetEditor1Value(editor1Value)
          }>Save</Button>
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
