import axios, { type AxiosPromise } from "axios";
import config from "@/config";
import type {
  IBotListQuery,
  ICreateBotRequest,
  ICreateBotResponse,
  IDeleteBotResponse,
  IListBotsResponse,
  IListOneBotResponse,
  IUpdateBotRequest,
  IUpdateBotResponse,
} from "@/types/entities/bots";

export default {
  list(query: IBotListQuery): AxiosPromise<IListBotsResponse> {
    return axios.get(config.BACKEND_BASE_URL + "/api/bots", {
      params: query,
    });
  },
  listOne(id: string): AxiosPromise<IListOneBotResponse> {
    return axios.get(config.BACKEND_BASE_URL + "/api/bots/" + id);
  },
  update(
    id: string,
    payload: IUpdateBotRequest
  ): AxiosPromise<IUpdateBotResponse> {
    return axios.put(config.BACKEND_BASE_URL + `/api/bots/${id}`, payload);
  },
  create(payload: ICreateBotRequest): AxiosPromise<ICreateBotResponse> {
    return axios.post(config.BACKEND_BASE_URL + "/api/bots", payload);
  },
  delete(id: string): AxiosPromise<IDeleteBotResponse> {
    return axios.delete(config.BACKEND_BASE_URL + `/api/bots/${id}`);
  },
};
