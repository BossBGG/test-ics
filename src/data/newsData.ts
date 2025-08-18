// src/data/newsData.ts
import {dateFormatMonth} from "~/composables/datetime";

export interface NewsData {
  id: number
  uuid: string
  image: File | string
  title: string
  description: string
  content: string
  publish_date: string
  createdDate: string
  createdAt: string
  publishDateStart: string
  publishDateEnd: string
  isSchedulePublish: '0' | '1'
  isActive: boolean
  status: '0' | '1' | '2' | '3'
  //0 = DRAFT
  //1 = PUBLISHED
  //2 = SCHEDULED
  //3 = EXPIRED
  created_date: string
  createdBy: string
  coverImageFile?: {
    url: string,
    fileName: string
  },
  isNew: boolean
}

export interface NewsDataFilter {
  from: string | undefined,
  to: string | undefined,
  status: string | undefined,
}

export interface AnnouncementFilter extends NewsDataFilter {
  page: number
  limit: number
  sortBy: string
  sortOrder: string
  search: string
}

export const statusOptions = [
  { label: 'แบบร่าง', value: '0' },
  { label: 'เผยแพร่', value: '1' },
  { label: 'รอเผยแพร่', value: '2' },
  { label: 'หมดเวลาเผยแพร่', value: '3' }
]

export const publishOptions = [
  { label: 'กำหนดเวลาเผยแพร่', value: '1' },
  { label: 'ไม่กำหนดเวลาเผยแพร่', value: '0' }
]

export const getStatusLabel = (status: string) => {
  const statusItem = statusOptions.find(item => item.value === status)
  return statusItem ? statusItem.label : status
}

export function mapPublishRange(start_date: string, end_date: string): string {
  const start = start_date ? dateFormatMonth(start_date) : "";
  const end = end_date ? dateFormatMonth(end_date) : "";
  return `${start} - ${end}`;
}
