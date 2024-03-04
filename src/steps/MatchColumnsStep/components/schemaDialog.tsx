import { JSX } from "react/jsx-runtime"
import ChakraInput from "./widgets/ChakraInput"
import ChakraTextarea from "./widgets/ChakraTextarea"
import AlternateMatchesWidget from "./widgets/AlternateMatchesWidget"
import ValidationsField from "./widgets/ValidationsField"
import ChakraSelect from "./widgets/ChakraSelect"
import React from "react"

export const uiSchema = {
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
