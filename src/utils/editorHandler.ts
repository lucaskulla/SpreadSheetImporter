import { Dispatch, SetStateAction } from "react"
import { Field, Fields } from "../types"
import { useToast } from "@chakra-ui/react"

// Assuming useToast is used within a React component or custom hook
export const saveDataFromEditor = ():
  ((dataEditor: string, changesInKeys: any, setData: Dispatch<SetStateAction<any>>, fieldsList: Fields<string>, setIsOpenJsonEditor: Dispatch<SetStateAction<boolean>>) => void) => {
  const toast = useToast()

  return (dataEditor: string, changesInKeys: any, setData: Dispatch<SetStateAction<any>>, fieldsList: Fields<string>, setIsOpenJsonEditor: Dispatch<SetStateAction<boolean>>) => {
    try {
      const dataAsJSON = JSON.parse(dataEditor)
      setData(dataAsJSON)

      let changeKeyOriginal = false
      let changeKeyNew = false

      const [_, changesKeyInOriginal, __, changesKeyInNew] = changesInKeys

      if (changesKeyInOriginal.length > 0) {
        fieldsList = fieldsList.filter((field: Field<string>) => !changesKeyInOriginal.includes(field.key))
        changeKeyOriginal = true
        toast({
          title: "Changes in the data detected",
          description: "Properties have been removed. The fields list has been updated.",
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }

      if (changesKeyInNew.length > 0) {
        changeKeyNew = true
        changesKeyInNew.forEach((key: string) => {
          if (!fieldsList.some((field: Field<string>) => field.key === key)) {
            fieldsList.push({
              key,
              label: key,
              description: "This field was automatically generated based on changes in the data.",
              fieldType: { type: "input" },
              validations: [],
            })
          }
        })

        toast({
          title: "Changes in the data detected",
          description: "Properties have been added. The fields list has been updated.",
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }

      if (changeKeyOriginal || changeKeyNew) {
        setIsOpenJsonEditor(true)
      }
    } catch (error) {
      console.error("Failed to parse editor data:", error)
      toast({
        title: "Data Parsing Error",
        description: "There was an error parsing the data from the editor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }
}
