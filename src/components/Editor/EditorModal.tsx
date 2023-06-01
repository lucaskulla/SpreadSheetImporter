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
  isOpen: boolean,
  onClose: () => void,
  data: RawData[],
  onSave: (dataEditor: string) => void
};

const EditorModal = ({ isOpen, onClose, data, onSave }: EditorModalProps) => {
  const [theme, setTheme] = useState("dark")
  let dataAsString = ""
  let dataAsJson = {}
  try {


    // @ts-ignore
    if (data["validData"]) {
      // @ts-ignore
      dataAsString = JSON.stringify(data["validData"], undefined, 4)
    } else {
      // @ts-ignore
      dataAsString = JSON.stringify(data, undefined, 4)
    }


  } catch (e) {
    console.log(e)
  }
  // try {
  //   // @ts-ignore
  //   dataAsJson = JSON.parse(data)["validData"]
  // } catch (e) {
  //   console.log(e)
  // }

  const [editor2, setEditor2] = useState(dataAsString || "// You can write your code here...")
  const [editor3, setEditor3] = useState(dataAsString || "// You can write your code here...")

  // @ts-ignore
  const [editor1Value, setEditor1Value] = useState(
    dataAsString || "// After import of data the data is displayed here",
  )
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
  const [savedData, setSavedData] = useState(
    dataAsString || "// After import of data the data is displayed here",
  )

  const handleEditor1Change = (value: any, event: any) => {
    setEditor1Value(value)
  }

  const handleEditor2Change = (value: any, event: any) => {
    setEditor2Value(value)
  }

  const handleEditor3Change = (value: any, event: any) => {
    setEditor3Value(value)
  }

  const executeCode = () => {
    try {
      const data = dataAsString
      // Add an IIFE wrapper to the user's function that provides data
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
          //result = JSON.parse(result)
          //setEditor3Value(JSON.stringify(result, null, 2))
          setEditor3Value(result)
          setSavedData(result)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (error: any) {
      setEditor3Value(error.toString())
    }
  }

  const editorHeight = "calc(45vh - 10px)" // -20px to account for the gap

  /*  useEffect(() => {
      setEditor1Value(dataAsString || "// After import of data the data is displayed here")
      setEditor2Value(
        "//in the variable data is the data from the left side stored\n\nfunction foot(){" +
        "\n" +
        "let dataLeftSide = JSON.parse(data)" +
        "\n" +
        "return JSON.stringify(dataLeftSide, null, 4) " +
        "\n}",
      )
      setEditor3Value("// The new data is displayed here")
      setSavedData(dataAsString || "// After import of data the data is displayed here")
    }, [dataAsString])*/

  const onSaveAndSetEditor1Value = (dataEditor: string) => {
    setEditor1Value(dataEditor)
    onSave(savedData)
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="full" isCentered={false}>
      <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
      <ModalContent h="full" maxHeight="none">
        <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
          Editor
          <ModalCloseButton />
          <Button onClick={() =>
            onSaveAndSetEditor1Value(editor3Value)
          }>Save</Button>
        </ModalHeader>
        <ModalBody p={0} h="full">
          <Select placeholder="Select theme" onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="vs-dark">Dark</option>
          </Select>
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
                  onChange={handleEditor2Change}
                  options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    automaticLayout: true,
                  }}
                />
                <Box color="white">
                  <Button
                    onClick={executeCode}
                    size="md"
                    height="48px"
                    width="calc(55vh - 0px)"
                    borderColor="green.500"
                  >
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
                //onChange={handleEditor3Change}
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
