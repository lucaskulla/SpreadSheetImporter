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

const THEMES = {
  light: "light",
  dark: "vs-dark",
}

const EditorModal = ({ isOpen, onClose, data, onSave }: EditorModalProps) => {
  const [theme, setTheme] = useState(THEMES.dark)
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

  const [editorLeftValue, setEditorLeftValue] = useState(dataAsString || "// After import of data the data is displayed here")
  const [editorCodeValue, setEditorCodeValue] = useState(
    " //in the variable data is the data from the left side stored\n \n" +
    "function foot(){" +
    "\n " +
    "let dataLeftSide = JSON.parse(data)" +
    "\n" +
    "return JSON.stringify(dataLeftSide, null, 4) " +
    "\n}",
  )
  const [editorRightValue, setEditorRightValue] = useState("// The new data is displayed here")

  const handleEditorLeftChange = (value: any) => {
    setEditorLeftValue(value)
  }

  const executeCode = () => {
    try {
      const data = dataAsString
      const wrappedCode = `(${editorCodeValue})();`
      let result = eval(wrappedCode)

      if (typeof result === "function") {
        try {
          result = result(data)
          setEditorRightValue(JSON.stringify(result, null, 2))
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          setEditorRightValue(result)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (error: any) {
      setEditorRightValue(error.toString())
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

  const onSaveAndSeteditorLeftValue = (dataEditorSchema: string) => {
    const changesInKeys = checkWhichPropertiesAdded(dataEditorSchema)
    setEditorLeftValue(dataEditorSchema)
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
            <Button onClick={() => onSaveAndSeteditorLeftValue(editorRightValue)}>
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
                defaultValue={editorLeftValue || "// You can write your code here..."}
                value={editorLeftValue || "// You can write your code here..."}
                onChange={handleEditorLeftChange}
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
                  defaultValue={editorCodeValue || "no file selected"}
                  onChange={(value: any) => setEditorCodeValue(value)}
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
                  original={editorLeftValue}
                  modified={editorRightValue}
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
                defaultValue={editorRightValue}
                value={editorRightValue}
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
