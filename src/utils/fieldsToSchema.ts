import type { Field } from "../types"

interface JSONSchema {
  $defs: { [key: string]: any };
  properties: { [key: string]: any };
  $id?: string;
  $schema: string;
  additionalProperties: boolean;
  metamodel_version: string;
  required: string[];
  version?: string;
}

function incrementVersion(version: string): string {
  const parts = version.split(".")
  const lastIndex = parts.length - 1
  parts[lastIndex] = String(Number(parts[lastIndex]) + 1)
  return parts.join(".")
}

function fieldsToJsonSchema(fields: Field<string>[], schemaUsed?: string): JSONSchema {
  console.log("schemaUsed", schemaUsed)

  let nextVersion: string = "0.0.1" //default
  let id: string = "urn:kaapana:newschema" //default


  if (schemaUsed) {
    const versionRegex = /(\d+\.\d+\.\d+)/
    const match = schemaUsed.match(versionRegex)

    if (match) {
      nextVersion = incrementVersion(match[1])
      id = schemaUsed.substring(0, schemaUsed.lastIndexOf(":")) // Extract ID
    } else {
      id = schemaUsed // No version in schemaUsed, use as ID
    }
  }

  const schema: JSONSchema = {
    $defs: {},
    properties: {},
    $id: id,
    $schema: "http://json-schema.org/draft-07/schema#",
    additionalProperties: true,
    metamodel_version: "1.7.0",
    required: [],
    version: nextVersion,
  }


  fields.forEach((field) => {
    const propertyPath = field.label.split(".")
    addPropertyToSchema(schema, propertyPath, field)
  })


  function addPropertyToSchema(schema: JSONSchema, propertyPath: string[], field: Field<string>): void {
    let currentObject = schema

    propertyPath.forEach((propertyName, index) => {
      if (index === propertyPath.length - 1) {
        // Final property in the path
        currentObject.properties[propertyName] = { type: "string", description: field.description }
        if (field.example) currentObject.properties[propertyName].examples = [field.example]

        field.validations?.forEach((validation) => {
          if (validation.rule === "required") schema.required.push(propertyName)
          else if (validation.rule === "regex") currentObject.properties[propertyName].pattern = validation.value
        })

        if (field.alternateMatches) currentObject.properties[propertyName]["x-alternateMatches"] = field.alternateMatches
      } else {
        // Nested property
        if (!currentObject.properties[propertyName]) {
          const definitionName = propertyName
          schema.$defs[definitionName] = { type: "object", properties: {} }
          currentObject.properties[propertyName] = { $ref: `#/$defs/${definitionName}` }
          currentObject = schema.$defs[definitionName]
        } else {
          currentObject = schema.$defs[propertyName]
        }
      }
    })
  }

  return schema
}


export default fieldsToJsonSchema
