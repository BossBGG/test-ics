export interface WorkOrderRelationship {
  id: number;
  orderNumber: string;
  requestNumber: string;
  customerName: string;
  date: string;
  details: string;
  workOrderType: string; 
  hasChildren?: boolean;
  children?: WorkOrderRelationship[];
  level?: number;
}

export const mockWorkOrderRelationships: WorkOrderRelationship[] = [
  {
    id: 1,
    orderNumber: "IJPBR2505191",
    requestNumber: "IIQMN2305670",
    customerName: "นายไพโรจ สุวรรณ",
    date: "14/03/2568",
    details: "รอเปิดใบสั่งงาน/เบิกจ่ายพัสดุ",
    workOrderType: "ใบสั่งงานหลัก (2)",
    level: 0,
    hasChildren: true,
    children: [
      {
        id: 2,
        orderNumber: "IJPBR2505191",
        requestNumber: "IIQMN2305670",
        customerName: "",
        date: "14/03/2568",
        details: "ปิดใบสั่งงาน",
        workOrderType: "ใบสั่งงานย่อย (1)",
        level: 1,
        hasChildren: true,
        children: [
          {
            id: 3,
            orderNumber: "IJPBR2505152",
            requestNumber: "",
            customerName: "",
            date: "14/03/2568",
            details: "",
            workOrderType: "",
            level: 2,
            hasChildren: false
          }
        ],
        
      },
      {
        id: 7,
        orderNumber: "IJPBR2505191",
        requestNumber: "IIQMN2305670",
        customerName: "",
        date: "14/03/2568",
        details: "ปิดใบสั่งงาน",
        workOrderType: "ใบสั่งงานย่อย (1)",
        level: 1,
        hasChildren: true,
        children: [
          {
            id: 3,
            orderNumber: "IJPBR2505152",
            requestNumber: "",
            customerName: "",
            date: "14/03/2568",
            details: "",
            workOrderType: "",
            level: 2,
            hasChildren: false
          }
        ],
      }
    ]
  },
  {
    id: 4,
    orderNumber: "IJPBR2505191",
    requestNumber: "IIQMN2305670",
    customerName: "นายสมชาย ใจดี",
    date: "14/03/2568",
    details: "ขอเข้าทำงานที่เนิดไฟฟ้า",
    workOrderType: "ใบสั่งงานหลัก (2)",
    level: 0,
    hasChildren: true,
    children: [
      {
        id: 5,
        orderNumber: "IJPBR2505191",
        requestNumber: "IIQMN2305670",
        customerName: "",
        date: "14/03/2568",
        details: "รอเปิดใบสั่งงาน",
        workOrderType: "ใบสั่งงานย่อย (1)",
        level: 1,
        hasChildren: false,
      }
    ]
  },
  {
    id: 6,
    orderNumber: "IJPBR2505191",
    requestNumber: "IIQMN2305670",
    customerName: "บริษัท ABC จำกัด",
    date: "14/03/2568",
    details: "รอเปิดใบสั่งงาน",
    workOrderType: "ใบสั่งงานหลัก (2)",
    level: 0,
    hasChildren: false
  }
];

export function getStatusColorClass(status: string): string {
  const statusMap: Record<string, string> = {
    'รอเปิดใบสั่งงาน': '',
    'รอเปิดใบสั่งงาน/เบิกจ่ายพัสดุ': '',
    'ปิดใบสั่งงาน': '',
    'กำลังดำเนินการ': '',
    'รอเบิกพัสดุ': '',
    'ยกเลิกใบสั่งงาน': '',
    'ขอเข้าทำงานที่เนิดไฟฟ้า': ''
  };
  
  return statusMap[status] ;
}