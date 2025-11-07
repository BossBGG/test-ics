import api, {ApiResponse} from "~/api/api";
import {AnnouncementFilter, NewsData} from "~/data/newsData";
import {createTableListApi, TableListApi, TableMetaData} from "~/api/table_api";
import {AxiosRequestConfig} from "axios";

const path = 'announcements'
export const getAnnouncementsList: TableListApi<NewsData[]> = createTableListApi(`/v1/${path}`, api);

export function getAnnouncement(params: AxiosRequestConfig<AnnouncementFilter>): Promise<ApiResponse<{items: NewsData[], meta: TableMetaData}>> {
  return api.get(`/v1/${path}`, {params: params})
}

export function createAnnouncement(data: FormData): Promise<ApiResponse> {
  return api.post(`/v1/${path}`, data)
}

export function updateAnnouncementStatus(uuid: string, data: FormData): Promise<ApiResponse> {
  return api.patch(`/v1/${path}/${uuid}`, data)
}

export function deleteAnnouncement(uuid: string): Promise<ApiResponse> {
  return api.delete(`/v1/${path}/${uuid}`)
}

export function getDetailAnnouncement(id: string): Promise<ApiResponse<NewsData>> {
  return api.get(`/v1/${path}/${id}`)
}
