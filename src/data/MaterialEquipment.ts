import {GroupMaterial, MaterialEquipment} from "~/api/types";

export const mockGroupData: GroupMaterial[] =[
  {
    id: 1,
    name: 'อุปกรณ์พื้นฐานสำหรับงานทดสอบหม้อแปลงขนาดเล็ก (10 - 160 kVA)',
    status: 'active',
    is_active: true,
    material_equipments: []
  },
  {
    id: 2,
    name: 'อุปกรณ์พื้นฐานสำหรับงานทดสอบหม้อแปลงขนาดกลาง (250 - 1,000 kVA)',
    status: 'active',
    is_active: true,
  },
  {
    id: 3,
    name: 'อุปกรณ์พื้นฐานสำหรับงานทดสอบหม้อแปลงขนาดใหญ่ (1,000 - 5,000 kVA)',
    status: 'active',
    is_active: true,
  },
  {
    id: 4,
    name: 'อุปกรณ์เสริมสำหรับการทดสอบหม้อแปลงไฟฟ้า',
    status: 'active',
    is_active: true,
  },
  {
    id: 5,
    name: 'เครื่องมือสำหรับการตรวจสอบคุณภาพน้ำมันหม้อแปลง',
    status: 'active',
    is_active: true,
  },
  {
    id: 6,
    name: 'อุปกรณ์สำหรับการทดสอบแรงดันสูง',
    status: 'active',
    is_active: true,
  },
  {
    id: 7,
    name: 'เครื่องวัดอุณหภูมิและความชื้นสำหรับห้องทดสอบ',
    status: 'active',
    is_active: true,
  },
  {
    id: 8,
    name: 'ระบบติดตามผลการทดสอบหม้อแปลงอัจฉริยะ',
    status: 'active',
    is_active: true,
  },
  {
    id: 9,
    name: 'อุปกรณ์สำหรับทดสอบการรั่วไหลของไฟฟ้า',
    status: 'active',
    is_active: true,
  },
  {
    id: 10,
    name: 'เครื่องมือสำหรับวิเคราะห์ค่าการนำไฟฟ้าของวัสดุ',
    status: 'active',
    is_active: true,
  },
];

export const mockData: MaterialEquipment[] = [
  {
    id: 1,
    code: '1060050019',
    uuid: '1060050019',
    name: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE',
    status: 'active',
    is_active: true,
    is_edited: false,
    is_update: false,
    unit: 'ชิ้น',
    quantity: 1,
    price: 10,
  },
  {
    id: 2,
    code: '1060050018',
    uuid: '1060050018',
    name: 'METER (E) WATTHOUR 1P 1(500',
    status: 'active',
    is_active: true,
    is_edited: false,
    is_update: false,
    unit: 'ชิ้น',
    quantity: 1,
    price: 10,
  },
]