import { FormControl, Select } from "@chakra-ui/react"
import React from "react"

const ChakraSelect = (props: { id: any; options: any; value: any; onChange: any; onBlur: any; onFocus: any }) => {
  let { id, options, value, onChange, onBlur, onFocus } = props

  const valueCorrect = value && typeof value === "object" && "type" in value ? value.type : value

  const handleChange = (event: { target: { value: any } }) => {
    onChange(event.target.value)
  }

  const handleBlur = () => {
    onBlur(id, value)
  }

  const handleFocus = () => {
    onFocus(id, value)
  }

  return (
    <FormControl id={id}>
      <Select value={valueCorrect || ""} onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}>
        {options.enumOptions.map(
          (
            // @ts-ignore
            { value, label },
            // @ts-ignore
            index,
          ) => (
            <option key={index} value={value}>
              {label}
            </option>
          ),
        )}
      </Select>
    </FormControl>
  )
}

export default ChakraSelect
