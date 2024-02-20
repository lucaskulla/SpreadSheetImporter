import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface GenericAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  headerTitle: string;
  bodyText: string;
  cancelButtonText: string;
  confirmButtonText: string;
  confirmButtonColorScheme?: string;
}

export const GenericAlertBox = ({
                                  isOpen,
                                  onClose,
                                  onConfirm,
                                  headerTitle,
                                  bodyText,
                                  cancelButtonText,
                                  confirmButtonText,
                                  confirmButtonColorScheme = "red", // Default color scheme for the confirm button
                                }: GenericAlertProps) => {
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{headerTitle}</AlertDialogHeader>
          <AlertDialogBody>{bodyText}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              {cancelButtonText}
            </Button>
            <Button colorScheme={confirmButtonColorScheme} onClick={onConfirm} ml={3}>
              {confirmButtonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
