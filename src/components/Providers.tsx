import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { createContext, ReactNode } from "react"
import type { RsiProps } from "../types"
import type { CustomTheme } from "../theme"
import { useFieldContext } from "../context/FieldProvider"

export const RsiContext = createContext({} as any)

type ProvidersProps<T extends string> = {
  children: ReactNode
  theme: CustomTheme
  rsiValues: RsiProps<T>
}

export const rootId = "chakra-modal-rsi"

export const Providers = <T extends string>({ children, theme, rsiValues }: ProvidersProps<T>) => {
  const mergedTheme = extendTheme(theme)


  const {
    getFields,
  } = useFieldContext()


  if (!getFields()) {
    //war eigenltich !rsiValues.fields
    throw new Error("Fields must be provided to react-spreadsheet-import")
  }

  return (
    <RsiContext.Provider value={rsiValues}>
      <ChakraProvider>
        {/* cssVarsRoot used to override RSI defaultTheme but not the rest of chakra defaultTheme */}
        <ChakraProvider cssVarsRoot={`#${rootId}`} theme={mergedTheme}>
          {children}
        </ChakraProvider>
      </ChakraProvider>
    </RsiContext.Provider>
  )
}
