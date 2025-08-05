import type { IApiResponse } from "@/types/api/response";
import type { IPaginatedResponse } from "@/types/api/pagination";
import type { IBaseQueryParams } from "@/types/api/queryParams";

// Base Bot interface matching the API response
export interface IBot {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request payload interfaces
export interface ICreateBotRequest {
  name: string;
  isActive?: boolean;
}

export interface IUpdateBotRequest {
  name?: string;
  isActive?: boolean;
}

// API Response interfaces
export type IListBotsResponse = IPaginatedResponse<IBot>;

export type IListOneBotResponse = IApiResponse<IBot>;

export type ICreateBotResponse = IApiResponse<IBot>;

export type IUpdateBotResponse = IApiResponse<IBot>;

export type IDeleteBotResponse = IApiResponse<IBot>;

// Query parameters for list endpoint
export type IBotListQuery = IBaseQueryParams;
