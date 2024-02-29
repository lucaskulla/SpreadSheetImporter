import type { Field, Fields, RegexValidation, RequiredValidation, Validation } from "../types"

type JSONSchema = {
  [key: string]: any
}

let fieldsList: Fields<string> = []

function createValidations(property: JSONSchema): Validation[] {
  const validations: Validation[] = []

  if (property.required) {
    const requiredValidation: RequiredValidation = {
      rule: "required",
    }
    validations.push(requiredValidation)
  }

  if (property.pattern) {
    const regexValidation: RegexValidation = {
      rule: "regex",
      value: property.pattern,
      errorMessage: `The input must match the pattern ${property.pattern}`,
    }
    validations.push(regexValidation)
  }

  return validations
}

function createAlternateMatches(property: JSONSchema): string[] | undefined {
  return property["x-alternateMatches"] || undefined
}

function removeDuplicatesFromString(strings: string): string {
  const stringSplit = strings.split(".")
  const uniqueStrings = new Set<string>()

  for (const str of stringSplit) {
    if (uniqueStrings.has(str)) { /* empty */
    }
    uniqueStrings.add(str)
  }

  return Array.from(uniqueStrings).join(".")
}

// {
//
//   "createdOn": "2021-06-29T14:00:00.000Z",
//   "allowedWorkflows": [
//     {
//       "airflowDagId": "1",
//       "zweitesFeld": "2"
//     },
//     {
//       "airflowDagId": "2",
//       "zweitesFeld": "2"
//     }
//     ],
//   "automaticUpdate": true,
//
//
// }

// data -> Unique
// federation -> mehrfach
// instance.items -> unique
// instance.allowedWorfklows(array).1 -> mehrfach
// instance.allowedWorfklows(array).2a -> mehrfach
// instance.allowedWorfklows(array).2b -> mehrfach
// instance.allowedWorfklows(array).3a -> mehrfach
// instance.allowedWorfklows(array).3b -> mehrfach
// instance.automatic_update -> unique

function processProperty(key: string, property: JSONSchema, defs: JSONSchema, prefix?: string): void {
  let label = prefix ? `${prefix}.${key}` : key

  label = removeDuplicatesFromString(label)

  if (property.$ref) {
    const refPath = property.$ref.startsWith("#/$defs/")
      ? property.$ref.slice(8).split("/")
      : property.$ref.slice(2).split("/")
    const refProperty = refPath.reduce((acc: { [x: string]: any }, curr: string | number) => acc[curr], defs)
    if (refProperty.properties) {
      for (const refKey in refProperty.properties) {
        processProperty(refKey, refProperty.properties[refKey], defs, label)
      }
      return
    }
  }

  if (property.type === "array" && property.items) {
    if (property.items.$ref) {
      processProperty(key, property.items, defs, label)
    } else {
      if (label.includes(key)) {
        processProperty(label, property.items, defs)
      } else {
        processProperty(key, property.items, defs)
      }
    }
    return
  }

  const field: Field<string> = {
    label,
    key: label,
    fieldType: { type: "input" },
  }

  if (property.description) {
    field.description = property.description
  }

  if (property.examples && property.examples.length > 0) {
    field.example = property.examples[0]
  }

  // Create validations for the property
  field.validations = createValidations(property)

  // Create alternateMatches for the property
  field.alternateMatches = createAlternateMatches(property)


  fieldsList.push(field)
}

function jsonSchemaToFields(schema: JSONSchema): Fields<string> {
  fieldsList = []
  const defs = schema.$defs || {}

  const properties = schema.properties

  for (const key in properties) {
    const property = properties[key]
    processProperty(key, property, defs)
  }

  return fieldsList
}

export default jsonSchemaToFields
