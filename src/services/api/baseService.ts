import type { AxiosPromise } from "axios";
import axios from "axios";

import config from "@/config";
import type { IBaseQueryParams } from "@/types/api/queryParams";
import type { IPaginatedResponse } from "@/types/api/pagination";

// Generic service factory for CRUD operations
export function createBaseService<T, CreateRequest, UpdateRequest>(
  endpoint: string
) {
  return {
    list(query: IBaseQueryParams): AxiosPromise<IPaginatedResponse<T>> {
      return axios.get(config.BACKEND_BASE_URL + `/api/${endpoint}`, {
        params: query,
      });
    },
    listOne(id: string): AxiosPromise<T> {
      return axios.get(config.BACKEND_BASE_URL + `/api/${endpoint}/${id}`);
    },
    update(id: string, payload: UpdateRequest): AxiosPromise<T> {
      return axios.put(
        config.BACKEND_BASE_URL + `/api/${endpoint}/${id}`,
        payload
      );
    },
    create(payload: CreateRequest): AxiosPromise<T> {
      return axios.post(config.BACKEND_BASE_URL + `/api/${endpoint}`, payload);
    },
    delete(id: string): AxiosPromise<T> {
      return axios.delete(config.BACKEND_BASE_URL + `/api/${endpoint}/${id}`);
    },
  };
}
