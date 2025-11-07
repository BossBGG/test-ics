import {ApiResponse} from "~/api/api";
import axios, {AxiosInstance, CancelTokenSource} from "axios";

export interface ListTableData {
  // draw: number,
  search: string,
  // search_fields: string,
  sort: string[],
  page: number,
  size: number,
  limit: number,
}

export interface TableMetaData {
  limit: number;
  page: number;
  nextPage: number | null;
  previousPage: number | null;
  totalCount: number;
  totalPages: number;
}

export interface TableResponse<T = unknown> {
  items: T[],
  data: T[],
  total: number
  totalPages: number
  draw: number,
  meta: TableMetaData
}


export interface TableListApiResult<T = unknown> {
  api: Promise<ApiResponse<TableResponse<T>>>;
  cancelToken: CancelTokenSource
}

export interface TableListApi<T = unknown> {
  callApi: (data: ListTableData) => Promise<TableListApiResult<T>>
}

export function createTableListApi<T = unknown> (path: string, api: AxiosInstance): TableListApi<T> {
  return {
    callApi: (data: ListTableData) => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      return Promise.resolve({
          api: api.get(path, {params: data, cancelToken: source.token }),
          cancelToken: source
        }
      )
    }
  }
}
