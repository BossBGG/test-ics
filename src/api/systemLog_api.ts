import type { ApiResponse } from "./api";
import api from "./api";
import {createTableListApi} from "~/api/table_api";

export interface SystemLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  systemType?: string;
  logType?: string;
  from?: string;
  to?: string;
  resourceName?: string;
}

export interface SystemLogResponseDto {
  id: number;
  uuid: string;
  systemType: string | null;
  logType: string | null;
  detail: string | null;
  ipAddress: string | null;
  username: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userProfileImageUrl: string | null;
  hasDetail: boolean;
  createdAt: string;
}

export interface SystemLogDetailResponseDto {
  id: number;
  attributeNo: number | null;
  attributeKey: string | null;
  attributeName: string | null;
  fromValue: string | null;
  toValue: string | null;
  createdAt: string;
  createdBy: string | null;
}

export interface SystemLogDetailQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Pagination
export interface PaginationMetaDto {
  page: number;
  limit: number;
  previousPage: number | null;
  nextPage: number | null;
  totalCount: number;
  totalPages: number;
}

export interface SystemLogListResponseDto {
  meta: PaginationMetaDto;
  items: SystemLogResponseDto[];
}

export interface SystemLogDetailListResponseDto {
  meta: PaginationMetaDto;
  items: SystemLogDetailResponseDto[];
}

const path = "system-logs";

export const getSystemLogList = createTableListApi(`v1/${path}`, api)

export function getSystemLogDetail(
  uuid: string,
): Promise<ApiResponse<SystemLogResponseDto>> {
  return api.get(`/v1/${path}/${uuid}`);
}

export const getSystemLogDetailList = (uuid: string) => createTableListApi(`/v1/${path}/${uuid}/details`, api)
