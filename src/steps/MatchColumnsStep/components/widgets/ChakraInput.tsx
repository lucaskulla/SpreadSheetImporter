import { Input } from "@chakra-ui/react"
import React from "react"

const ChakraInput = (props: { onChange: any; onBlur: any; onFocus: any; value?: "" | undefined }) => {
  const { onChange, onBlur, onFocus, value = "" } = props
  return (
    <>
      <Input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} onFocus={onFocus} />
    </>
  )
}

export default ChakraInput
