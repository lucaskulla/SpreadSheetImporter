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

const baseURL: string = getEnvVar("REACT_APP_API_BASE_URL")
if (!baseURL) throw new Error("REACT_APP_API_BASE_URL environment variable is not set")
const apiClient = new ApiClient(baseURL)


export default apiClient
