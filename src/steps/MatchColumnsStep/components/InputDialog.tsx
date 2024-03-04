import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useStyleConfig,
} from "@chakra-ui/react"
import Form from "@rjsf/core"
import React, { useEffect, useState } from "react"
import type { themeOverrides } from "../../../theme"
import { Column, hasValue } from "../MatchColumnsStep"
import validator from "@rjsf/validator-ajv8"
import type { Field } from "../../../types"
import { useFieldContext } from "../../../context/FieldProvider"
import { schemaField } from "../utils/schemaField"
import { uiSchema } from "./schemaDialog"


interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: Field<string>) => void
  column: Column<string>
}


const ModalAddField: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, column }) => {
  const {
    addField,
    getSpecificField,
  } = useFieldContext()

  const [createNewField, setCreateNewField] = useState(false)

  const styles = useStyleConfig("MatchColumnsStep") as typeof themeOverrides["components"]["MatchColumnsStep"]["baseStyle"]

  // Reset createNewField whenever the modal closes
  useEffect(() => {
    if (!isOpen) {
      setCreateNewField(false)
    }
  }, [isOpen])


  const handleSubmit = (data: any) => {
    const { formData } = data
    //This if is needed because officially FieldType is an array, however, in the schema above it is just an enum, because it is easier to display. Here is the array created
    if (typeof formData.fieldType === "string") {
      formData.fieldType = { type: formData.fieldType }
    }


    const fieldData: Field<string> = formData
    addField(fieldData)
    onSubmit(fieldData)
    setCreateNewField(false)
    onClose()
  }


  const handleToggleCreateNewField = () => {
    setCreateNewField((prevValue) => !prevValue)
  }


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Heading {...styles.heading}></Heading>
        <ModalOverlay />
        <ModalContent {...styles.userTable}>
          <ModalHeader>Edit or Add a Item Field</ModalHeader>
          <ModalBody>
            <Form
              schema={schemaField}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              formData={createNewField ? undefined : (hasValue(column) ? getSpecificField(column.value) : undefined)}
              validator={validator}
            >
              <Button type="submit">save</Button>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleToggleCreateNewField}>
              {createNewField ? "Modify Existing Field" : "Create New Field"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalAddField
