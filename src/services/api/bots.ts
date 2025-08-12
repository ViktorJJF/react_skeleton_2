import { type AxiosPromise } from 'axios';
import apiClient from '@/services/api/apiClient';
import type {
  IBotListQuery,
  ICreateBotRequest,
  ICreateBotResponse,
  IDeleteBotResponse,
  IListBotsResponse,
  IListOneBotResponse,
  IUpdateBotRequest,
  IUpdateBotResponse,
  IBulkDeleteBotsRequest,
  IBulkDeleteBotsResponse,
} from '@/types/entities/bots';

export default {
  list(query: IBotListQuery = {}): AxiosPromise<IListBotsResponse> {
    return apiClient.get('/api/v1/bots', {
      params: query,
    });
  },
  listOne(id: string): AxiosPromise<IListOneBotResponse> {
    return apiClient.get('/api/v1/bots/' + id);
  },
  update(
    id: string,
    payload: IUpdateBotRequest,
  ): AxiosPromise<IUpdateBotResponse> {
    return apiClient.put(`/api/v1/bots/${id}`, payload);
  },
  create(payload: ICreateBotRequest): AxiosPromise<ICreateBotResponse> {
    return apiClient.post('/api/v1/bots', payload);
  },
  delete(id: string): AxiosPromise<IDeleteBotResponse> {
    return apiClient.delete(`/api/v1/bots/${id}`);
  },
  bulkDelete(
    payload: IBulkDeleteBotsRequest,
  ): AxiosPromise<IBulkDeleteBotsResponse> {
    return apiClient.delete('/api/v1/bots/bulk', {
      data: payload,
    });
  },
};
