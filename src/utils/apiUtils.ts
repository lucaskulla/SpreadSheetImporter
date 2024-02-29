// apiUtils.ts
import apiClient from "../api/apiClient"
import { Data } from "../types"

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Adjust this to directly accept the same parameters as your upload function.
  onUploadData: (options: UploadOptions) => Promise<void>;
  onUploadSchema: () => void;
  setSchemaName: (name: string) => void;
}

interface Item {
  [key: string]: string;
}

export type UploadOptions = {
  urn: string | undefined;
  data: Data<any>;
  params?: Record<string, any>;
  onSuccess: () => void;
  onError: (error: string) => void;
};


export async function uploadDataToAPI({ urn, data, params, onSuccess, onError }: UploadOptions): Promise<void> {

  if (!data) {
    onError("No valid data to upload")
    return
  }

  // Use Promise.all to handle asynchronous operations on all items simultaneously
  try {
    if (data) {
      //TODO
      // @ts-ignore
      await Promise.all(data.map(item =>
        apiClient.post(`/object/${urn}`, item, {
          ...(params && { params }),
        }),
      ))

      console.log("All data uploaded successfully")
      onSuccess()
    }
  } catch
    (error: any) { // Consider narrowing this catch clause if possible
    console.error("Error occurred while uploading data:", error)
    onError(error.message || "An unexpected error occurred")
  }
}
