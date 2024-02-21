import React, { ComponentType, ReactElement } from "react"

// Define a type for your component props
interface WidgetProps {
  onChange: (value: any) => void; // Adjust the type of value as needed
  onBlur: () => void;
  onFocus: () => void;
  value?: string;
}

// Use a generic type to allow any component props extending WidgetProps
export const createWidget = (Component: ComponentType<WidgetProps>) =>
  ({ onChange, onBlur, onFocus, value = "" }: WidgetProps): ReactElement => (
    <Component value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
  )
