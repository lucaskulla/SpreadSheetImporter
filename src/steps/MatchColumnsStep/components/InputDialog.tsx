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
import type { RJSFSchema } from "@rjsf/utils"
import type { Field } from "../../../types"
import ChakraTextarea from "./widgets/ChakraTextarea"
import ChakraSelect from "./widgets/ChakraSelect"
import AlternateMatchesWidget from "./widgets/AlternateMatchesWidget"
import ValidationsField from "./widgets/ValidationsField"
import ChakraInput from "./widgets/ChakraInput"
import { useFieldContext } from "../../../context/FieldProvider"
import { JSX } from "react/jsx-runtime"

//TODO Ende Validierung
//TODO Post der Daten ggf. 5 Seite erstellen

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
    setCreateNewField(false) //TODO decide if needed
    onClose()
  }


  const handleToggleCreateNewField = () => {
    setCreateNewField((prevValue) => !prevValue)
  }

  const schemaField: RJSFSchema = {
    type: "object",
    properties: {
      label: {
        type: "string",
      },
      key: {
        type: "string",
      },
      description: {
        type: "string",
      },
      alternateMatches: {
        type: "array",
        items: {
          type: "string",
        },
      },
      validations: {
        type: "array",
        items: {
          $ref: "#/definitions/Validation",
        },
      },
      fieldType: {
        default: "input",
        enum: ["checkbox", "select", "input"],
      },
      example: {
        type: "string",
      },
    },
    required: ["label", "key", "fieldType"],
    additionalProperties: false,
    definitions: {
      Validation: {
        type: "object",
        properties: {
          rule: {
            type: "string",
            enum: ["required", "unique", "regex"],
          },
          value: {
            type: "string",
          },
          flags: {
            type: "string",
          },
          errorMessage: {
            type: "string",
          },
          level: {
            type: "string",
            enum: ["warning", "error"],
          },
          allowEmpty: {
            type: "boolean",
          },
        },
        required: ["rule", "errorMessage"],
        additionalProperties: false,
      },
    },
  }


  const uiSchema = {
    "ui:rootFieldId": "label",
    "ui:autofocus": true,
    label: {
      "ui:widget": (
        props: JSX.IntrinsicAttributes & { onChange: any; onBlur: any; onFocus: any; value?: "" | undefined },
      ) => <ChakraInput {...props} />,
    },
    key: {
      "ui:widget": (
        props: JSX.IntrinsicAttributes & { onChange: any; onBlur: any; onFocus: any; value?: "" | undefined },
      ) => <ChakraInput {...props} />,
    },
    description: {
      "ui:widget": (props: JSX.IntrinsicAttributes & { onChange: any; onBlur: any; onFocus: any; value: any }) => (
        <ChakraTextarea {...props} />
      ),
    },
    alternateMatches: {
      "ui:widget": (
        props: JSX.IntrinsicAttributes & { id: any; value: any; onChange: any; onBlur: any; onFocus: any },
      ) => <AlternateMatchesWidget {...props} />,
    },
    validations: {
      "ui:widget": (props: JSX.IntrinsicAttributes & { formData: any; onChange: any }) => (
        <ValidationsField {...props} />
      ),
    },
    fieldType: {
      "ui:widget": (
        props: JSX.IntrinsicAttributes & {
          id: any
          options: any
          value: any
          onChange: any
          onBlur: any
          onFocus: any
        },
      ) => <ChakraSelect {...props} />,
    },
    example: {
      "ui:widget": (props: JSX.IntrinsicAttributes & { onChange: any; onBlur: any; onFocus: any; value: any }) => (
        <ChakraTextarea {...props} />
      ),
    },
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
