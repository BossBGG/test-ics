
export interface WorkReportData {
  id: number;
  orderNumber: string; 
  workOrderNumber: string; 
  Electricity: string; 
  workService: string; 
  workType: string; 
  workOrderType: string; 
  status: string; 
  workDate: string; 
  isSelected?: boolean; // สำหรับ checkbox
}

// Mock data สำหรับ Work Report
export const WorkReportDataData: WorkReportData[] = [
  {
    id: 1,
    orderNumber: "IJPBR2505191",
    workOrderNumber: "IJPBR2505191", 
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบจ้างงาน",
    workDate: "07 มิถุนายน 2568",
    isSelected: true
  },
  {
    id: 2,
    orderNumber: "IJPBR2502564",
    workOrderNumber: "IJPBR2502564",
    Electricity: "XSCX", 
    workService: "งานเช่าห้องแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "ปิดใบจ้างงาน",
    workDate: "05 มิถุนายน 2568",
    isSelected: true
  },
  {
    id: 3,
    orderNumber: "IJPBR2501536",
    workOrderNumber: "IJPBR2501536",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง", 
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดพิสูจ",
    workDate: "03 มิถุนายน 2568",
    isSelected: false
  },
  {
    id: 4,
    orderNumber: "IJPBR2508795",
    workOrderNumber: "IJPBR2508795",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานสำรวจ", 
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบจ้างงาน",
    workDate: "01 มิถุนายน 2568",
    isSelected: false
  },
  {
    id: 5,
    orderNumber: "IJPBR2502635",
    workOrderNumber: "IJPBR2502635",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก", 
    status: "รอเปิดพิสูจ",
    workDate: "25 มกราคม 2568",
    isSelected: true
  },
  {
    id: 6,
    orderNumber: "IJPBR2503487",
    workOrderNumber: "IJPBR2503487",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดพิสูจ",
    workDate: "22 มกราคม 2568",
    isSelected: false
  },
  {
    id: 7,
    orderNumber: "IJPBR2501938",
    workOrderNumber: "IJPBR2501938",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบจ้างงาน", 
    workDate: "20 มกราคม 2568",
    isSelected: false
  },
  {
    id: 8,
    orderNumber: "IJPBR2505124",
    workOrderNumber: "IJPBR2505124",
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "รอเปิดใบจ้างงาน",
    workDate: "17 มกราคม 2568", 
    isSelected: false
  },
  {
    id: 9,
    orderNumber: "IJPBR2504652",
    workOrderNumber: "IJPBR2504652", 
    Electricity: "XSCX",
    workService: "งานเช่าห้องแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานย่อย",
    status: "รอเปิดใบจ้างงาน",
    workDate: "15 มกราคม 2568",
    isSelected: false
  },
  {
    id: 10,
    orderNumber: "IJPBR2504652",
    workOrderNumber: "IJPBR2504652",
    Electricity: "XSCX", 
    workService: "งานเช่าห้องแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "ปิดใบจ้างงาน",
    workDate: "12 มกราคม 2568",
    isSelected: false
  }
];

// Utility functions สำหรับจัดการข้อมูล
export const getSelectedWorkReportDatas = (): WorkReportData[] => {
  return WorkReportDataData.filter(report => report.isSelected);
};

export const getWorkReportDataById = (id: number): WorkReportData | undefined => {
  return WorkReportDataData.find(report => report.id === id);
};

export const getWorkReportDatasByStatus = (status: string): WorkReportData[] => {
  return WorkReportDataData.filter(report => report.status === status);
};

export const getWorkReportDatasByWorkType = (workType: string): WorkReportData[] => {
  return WorkReportDataData.filter(report => report.workType === workType);
};

// สำหรับ dropdown options
export const workTypeOptions = [
  { value: "งานสำรวจ", label: "งานสำรวจ" },
  { value: "งานปฏิบัติงาน", label: "งานปฏิบัติงาน" }
];

export const statusOptions = [
  { value: "รอเปิดใบสั่งงาน", label: "รอเปิดใบสั่งงาน" },
  { value: "ปิดใบสั่งงาน", label: "ปิดใบสั่งงาน" },
  { value: "รอเปิดพิสดุ", label: "รอเปิดพิสดุ" }
];

export const workServiceOptions = [
  { value: "งานเช่าห้องแปลง", label: "งานเช่าห้องแปลง" }
];

export const workOrderTypeOptions = [
  { value: "ใบสั่งงานหลัก", label: "ใบสั่งงานหลัก" },
  { value: "ใบสั่งงานย่อย", label: "ใบสั่งงานย่อย" }
];

// Export default
export default WorkReportDataData;