import type { Fields, RsiProps } from "../types"
import { defaultRSIProps } from "../ReactSpreadsheetImport"

let fields: Fields<string> = []

const mockComponentBehaviourForTypes = <T extends string>(props: RsiProps<T>) => props

export const mockRsiValues = mockComponentBehaviourForTypes({
  
  ...defaultRSIProps, //LK: ohne geht Storybook "MatchColumnsStep" nicht
  fields: fields,
  onSubmit: (data) => {
    console.log(data.all.map((value) => value))
  },
  isOpen: true,
  onClose: () => {
  },
  uploadStepHook: async (data) => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(data), 4000)
    })
    return data
  },
  selectHeaderStepHook: async (hData, data) => {
    await new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            headerValues: hData,
            data,
          }),
        4000,
      )
    })
    return {
      headerValues: hData,
      data,
    }
  },
  // Runs after column matching and on entry change, more performant
  matchColumnsStepHook: async (data) => {
    await new Promise((resolve) => {
      setTimeout(() => resolve(data), 4000)
    })
    return data
  },
})

export const editableTableInitialData = [
  {
    name: "Hello",
    surname: "Hello",
    age: "123123",
    team: "one",
    is_manager: true,
  },
  {
    name: "Hello",
    surname: "Hello",
    age: "12312zsas3",
    team: "two",
    is_manager: true,
  },
  {
    name: "Whooaasdasdawdawdawdiouasdiuasdisdhasd",
    surname: "Hello",
    age: "123123",
    team: undefined,
    is_manager: false,
  },
  {
    name: "Goodbye",
    surname: "Goodbye",
    age: "111",
    team: "two",
    is_manager: true,
  },
]

export const headerSelectionTableFields = [
  ["text", "num", "select", "bool"],
  ["Hello", "123", "one", "true"],
  ["Hello", "123", "one", "true"],
  ["Hello", "123", "one", "true"],
]
