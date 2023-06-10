import React, { useState } from "react"
import {
  Box,
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import { RawData } from "../../types"

type EditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: RawData[];
  onSave: (dataEditor: string, changesInKeys: any) => void;
};

const EditorModal = ({ isOpen, onClose, data, onSave }: EditorModalProps) => {
  const originalData = data
  const [theme, setTheme] = useState("dark")
  let dataAsString = ""
  try {
    // @ts-ignore
    if (data["validData"]) {
      // @ts-ignore
      dataAsString = JSON.stringify(data["validData"], undefined, 4)
    } else {
      dataAsString = JSON.stringify(data, undefined, 4)
    }
  } catch (e) {
    console.log(e)
  }

  const [editor1Value, setEditor1Value] = useState(dataAsString || "// After import of data the data is displayed here")
  const [editor2Value, setEditor2Value] = useState(
    " //in the variable data is the data from the left side stored\n \n" +
    "function foot(){" +
    "\n " +
    "let dataLeftSide = JSON.parse(data)" +
    "\n" +
    "return JSON.stringify(dataLeftSide, null, 4) " +
    "\n}",
  )
  const [editor3Value, setEditor3Value] = useState("// The new data is displayed here")

  const handleEditor1Change = (value: any) => {
    setEditor1Value(value)
  }

  const executeCode = () => {
    try {
      const data = dataAsString
      const wrappedCode = `(${editor2Value})();`
      let result = eval(wrappedCode)

      if (typeof result === "function") {
        try {
          result = result(data)
          setEditor3Value(JSON.stringify(result, null, 2))
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          setEditor3Value(result)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (error: any) {
      setEditor3Value(error.toString())
    }
  }

  const editorHeight = "calc(45vh - 10px)" // -20px to account for the gap

  function checkWhichPropertiesAdded(modified: string) {
    const modifiedJSON = JSON.parse(modified)
    const originalJSON = data

    const getKeys = (obj: any) => obj?.validData ? Object.keys(obj.validData[0]) : Object.keys(obj[0])
    const filterUniqueKeys = (arr1: string[], arr2: string[]) => arr1.filter(key => !arr2.includes(key))

    try {
      const originalKeys = getKeys(originalJSON)
      const modifiedKeys = getKeys(modifiedJSON)

      const keysOnlyInOriginal = filterUniqueKeys(originalKeys, modifiedKeys)
      const keysOnlyInModified = filterUniqueKeys(modifiedKeys, originalKeys)

      return ["keysOnlyInOriginal", keysOnlyInOriginal, "keysOnlyInModified", keysOnlyInModified]
    } catch (error) {
      console.error(error)
    }
  }

  const onSaveAndSetEditor1Value = (dataEditorSchema: string) => {
    const changesInKeys = checkWhichPropertiesAdded(dataEditorSchema)
    setEditor1Value(dataEditorSchema)
    onSave(dataEditorSchema, changesInKeys)
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="full" isCentered={false}>
      <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
      <ModalContent h="full" maxHeight="none">
        <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
          Editor
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody p={0} h="full">

          <Select placeholder="Select theme" onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="vs-dark">Dark</option>
          </Select>
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button onClick={() => onSaveAndSetEditor1Value(editor3Value)}>
              Save
            </Button>
          </Box>
          <Grid templateRows="1fr 3fr" gap={6} h="full" p={1}>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <Editor
                height="100%"
                width="100%"
                language={"JSON"}
                theme={theme}
                defaultValue={editor1Value || "// You can write your code here..."}
                value={editor1Value || "// You can write your code here..."}
                onChange={handleEditor1Change}
                options={{
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: "line",
                  automaticLayout: true,
                }}
              />
              <div>
                <Editor
                  height={editorHeight}
                  width="100%"
                  language={"JavaScript"}
                  theme={theme}
                  defaultValue={editor2Value || "no file selected"}
                  onChange={(value: any) => setEditor2Value(value)}
                  options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    automaticLayout: true,
                  }}
                />
                <Box display="flex" justifyContent="center" mt={4}>
                  <Button onClick={executeCode}>
                    Execute
                  </Button>
                </Box>
                <DiffEditor
                  height={editorHeight}
                  width="100%"
                  language={"JSON"}
                  theme={theme}
                  original={editor1Value}
                  modified={editor3Value}
                  options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    automaticLayout: true,
                  }}
                />
              </div>
              <Editor
                height="100%"
                width="100%"
                language={"JavaScript"}
                theme={theme}
                defaultValue={editor3Value}
                value={editor3Value}
                options={{
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: true,
                  cursorStyle: "line",
                  automaticLayout: true,
                }}
              />
            </Grid>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditorModal
