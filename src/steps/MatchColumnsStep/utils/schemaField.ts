import type { RJSFSchema } from "@rjsf/utils"

export const schemaField: RJSFSchema = {
  type: "object",
  properties: {
    label: {
      type: "string",
    },
    key: {
      type: "string",
    },
    description: {
      type: "string",
    },
    alternateMatches: {
      type: "array",
      items: {
        type: "string",
      },
    },
    validations: {
      type: "array",
      items: {
        $ref: "#/definitions/Validation",
      },
    },
    fieldType: {
      default: "input",
      type: "string",
      enum: ["input", "checkbox", "select"],
    },
    example: {
      type: "string",
    },
  },
  required: ["label", "key", "fieldType"],
  additionalProperties: false,
  definitions: {
    Validation: {
      type: "object",
      properties: {
        rule: {
          type: "string",
          enum: ["required", "unique", "regex"],
        },
        value: {
          type: "string",
        },
        flags: {
          type: "string",
        },
        errorMessage: {
          type: "string",
        },
        level: {
          type: "string",
          enum: ["warning", "error"],
        },
        allowEmpty: {
          type: "boolean",
        },
      },
      required: ["rule", "errorMessage"],
      additionalProperties: false,
    },
  },
}
