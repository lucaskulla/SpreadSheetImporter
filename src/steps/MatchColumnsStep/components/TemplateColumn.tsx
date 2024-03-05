import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  useStyleConfig,
} from "@chakra-ui/react"
import { useRsi } from "../../../hooks/useRsi"
import type { Column } from "../MatchColumnsStep"
import { ColumnType } from "../MatchColumnsStep"
import { MatchIcon } from "./MatchIcon"
import type { Field, Fields } from "../../../types"
import type { Translations } from "../../../translationsRSIProps"
import { MatchColumnSelect } from "../../../components/Selects/MatchColumnSelect"
import type { Styles } from "./ColumnGrid"
import React, { useEffect, useMemo, useState } from "react"
import { SubMatchingSelect } from "./SubMatchingSelect"
import ModalAddField from "./InputDialog"
import { EditOrAddIcon } from "./AddEditIcon"
import type { JSONSchema7 } from "json-schema"
import { useSchemaContext } from "../../../context/SchemaProvider"
import { useFieldContext } from "../../../context/FieldProvider"

const getAccordionTitle = <T extends string>(fields: Fields<string>, column: Column<T>, translations: Translations) => {
  const fieldLabel = fields.find((field) => "value" in column && field.key === column.value)!.label
  return `${translations.matchColumnsStep.matchDropdownTitle} ${fieldLabel} (${
    "matchedOptions" in column && column.matchedOptions.length
  } ${translations.matchColumnsStep.unmatched})`
}

type TemplateColumnProps<T extends string> = {
  onChange: (val: T, index: number) => void
  onSubChange: (val: T, index: number, option: string) => void
  column: Column<T>
  schema: JSONSchema7
  convertedSchema: Fields<string>
}

export const TemplateColumn = <T extends string>({ column, onChange, onSubChange }: TemplateColumnProps<T>) => {
  const { translations } = useRsi<T>()
  const styles = useStyleConfig("MatchColumnsStep") as Styles
  const isIgnored = column.type === ColumnType.ignored
  const isChecked = useMemo(() => {
    return [ColumnType.matched, ColumnType.matchedCheckbox, ColumnType.matchedSelectOptions].includes(column.type)
  }, [column.type])
  const isSelect = "matchedOptions" in column

  const {
    isSchemaUsed,
  } = useSchemaContext()

  const {
    addField,
    getFields,
  } = useFieldContext()

  const fields = getFields()

  const selectOption = useMemo(() => fields.map(({ label, key }) => ({ value: key, label })), [fields])
  const selectValue = selectOption.find(({ value }) => "value" in column && column.value === value)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const handleFormSubmit = (inputValue: Field<string>) => {
    addField(inputValue) //schau ob es geklappt hat, davor über localstorage
  }


  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const addMissingFieldsFromHeader = () => {
    if (!isSchemaUsed) {
      const fields = getFields() || []

      // Helper function to add a field only if it doesn't exist
      const addFieldIfMissing = (key: string, label: string, description: string) => {
        if (!fields.some(f => f.key === key)) {
          addField({
            alternateMatches: [label],
            description,
            example: "",
            fieldType: { type: "input" },
            key,
            label,
            validations: [],
          })
        }
      }

      // Add field based on current header if it doesn't exist
      const header = column.header
      const headerCapitalized = header.charAt(0).toUpperCase() + header.slice(1).toLowerCase().replace(/_/g, " ")
      addFieldIfMissing(header, headerCapitalized, "This field element is automatically generated")

      // Ensure an "id" field exists
      addFieldIfMissing("id", "ID", "This id field is automatically generated")
    }
  }

  useEffect(() => {
    addMissingFieldsFromHeader()
  }, [])


  return (
    <Flex minH={10} w="100%" flexDir="column" justifyContent="center">
      {isIgnored ? (
        <Text sx={styles.selectColumn.text}>{translations.matchColumnsStep.ignoredColumnText}</Text>
      ) : (
        <>
          <Flex alignItems="center" minH={10} w="100%">
            <Box flex={1}>
              <MatchColumnSelect //LK: replace MatchColumnSelect with AddColumn and you can add test :)
                placeholder={translations.matchColumnsStep.selectPlaceholder}
                value={selectValue} //LK: Wenn ich hier was veränder, funktioniert select column nicht mehr.
                onChange={(value) => onChange(value?.value as T, column.index)}
                options={selectOption}
                name={column.header}
              />
            </Box>
            <MatchIcon isChecked={isChecked} />
            <Tooltip label={!isChecked ? "Add a field" : "Edit Text"} aria-label="A tooltip">
              <Button
                leftIcon={<EditOrAddIcon isEdit={isChecked} />}
                variant="light"
                onClick={handleOpenModal}
                boxSize={1}
              ></Button>
            </Tooltip>
            <Box>
              <ModalAddField
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                column={column}
              />
            </Box>
          </Flex>
          {isSelect && (
            <Flex width="100%">
              <Accordion allowMultiple width="100%">
                <AccordionItem border="none" py={1}>
                  <AccordionButton
                    _hover={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                    px={0}
                    py={4}
                    data-testid="accordion-button"
                  >
                    <AccordionIcon />
                    <Box textAlign="left">
                      <Text sx={styles.selectColumn.accordionLabel}>
                        {getAccordionTitle<T>(fields, column, translations)}
                      </Text>
                    </Box>
                  </AccordionButton>
                  <AccordionPanel pb={4} pr={3} display="flex" flexDir="column">
                    {column.matchedOptions.map((option) => (
                      <SubMatchingSelect option={option} column={column} onSubChange={onSubChange} key={option.entry} />
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          )}
        </>
      )}
    </Flex>
  )
}
