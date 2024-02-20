import React, { useCallback, useEffect, useState } from 'react';
import type { WorkBook } from 'xlsx';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useStyleConfig,
} from '@chakra-ui/react';
import { DropZone } from './components/DropZone';
import { useRsi } from '../../hooks/useRsi';
import { ExampleTable } from './components/ExampleTable';
import { FadingOverlay } from './components/FadingOverlay';
import type { themeOverrides } from '../../theme';
import apiClient from '../../api/apiClient';
import type { AxiosResponse } from 'axios';
import type { RJSFSchema } from '@rjsf/utils';
import { useSchema } from '../../context/SchemaContext';
import {GenericAlertBox} from "../../components/Alerts/GenericAlert"

interface UploadProps {
  onContinue: (data: WorkBook) => Promise<void>;
}

interface SchemaOption {
  value: string;
  label: string;
}

export const UploadStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyleConfig('UploadStep') as typeof themeOverrides['components']['UploadStep']['baseStyle'];
  const { translations, fields } = useRsi();
  const [fetchedOptions, setFetchedOptions] = useState<SchemaOption[]>([]);
  const { isSchemaUsed, setSchemaUsed, schemaToUse, setSchemaToUse, selectedSchema, setSelectedSchema } = useSchema();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessageAlert, setErrorMessageAlert] = useState('');

  // Function to handle displaying error messages in a centralized way
  const showErrorAlert = (message: string) => {
    setErrorMessageAlert(message); // Assume this function updates state to control the error message displayed in an alert
    setIsAlertOpen(true); // Assume this function toggles the visibility of an alert dialog
    console.error(message);
  };

  useEffect(() => {
    if (!schemaToUse) return; // Do not fetch if schemaToUse is not set

    const fetchSchema = async () => {
      try {
        const response: AxiosResponse<RJSFSchema> = await apiClient.get(`/schema/${schemaToUse}`);
        setSelectedSchema(response.data);
      } catch (error) {
        showErrorAlert('Error fetching schema: ' + error);
      }
    };

    fetchSchema();
  }, [schemaToUse, setSelectedSchema]); // Depend on schemaToUse to trigger fetchSchema


  // Remove the fetchOptions call from here and move it inside a useEffect dependent on isSchemaUsed
  useEffect(() => {
    if (isSchemaUsed) { // Fetch options only if the checkbox is checked
      const fetchOptions = async () => {
        try {
          const response = await apiClient.get('/schema', { params: { include_version: true } });
          if (Array.isArray(response.data)) {
            setFetchedOptions(response.data.map((item) => ({ value: item, label: item })));
          } else {
            showErrorAlert("Error: Unexpected data format. Expected an array.");
          }
        } catch (error) {
          showErrorAlert(`Fetching options failed: ${error}`);
        }
      };

      fetchOptions();
    } else {
      setFetchedOptions([]); // Optionally clear options when the checkbox is unchecked
    }
  }, [isSchemaUsed]); // Add isSchemaUsed as a dependency


  const handleOnContinue = useCallback(async (data: WorkBook) => {
    setIsLoading(true);
    await onContinue(data);
    setIsLoading(false);
  }, [onContinue]);

  const handleSelectBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectValue = e.target.value;
    setSchemaToUse(selectValue);
  };

  const handlePreviewClick = () => setIsPreviewOpen(true);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSchemaUsed(isChecked);
    if (!isChecked) {
      setSchemaToUse(undefined);
    }
  };

  return (
    <ModalBody>
      <Heading sx={styles.heading}>{translations.uploadStep.title}</Heading>
      <Checkbox isChecked={isSchemaUsed} onChange={handleCheckboxChange}>
        Reuse an existing schema
      </Checkbox>
      {isSchemaUsed && (
        <Box>
          <Select
            placeholder="Select an option"
            value={schemaToUse || ''}
            onChange={handleSelectBoxChange}
            mb={4}
            display="inline-block"
            width="auto"
          >
            {fetchedOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button onClick={handlePreviewClick} ml={2}>
            Preview
          </Button>
        </Box>
      )}
      <GenericAlertBox
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => setIsAlertOpen(false)}
        headerTitle="Error"
        bodyText={errorMessageAlert}
        cancelButtonText="Close"
        confirmButtonText="OK"
        confirmButtonColorScheme="red"
      />
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} size="auto">
        <ModalOverlay />
        <ModalContent maxW="80vw" maxH="80vh" overflow="auto">
          <ModalHeader>Schema Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre>{JSON.stringify(selectedSchema, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Text sx={styles.title}>{translations.uploadStep.manifestTitle}</Text>
      <Text sx={styles.subtitle}>{translations.uploadStep.manifestDescription}</Text>
      <Box sx={styles.tableWrapper}>
        <ExampleTable fields={fields} />
        <FadingOverlay />
      </Box>
      <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
    </ModalBody>
  );
};
