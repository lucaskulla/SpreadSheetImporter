import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import React, { useState } from "react"
import type { JSONSchema7 } from "json-schema"


type EditorModalProps = {
  isOpen: boolean,
  onClose: () => void,
  jsonSchema: JSONSchema7,
  onSave: (newSchema: JSONSchema7) => void
}

const jsonSchemaEditor = ({ isOpen, onClose, jsonSchema, onSave }: EditorModalProps) => {

  const [schema, setSchema] = useState(jsonSchema)

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const { onOpen } = useDisclosure()


  const setSchemaAndClose = (schema: JSONSchema7) => {
    setSchema(schema)
    console.log(schema)
  }


  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.4)" }} />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <pre>{JSON.stringify(schema, null, 2)}</pre>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}
export default jsonSchemaEditor
