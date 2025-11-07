// src/data/newAndAnnounceData.ts
export interface NewAndAnnounceData {
  id: number;
  uuid?: string;
  title: string;
  subtitle: string;
  intro?: string;
  description?: string;
  content?: string;
  date: string;
  location?: string;
  target?: string;
  cost?: string;
  topic?: string;
  contact?: string;
  status: "new" | "news" | "activity" | "training";
  image?: string;
  created_date: string;
  created_by?: string;
}

export const statusOptions = [
  { label: "ทั้งหมด", value: "" },
  { label: "ใหม่", value: "new" },
  { label: "ข่าวสาร", value: "news" },
  { label: "กิจกรรม/อบรม", value: "activity" },
];

export function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "ใหม่";
    case "news":
      return "ข่าวสาร";
    case "activity":
      return "กิจกรรม";
    case "training":
      return "อบรม";
    default:
      return status;
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-red-100 text-red-800";
    case "news":
      return "bg-blue-100 text-blue-800";
    case "activity":
      return "bg-green-100 text-green-800";
    case "training":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
