// src/data/systemLogData.ts
export const logTypeOptions = [
  { label: "ทั้งหมด", value: "" },
  { label: "Error (ข้อผิดพลาด)", value: "Error" },
  { label: "Info (ข้อมูลทั่วไป)", value: "Info" },
  { label: "Warning (คำเตือน)", value: "Warning" },
  { label: "Emergency (ข้อผิดพลาดร้ายแรง)", value: "Emergency" },
  { label: "Security (ความปลอดภัย)", value: "Security" },
  { label: "Debug (วิเคราะห์รายละเอียด)", value: "Debug" },
  { label: "Audit (ข้อมูลใช้งาน)", value: "Audit" },
  { label: "Created (เพิ่มข้อมูล)", value: "Created" },
  { label: "Updated (แก้ไขข้อมูล)", value: "Updated" },
];

export function getLogLevelColor(level: string) {
  switch (level) {
    case "Error":
      return "bg-red-100 text-red-800";
    case "Info":
      return "bg-blue-100 text-blue-800";
    case "Warning":
      return "bg-yellow-100 text-yellow-800";
    case "Emergency":
      return "bg-red-200 text-red-900";
    case "Security":
      return "bg-green-100 text-green-800";
    case "Debug":
      return "bg-gray-100 text-gray-800";
    case "Audit":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
