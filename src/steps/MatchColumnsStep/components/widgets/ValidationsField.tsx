import React from "react"
import { Box, Button } from "@chakra-ui/react"
import ValidationEditor from "./ValidationEditor"

const ValidationsField = (props: { formData: any; onChange: any }) => {
  const { formData, onChange } = props

  const [currentValidations, setCurrentValidations] = React.useState(formData || [])

  const updateValidation = (index: React.Key | null | undefined, updatedValidation: any) => {
    const newValidations = currentValidations.slice()
    if (index === null || index === undefined) return
    // @ts-ignore
    newValidations[index] = updatedValidation
    setCurrentValidations(newValidations)
    onChange(newValidations)
  }

  const handleAddValidation = () => {
    setCurrentValidations([...currentValidations, {}])
    onChange([...currentValidations, {}])
  }

  return (
    <Box>
      {currentValidations.map((validation: any, index: React.Key | null | undefined) => (
        <ValidationEditor
          key={index}
          index={index}
          validation={validation}
          onChange={(updatedValidation: any) => updateValidation(index, updatedValidation)}
        />
      ))}
      <Button onClick={handleAddValidation} mt={2} colorScheme="gray">
        Add Validation
      </Button>
    </Box>
  )
}

export default ValidationsField
