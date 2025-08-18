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

export interface WorkerReportData {
  id: number;
  electricity: string; // การไฟฟ้า
  workerGroup: string; // กลุ่มผู้ปฏิบัติงาน
  workerName: string; // ผู้ปฏิบัติงาน
  workCount: number; // จำนวนงาน
  workHours: number; // จำนวนชั่วโมง
  isSelected?: boolean;
}

// Mock data สำหรับ Work Report
export const WorkReportDataData: WorkReportData[] = [
  {
    id: 1,
    orderNumber: "IJPBR2505191",
    workOrderNumber: "IJPBR2505191", 
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบสั่งงาน",
    workDate: "07 มิถุนายน 2568",
    isSelected: true
  },
  {
    id: 2,
    orderNumber: "IJPBR2502564",
    workOrderNumber: "IJPBR2502564",
    Electricity: "XSCX", 
    workService: "งานเช่าหม้อแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "ปิดใบสั่งงาน",
    workDate: "05 มิถุนายน 2568",
    isSelected: true
  },
  {
    id: 3,
    orderNumber: "IJPBR2501536",
    workOrderNumber: "IJPBR2501536",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง", 
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเบิกพัสดุ",
    workDate: "03 มิถุนายน 2568",
    isSelected: false
  },
  {
    id: 4,
    orderNumber: "IJPBR2508795",
    workOrderNumber: "IJPBR2508795",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานสำรวจ", 
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบสั่งงาน",
    workDate: "01 มิถุนายน 2568",
    isSelected: false
  },
  {
    id: 5,
    orderNumber: "IJPBR2502635",
    workOrderNumber: "IJPBR2502635",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก", 
    status: "รอเบิกพัสดุ",
    workDate: "25 มกราคม 2568",
    isSelected: true
  },
  {
    id: 6,
    orderNumber: "IJPBR2503487",
    workOrderNumber: "IJPBR2503487",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเบิกพัสดุ",
    workDate: "22 มกราคม 2568",
    isSelected: false
  },
  {
    id: 7,
    orderNumber: "IJPBR2501938",
    workOrderNumber: "IJPBR2501938",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานหลัก",
    status: "รอเปิดใบสั่งงาน", 
    workDate: "20 มกราคม 2568",
    isSelected: false
  },
  {
    id: 8,
    orderNumber: "IJPBR2505124",
    workOrderNumber: "IJPBR2505124",
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "รอเปิดใบสั่งงาน",
    workDate: "17 มกราคม 2568", 
    isSelected: false
  },
  {
    id: 9,
    orderNumber: "IJPBR2504652",
    workOrderNumber: "IJPBR2504652", 
    Electricity: "XSCX",
    workService: "งานเช่าหม้อแปลง",
    workType: "งานสำรวจ",
    workOrderType: "ใบสั่งงานย่อย",
    status: "รอเปิดใบสั่งงาน",
    workDate: "15 มกราคม 2568",
    isSelected: false
  },
  {
    id: 10,
    orderNumber: "IJPBR2504652",
    workOrderNumber: "IJPBR2504652",
    Electricity: "XSCX", 
    workService: "งานเช่าหม้อแปลง",
    workType: "งานปฏิบัติงาน",
    workOrderType: "ใบสั่งงานย่อย",
    status: "ปิดใบสั่งงาน",
    workDate: "12 มกราคม 2568",
    isSelected: false
  }
];

// Chart Data for All Reports Chart
export const allReportsChartData = {
  series: [
    {
      name: 'ใบสั่งงานทั้งหมด',
      data: [11, 10, 11, 5, 18, 16, 11, 16, 7, 16, 13, 11]
    },
    {
      name: 'ดำเนินงานเสร็จสิ้น',
      data: [16, 11, 14, 3, 10, 17, 10, 12, 15, 13, 17, 12]
    }
  ],
  categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
}

// Chart Data for Working Hours Chart
export const workingHoursChartData = {
  series: [
    {
      name: 'พนักงาน PEA',
      data: [580, 800, 586, 650, 280, 570, 200, 900, 580, 720, 810, 600]
    },
    {
      name: 'ผู้รับจ้าง',
      data: [587, 570, 160, 200, 918, 400, 160, 510, 400, 640, 180, 600]
    }
  ],
  categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  tooltipData: [
    {
      month: 'มกราคม 2568',
      peaEmployees: 150,
      peaHours: 580,
      contractors: 75,
      contractorHours: 587,
      averageHours: 5.2
    },
    {
      month: 'กุมภาพันธ์ 2568',
      peaEmployees: 200,
      peaHours: 800,
      contractors: 95,
      contractorHours: 570,
      averageHours: 4.6
    },
    {
      month: 'มีนาคม 2568',
      peaEmployees: 145,
      peaHours: 586,
      contractors: 40,
      contractorHours: 160,
      averageHours: 4.0
    },
    {
      month: 'เมษายน 2568',
      peaEmployees: 160,
      peaHours: 650,
      contractors: 50,
      contractorHours: 200,
      averageHours: 4.0
    },
    {
      month: 'พฤษภาคม 2568',
      peaEmployees: 70,
      peaHours: 280,
      contractors: 180,
      contractorHours: 918,
      averageHours: 4.8
    },
    {
      month: 'มิถุนายน 2568',
      peaEmployees: 180,
      peaHours: 860,
      contractors: 80,
      contractorHours: 560,
      averageHours: 7.3
    },
    {
      month: 'กรกฎาคม 2568',
      peaEmployees: 50,
      peaHours: 200,
      contractors: 40,
      contractorHours: 160,
      averageHours: 4.0
    },
    {
      month: 'สิงหาคม 2568',
      peaEmployees: 220,
      peaHours: 900,
      contractors: 100,
      contractorHours: 510,
      averageHours: 4.4
    },
    {
      month: 'กันยายน 2568',
      peaEmployees: 145,
      peaHours: 580,
      contractors: 80,
      contractorHours: 400,
      averageHours: 4.4
    },
    {
      month: 'ตุลาคม 2568',
      peaEmployees: 180,
      peaHours: 720,
      contractors: 120,
      contractorHours: 640,
      averageHours: 4.5
    },
    {
      month: 'พฤศจิกายน 2568',
      peaEmployees: 200,
      peaHours: 810,
      contractors: 45,
      contractorHours: 180,
      averageHours: 4.0
    },
    {
      month: 'ธันวาคม 2568',
      peaEmployees: 150,
      peaHours: 600,
      contractors: 120,
      contractorHours: 600,
      averageHours: 4.4
    }
  ]
}

export const WorkerReportDataData: WorkerReportData[] = [
  {
    id: 1,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA",
    workerName: "9011763 : สุขุมพร พิศนุมา",
    workCount: 20,
    workHours: 10,
    isSelected: true
  },
  {
    id: 2,
    electricity: "XSCX", 
    workerGroup: "ผู้รับจ้าง",
    workerName: "น.ส.พนักรัต จรยุม กฟส.สันกำแพง",
    workCount: 19,
    workHours: 8,
    isSelected: true
  },
  {
    id: 3,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA", 
    workerName: "9011763 : สุขุมพร พิศนุมา",
    workCount: 11,
    workHours: 7,
    isSelected: false
  },
  {
    id: 4,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA",
    workerName: "9011763 : สุขุมพร พิศนุมา", 
    workCount: 6,
    workHours: 3,
    isSelected: false
  },
  {
    id: 5,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA",
    workerName: "9011763 : สุขุมพร พิศนุมา",
    workCount: 5,
    workHours: 2,
    isSelected: true
  },
  {
    id: 6,
    electricity: "XSCX",
    workerGroup: "ผู้รับจ้าง",
    workerName: "น.ส.พนักรัต จรยุม กฟส.สันกำแพง",
    workCount: 9,
    workHours: 4,
    isSelected: false
  },
  {
    id: 7,
    electricity: "XSCX",
    workerGroup: "ผู้รับจ้าง", 
    workerName: "น.ส.พนักรัต จรยุม กฟส.สันกำแพง",
    workCount: 18,
    workHours: 16,
    isSelected: false
  },
  {
    id: 8,
    electricity: "XSCX",
    workerGroup: "ผู้รับจ้าง",
    workerName: "น.ส.พนักรัต จรยุม กฟส.สันกำแพง",
    workCount: 12,
    workHours: 10,
    isSelected: false
  },
  {
    id: 9,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA",
    workerName: "9011763 : สุขุมพร พิศนุมา",
    workCount: 3,
    workHours: 2,
    isSelected: false
  },
  {
    id: 10,
    electricity: "XSCX",
    workerGroup: "พนักงาน PEA", 
    workerName: "9011763 : สุขุมพร พิศนุมา",
    workCount: 5,
    workHours: 3,
    isSelected: false
  }
];

// Working Hours Cards Data
export const workingHoursCards = [
  {
    title: 'พนักงาน PEA',
    hours: 6200,
    icon: '/assets/images/pea-employee-icon.png'
  },
  {
    title: 'ผู้รับจ้าง',
    hours: 6000,
    icon: '/assets/images/contractor-icon.png'
  },
  {
    title: 'ชั่วโมง',
    hours: 12200,
    icon: '/assets/images/hours-icon.png'
  }
]

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
  { value: "รอเบิกพัสดุ", label: "รอเบิกพัสดุ" }
];

export const workServiceOptions = [
  { value: "งานเช่าหม้อแปลง", label: "งานเช่าหม้อแปลง" }
];

export const workOrderTypeOptions = [
  { value: "ใบสั่งงานหลัก", label: "ใบสั่งงานหลัก" },
  { value: "ใบสั่งงานย่อย", label: "ใบสั่งงานย่อย" }
];

// Export default
export default WorkReportDataData;