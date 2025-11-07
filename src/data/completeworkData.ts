export interface CompleteWorkData {
  id: number;
  workOrderNo: string; //เลขที่ใบสั่งงาน
  customerRequestNo: string; //เลขที่คำร้อง
  serviceType: string; //ประเภทงานบริการ
  workOrderType: string; //ประเภทในสั่งงาน
  customerName: string; //ข้อมูลลูกค้า
  status: string; //สถานะ
  isSelected?: boolean;
}

export const CompleteWorkMockData: CompleteWorkData[] = [
  {
    id: 1,
    workOrderNo: "2504100001465",
    customerRequestNo: "IJPBR2506123",
    serviceType: "S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "นาย จสุพจน์ จันทร์งาม",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 2,
    workOrderNo: "2504123456789",
    customerRequestNo: "IJPBR2510045",
    serviceType: "S302 ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "น.ส. กรรณิการ์ รัตนชาติ",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 3,
    workOrderNo: "2504098765432",
    customerRequestNo: "IJPBR2502987",
    serviceType: "S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "นาย สมปอง อินทรสุข",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 4,
    workOrderNo: "2504987654321",
    customerRequestNo: "IJPBR2507841",
    serviceType: "S303 ขอตรวจสอบและบำรุงรักษาเคเบิล",
    workOrderType: "ใบสั่งงานย่อย",
    customerName: "นาง พิชญา ศิริวงศ์",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 5,
    workOrderNo: "2504567890123",
    customerRequestNo: "IJPBR2501562",
    serviceType: "S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "นาย จสุพจน์ จันทร์งาม",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 6,
    workOrderNo: "2504678901234",
    customerRequestNo: "IJPBR2511123",
    serviceType: "S302 ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
    workOrderType: "ใบสั่งงานย่อย",
    customerName: "นาง นภัสสร นาคเกษม",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 7,
    workOrderNo: "2504789012345",
    customerRequestNo: "IJPBR2503359",
    serviceType: "S303 ขอตรวจสอบและบำรุงรักษาเคเบิล",
    workOrderType: "ใบสั่งงานย่อย",
    customerName: "นาง จิรายุส บัวสวรรค์",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 8,
    workOrderNo: "2504234567890",
    customerRequestNo: "IJPBR2509234",
    serviceType: "S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    workOrderType: "ใบสั่งงานย่อย",
    customerName: "นาย วิชัย ชูศรี",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 9,
    workOrderNo: "2504345678901",
    customerRequestNo: "IJPBR2501444",
    serviceType: "S302 ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "น.ส. อภิสรา พิทักษ์ธรรม",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
  {
    id: 10,
    workOrderNo: "2504456789012",
    customerRequestNo: "IJPBR2508129",
    serviceType: "S303 ขอตรวจสอบและบำรุงรักษาเคเบิล",
    workOrderType: "ใบสั่งงานหลัก",
    customerName: "นาย ชนาธิป ยิ้มแย้ม",
    status: "รอผลปฏิบัติงาน",
    isSelected: false,
  },
];


export const getCompleteWorkApi = async (params: any) => {
  console.log('CompleteWork API called with params:', params);
  

  return {
    data: { 
      data: { 
        items: CompleteWorkMockData,
        data: CompleteWorkMockData,
        total: CompleteWorkMockData.length,
        totalPages: 1,
        draw: 1,
        meta: {
          limit: CompleteWorkMockData.length,
          page: 1,
          nextPage: null,
          previousPage: null,
          totalCount: CompleteWorkMockData.length,
          totalPages: 1
        }
      }
    }
  };

};