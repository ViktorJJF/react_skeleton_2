import type { IApiResponse } from "@/types/api/response";
import type { IPaginatedResponse } from "@/types/api/pagination";
import type { IBaseQueryParams } from "@/types/api/queryParams";

// Base Bot interface matching the API response
export interface IBot {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request payload interfaces
export interface ICreateBotRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface IUpdateBotRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// API Response interfaces
export type IBotListResponse = IPaginatedResponse<IBot>;
export type IBotResponse = IApiResponse<IBot>;

// Legacy types (keep for backward compatibility)
export type IListBotsResponse = IPaginatedResponse<IBot>;
export type IListOneBotResponse = IApiResponse<IBot>;
export type ICreateBotResponse = IApiResponse<IBot>;
export type IUpdateBotResponse = IApiResponse<IBot>;
export type IDeleteBotResponse = IApiResponse<IBot>;

// Query parameters for list endpoint
export interface IBotListQuery extends IBaseQueryParams {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Bulk operations types
export interface IBulkCreateBotsRequest {
  bots: Array<{
    name: string;
    description?: string;
    isActive?: boolean;
  }>;
}

export type IBulkCreateBotsResponse = IApiResponse<{
  created: number;
  items: IBot[];
}>;

export interface IBulkUpdateBotsRequest {
  updates: Array<{
    id: string;
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    };
  }>;
}

export type IBulkUpdateBotsResponse = IApiResponse<{
  modified: number;
  items: IBot[];
}>;

export interface IBulkDeleteBotsRequest {
  ids: string[];
}

export type IBulkDeleteBotsResponse = IApiResponse<{
  deleted: number;
  items: IBot[];
}>;
