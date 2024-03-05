import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { getEnvVar } from "../utils/getEnvVar"

type ApiResponse<T> = AxiosResponse<T>;

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    })
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url })
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data })
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data })
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data })
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url })
  }

  // Simplified request method with direct throwing of the caught error
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.axiosInstance.request<T>(config)
  }
}

let baseURL: string

if (getEnvVar("REACT_APP_DEV_MODE") === "true") {
  baseURL = getEnvVar("REACT_APP_API_BASE_URL")
  console.log("dev mode enabled")
} else {
  baseURL = `${window.location.protocol}//${window.location.host}/persistence/api`
}

console.log("Using API base URL:", baseURL)

const apiClient = new ApiClient(baseURL)


export default apiClient
