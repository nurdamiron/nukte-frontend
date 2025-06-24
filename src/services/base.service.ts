import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from '../config/axios.config';
import { ApiResponse, ApiError } from '../types/api.types';

export class BaseService {
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  protected async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  protected async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  protected async patch<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiError>);
    }
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('Произошла неизвестная ошибка');
  }
}

export default BaseService;