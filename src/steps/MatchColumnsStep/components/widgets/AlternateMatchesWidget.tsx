import React from "react"
import type { MultiValue } from "chakra-react-select"
import { FormControl } from "@chakra-ui/react"
import ReactSelect from "react-select"

const AlternateMatchesWidget = (props: { id: any; value: any; onChange: any; onBlur: any; onFocus: any }) => {
  const { id, value, onChange, onBlur, onFocus } = props

  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState(
    value.map((val: { label: any; value: any }) => ({ value: val, label: val })),
  )

  const handleTagsChange = (selectedOptions: MultiValue<any>) => {
    const updatedOptions = selectedOptions.map((option) => ({ value: option.value, label: option.value }))
    onChange(updatedOptions)
  }

  const handleInputChange = (inputValue: React.SetStateAction<string>) => {
    setInputValue(inputValue)
  }

  const handleKeyDown = (event: { key: any; preventDefault: () => void }) => {
    if (!inputValue) return
    switch (event.key) {
      case "Enter":
      case "Tab":
        event.preventDefault()
        setInputValue("")
        setOptions([...options, { value: inputValue, label: inputValue }])
        onChange([...value, inputValue])
        break
      default:
        break
    }
  }

  const handleBlur = () => {
    onBlur(id, value)
  }

  const handleFocus = () => {
    onFocus(id, value)
  }

  const selectedOptions = (value || []).map((val: { label: any; value: any }) => ({ value: val, label: val }))

  return (
    <FormControl id={id}>
      <ReactSelect
        isMulti
        value={selectedOptions}
        options={options}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleTagsChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Type and press enter..."
      />
    </FormControl>
  )
}

export default AlternateMatchesWidget
