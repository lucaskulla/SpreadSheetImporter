import { ReactSpreadsheetImport } from "./ReactSpreadsheetImport"
import {
    Box,
    Button,
    Code,
    Link, Modal,
    ModalBody,
    ModalCloseButton, ModalContent,
    ModalHeader,
    ModalOverlay, Select,
    useDisclosure,
    useToast
} from "@chakra-ui/react"
import { mockRsiValues } from "./stories/mockRsiValues"
import { useCallback, useState } from "react"
import type { Data } from "./types"
import { saveAs } from "file-saver"
import fieldsToJsonSchema from "./utils/fieldsToSchema"
import apiClient from "./api/apiClient"

import Editor from '@monaco-editor/react';
import EditorModal from "./components/Editor/EditorModal"

export const Basic = () => {
    const [data, setData] = useState<any>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isEditorOpen, onOpen: onOpenEditor, onClose: onCloseEditor } = useDisclosure()

    const toast = useToast()

    function convertToCSV(data: Data<string>[]): string {
        const header = Object.keys(data[0]).join(",")
        const rows = data.map((row) => Object.values(row).join(",")).join("\n")

        return `${header}\n${rows}`
    }

    // Function to download data as a CSV file
    function downloadCSV(data: Data<string>[], fileName: string): void {
        const csvData = convertToCSV(data)
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
        saveAs(blob, fileName)
    }

    function handleDownloadButtonClick(fileName: string): void {
        if (data) {
            downloadCSV(data[fileName], fileName + ".csv")
        } else {
            console.log("Data not avaiable")
        }
    }

    const errorToast = useCallback(
        (description: string) => {
            toast({
                status: "error",
                variant: "left-accent",
                position: "bottom-left",
                title: "Upload failed",
                description: description,
                isClosable: true,
            })
        },
        [toast],
    )

    function uploadNewSchemaToAPI(): void {
        const fields = localStorage.getItem("fieldsList")
        const schemaUsedStorage = localStorage.getItem("schemaUsed")
        const schemaUsed: boolean = schemaUsedStorage ? schemaUsedStorage === "true" : false
        if (fields) {
            const conversion = fieldsToJsonSchema(JSON.parse(fields), schemaUsed)
            console.log(JSON.stringify(conversion, null, 2), "conversion")
            apiClient
                .post("/schema", conversion)
                .then((r: any) => console.log(r))
                .catch((e: { message: string }) => {
                    const errorMessage = e.message || "An unexpected error occurred"
                    errorToast(errorMessage)
                })
        }
    }

    function removeOldStorage(): void {
        localStorage.removeItem("fieldsList")
        localStorage.removeItem("field")
        localStorage.removeItem("schemaToUse")
        localStorage.removeItem("schemaUsed")
        localStorage.removeItem("schemaFromAPI")
        localStorage.removeItem("newField")
        localStorage.removeItem("schema")
    }


    const [language, setLanguage] = useState('javascript');

    const handleLanguageChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setLanguage(event.target.value);
    };
    const [theme, setTheme] = useState("dark");

    const handleThemeChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setTheme(event.target.value);
    };

    const [apiStatus, setApiStatus] = useState("");

    const apiUrl = ""; // your API URL
    const apiOptions = {}; // your API options

    // function to make API call
    const callApi = () => {
        fetch(apiUrl, apiOptions)
            .then((response) => {
                if (response.ok) {
                    // successful API call
                    setApiStatus("success");
                } else {
                    // failed API call
                    setApiStatus("failure");
                }
            })
            .catch((error) => {
                // error in API call
                console.error('There was an error!', error);
                setApiStatus("error");
            });
    }

    return (
        <>
            <Box py={20} display="flex" gap="8px" alignItems="center">
                <Button
                    onClick={() => {
                        removeOldStorage()
                        onOpen()
                    }}
                    border="2px solid #7069FA"
                    p="8px"
                    borderRadius="8px"
                >
                    Open Flow
                </Button>
                (make sure you have a file to upload)
            </Box>
            <Link href="./exampleFile.csv" border="2px solid #718096" p="8px" borderRadius="8px" download="exampleCSV">
                Download example file
            </Link>

            <Box py={20} display="flex" gap="8px" alignItems="center">
                <Button
                    onClick={onOpenEditor}
                    border="2px solid #7069FA"
                    p="8px"
                    borderRadius="8px"
                >
                    Open Editor
                </Button>
                <Modal isOpen={isEditorOpen} onClose={onCloseEditor} motionPreset="slideInBottom">
                    <ModalOverlay style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />
                    <ModalContent>
                        <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
                            Editor
                            <ModalCloseButton />
                        </ModalHeader>
                        <ModalBody>
                            <EditorModal isOpen={isEditorOpen} onClose={onCloseEditor} data={data} />
                            {data && (
                                <Box marginTop="10px">

                                </Box>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>

            {data && (
                <Box py={20} display="flex" flexDirection="column" alignItems="center" gap="16px">
                    <Box display="flex" gap="16px">
                        <Button
                            onClick={() => handleDownloadButtonClick("all")}
                            bg="teal.500"
                            color="black"
                            p="8px"
                            border="2px solid #718096"
                            borderRadius="8px"
                            _hover={{ bg: "teal.600" }}
                            _active={{ bg: "teal.700" }}
                        >
                            Download all Data
                        </Button>
                        <Button
                            onClick={() => handleDownloadButtonClick("validData")}
                            bg="purple.500"
                            color="black"
                            p="8px"
                            border="2px solid #718096"
                            borderRadius="8px"
                            _hover={{ bg: "purple.600" }}
                            _active={{ bg: "purple.700" }}
                        >
                            Download Valid Data
                        </Button>
                        <Button
                            onClick={() => handleDownloadButtonClick("invalidData")}
                            bg="blue.500"
                            color="black"
                            p="8px"
                            border="2px solid #718096"
                            borderRadius="8px"
                            _hover={{ bg: "blue.600" }}
                            _active={{ bg: "blue.700" }}
                        >
                            Download Invalid Data
                        </Button>
                        <Button
                            onClick={() => uploadNewSchemaToAPI()}
                            bg="blue.500"
                            color="black"
                            p="8px"
                            border="2px solid #718096"
                            borderRadius="8px"
                            _hover={{ bg: "blue.600" }}
                            _active={{ bg: "blue.700" }}
                        >
                            Upload new Schema to API
                        </Button>
                    </Box>
                </Box>
            )}

            /*<ReactSpreadsheetImport {...mockRsiValues} isOpen={isOpen} onClose={onClose} onSubmit={setData} />*/
            {data && (
                <Box pt={64} display="flex" gap="8px" flexDirection="column">
                    <b>Returned data:</b>
                    <Code
                        display="flex"
                        alignItems="center"
                        borderRadius="16px"
                        fontSize="12px"
                        background="#4A5568"
                        color="white"
                        p={32}
                    >
                        <pre>{JSON.stringify(data, undefined, 4)}</pre>
                    </Code>
                </Box>
            )}
        </>
    )


}

export default Basic