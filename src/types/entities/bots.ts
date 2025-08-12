import type { IApiResponse } from '@/types/api/response';
import type { IPaginatedResponse } from '@/types/api/pagination';
import type { IBaseQueryParams } from '@/types/api/queryParams';

// Base Bot interface matching the API response
export interface IBot {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Request payload interfaces
export interface ICreateBotRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface IUpdateBotRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// Legacy types (keep for backward compatibility)
export type IListBotsResponse = IPaginatedResponse<IBot>;
export type IListOneBotResponse = IApiResponse<IBot>;
export type ICreateBotResponse = IApiResponse<IBot>;
export type IUpdateBotResponse = IApiResponse<IBot>;
export type IDeleteBotResponse = IApiResponse<IBot>;

// Query parameters for list endpoint
export interface IListBotQuery extends IBaseQueryParams {
  search?: string;
  is_active?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Bulk operations types
export interface IBulkCreateBotsRequest {
  bots: Array<{
    name: string;
    description?: string;
    is_active?: boolean;
  }>;
}

export type IBulkCreateBotsResponse = IApiResponse<{
  created: number;
  items: IBot[];
}>;

export interface IBulkUpdateBotsRequest {
  updates: Array<{
    id: number;
    data: {
      name?: string;
      description?: string;
      is_active?: boolean;
    };
  }>;
}

export type IBulkUpdateBotsResponse = IApiResponse<{
  modified: number;
  items: IBot[];
}>;

export interface IBulkDeleteBotsRequest {
  ids: number[];
}

export type IBulkDeleteBotsResponse = IApiResponse<{
  deleted: number;
  items: IBot[];
}>;
