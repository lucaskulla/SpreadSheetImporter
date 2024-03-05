import { Textarea } from "@chakra-ui/react"
import React from "react"

const ChakraTextarea = (props: { onChange: any; onBlur: any; onFocus: any; value: any }) => {
  const { onChange, onBlur, onFocus, value } = props
  return (
    <>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} onFocus={onFocus} />
    </>
  )
}

export default ChakraTextarea
