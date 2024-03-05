import React from "react"
import { Box, Checkbox, FormControl, FormLabel, Input, Select } from "@chakra-ui/react"

const ValidationEditor = ({
                            validation,
                            onChange,
                          }: {
  index: React.Key | null | undefined
  validation: any
  onChange: (updatedValidation: any) => void
}) => {
  const [currentValidation, setCurrentValidation] = React.useState(validation)

  const handleFieldChange = (field: string, value: string | boolean) => {
    setCurrentValidation({ ...currentValidation, [field]: value })
    onChange({ ...currentValidation, [field]: value })
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <FormControl>
        <FormLabel>Rule</FormLabel>
        <Select value={currentValidation.rule || ""} onChange={(e) => handleFieldChange("rule", e.target.value)}>
          <option value="">Select a rule</option>
          <option value="required">Required</option>
          <option value="unique">Unique</option>
          <option value="regex">Regex</option>
        </Select>
      </FormControl>
      {currentValidation.rule === "regex" && (
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Input value={currentValidation.value || ""} onChange={(e) => handleFieldChange("value", e.target.value)} />
        </FormControl>
      )}
      {currentValidation.rule === "regex" && (
        <FormControl>
          <FormLabel>Flags</FormLabel>
          <Input value={currentValidation.flags || ""} onChange={(e) => handleFieldChange("flags", e.target.value)} />
        </FormControl>
      )}
      <FormControl>
        <FormLabel>Error Message</FormLabel>
        <Input
          value={currentValidation.errorMessage || ""}
          onChange={(e) => handleFieldChange("errorMessage", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Level</FormLabel>
        <Select value={currentValidation.level || ""} onChange={(e) => handleFieldChange("level", e.target.value)}>
          <option value="">Select a level</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Select>
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Allow Empty</FormLabel>
        <Checkbox
          isChecked={currentValidation.allowEmpty || false}
          onChange={(e) => handleFieldChange("allowEmpty", e.target.checked)}
        />
      </FormControl>
    </Box>
  )
}

export default ValidationEditor
