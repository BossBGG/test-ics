// src/data/newAndAnnounceData.ts
export interface NewAndAnnounceData {
  id: number
  title: string
  subtitle: string
  intro?: string
  description?: string
  date: string
  location?: string
  target?: string
  cost?: string
  topic?: string
  contact?: string
  status: 'new' | 'news' | 'activity' | 'training'
  image?: string
  created_date: string
  created_by?: string
}

export const mockNewAndAnnounceData: NewAndAnnounceData[] = [
  {
    id: 1,
    title: "ประชาสัมพันธ์หลักสูตรอบรม “การใช้งานระบบ ICS สำหรับพนักงานใหม่”",
    subtitle: "เปิดอบรมศูนย์ฝึกอบรมการไฟฟ้าส่วนภูมิภาค ผู้สนใจสามารถสมัครผ่านระบบได้ถึง 8 ม.ค. 2568",
    intro: "การไฟฟ้าส่วนภูมิภาค (PEA) จัดกิจกรรมอบรมหลักสูตร “การใช้งานระบบ ICS สำหรับพนักงานใหม่",
    description: " เพื่อให้การทำงานในระบบสารสนเทศขององค์กรมีประสิทธิภาพมากยิ่งขึ้น หน่วยงานฝ่ายพัฒนาระบบสารสนเทศ จึงจัดอบรมหลักสูตร “การใช้งานระบบ ICS สำหรับพนักงานใหม่” ขึ้น เพื่อเตรียมความพร้อมและสร้างความเข้าใจในการใช้งานระบบอย่างถูกต้อง ครอบคลุม และปลอดภัย",
    date: "1 - 15 ม.ค. 2568",
    location: "ระบบออนไลน์  (Google Meet)",
    target: "พนักงานใหม่ทุกแผนก ที่ยังไม่เคยผ่านการอบรมระบบ ICS",
    cost: "ไม่มีค่าใช้จ่าย",
    topic: "แนะนำภาพรวมระบบ ICS /n การเข้าสู่ระบบและตั้งค่าข้อมูล /n วิธีใช้งานเมนูหลัก เช่น การแจ้งงาน บันทึกข้อมูล ส่งคำขอ /n การใช้งานฟังก์ชันการสื่อสารภายในระบบ /n แนวทางการแก้ปัญหาเบื้องต้น และช่องทางการติดต่อ support",
    contact: "support@ics-org.com",
    status: 'new',
    image: '/assets/images/test-image.png',
    created_date: '1 เมษายน 2568',
    created_by: 'ฝ่ายทรัพยากรบุคคล'
  },
  {
    id: 2,
    title: "สรุปผลโครงการทดลองระบบ ICS กับหน่วยงานต้นแบบ",
    subtitle: "ผลการทดลองใช้งานจาก 5 เขตพื้นที่นำร่องพบว่าระบบช่วยลดระยะเวลาในการจัดการงานลงเฉลี่ย 35%",
    date: "28 มีนาคม 2568",
    status: 'new',
    image: '/assets/images/test-image.png',
    created_date: '25 มีนาคม 2568'
  },
  {
    id: 3,
    title: "PEA Digital Transformation: ICS ร่วมขับเคลื่อน",
    subtitle: "ICS เป็นส่วนหนึ่งของการพัฒนาองค์กรสู่ยุคดิจิทัล โดยเน้นความปลอดภัยและความสะดวกสบาย",
    date: "5 มิถุนายน 2568",
    status: 'new',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
  {
    id: 4,
    title: "PEA จัดอบรมการใช้งานระบบ ICS สำหรับพนักงานใหม่",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA) จัดกิจกรรมอบรมหลักสูตร “การใช้งานระบบ ICS สำหรับพนักงานใหม",
    date: "15 เมษายน 2568",
    status: 'training',
    image: '/assets/images/test-image.png',
    created_date: '10 เมษายน 2568'
  },
  {
    id: 5,
    title: "PEA ลงพื้นที่ซ่อมบำรุงและตรวจสอบอุปกรณ์ระบบจำหน่ายไฟฟ้า",
    subtitle: "การไฟฟ้าส่วนภูมิภาค(PEA)ลงพื้นที่ปฏิบัติงานซ่อมบำรุงและตรวจสอบอุปกรณ์ภาคสนามในระบบจำหน่าย",
    date: "20 เมษายน 2568",
    status: 'news',
    image: '/assets/images/test-image.png',
    created_date: '18 เมษายน 2568'
  },
  {
    id: 6,
    title: "PEA จัดอบรมภาคสนาม เรื่องความปลอดภัยในการปฏิบัติงานบนเสาไฟฟ้า",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA) จัดกิจกรรมอบรมภาคสนามเรื่อง “ความปลอดภัยในการปฏิบัติงานบนที่สูง”",
    date: "30 เมษายน 2568",
    status: 'training',
    image: '/assets/images/test-image.png',
    created_date: '25 เมษายน 2568'
  },
  {
    id: 7,
    title: "PEA ลงพื้นที่ตรวจสอบประสิทธิภาพระบบระบายอากาศและอุปกรณ์ไฟฟ้าในสถานี",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA) ลงพื้นที่ตรวจสอบและทดสอบการทำงานของระบบระบายอากาศและอุปกรณ์",
    date: "10 พฤษภาคม 2568",
    status: 'news',
    image: '/assets/images/test-image.png',
    created_date: '5 พฤษภาคม 2568'
  },
  {
    id: 8,
    title: "PEA เปิดใช้อาคารศูนย์ฝึกอบรมและสัมมนาแห่งใหม่ รองรับการเรียนรู้ยุคดิจิทัล",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA)เปิดตัวอาคารศูนย์ฝึกอบรมและสัมมนาแห่งใหม่ ภายใต้แนวคิดการออกแบบ",
    date: "25 พฤษภาคม 2568",
    status: 'news',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
  {
    id: 9,
    title: "PEA เปิดใช้งานอาคารศูนย์นวัตกรรมพลังงานไฟฟ้า รองรับอนาคตพลังงานไทย",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA)เปิดตัวอาคารศูนย์นวัตกรรมพลังงานไฟฟ้าแห่งใหม่ ซึ่งออกแบบด้วย",
    date: "25 พฤษภาคม 2568",
    status: 'news',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
  {
    id: 10,
    title: "PEA จัดกิจกรรมสัมมนาเชิงปฏิบัติการ เพื่อเสริมสร้างศักยภาพและความร่วมมือในองค์กร",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA) จัดกิจกรรมสัมมนาและเวิร์กชอปประจำปีโดยมีผู้บริหารและบุคลากรจากหลาย",
    date: "25 พฤษภาคม 2568",
    status: 'activity',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
  {
    id: 11,
    title: "PEA จัดพิธีมอบวุฒิบัตรผู้ผ่านการอบรมหลักสูตรช่างเทคนิคประจำปี 2568",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA)จัดพิธีปิดการอบรมและมอบวุฒิบัตรให้แก่ผู้เข้าร่วมอบรมหลักสูตร“ช่างเทคนิค",
    date: "25 พฤษภาคม 2568",
    status: 'news',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
  {
    id: 12,
    title: "PEA จัดอบรมภาคสนามหลักสูตรช่างระบบจำหน่ายเสริมสร้างความพร้อมก่อนลงพื้นที่ปฏิบัติงานจริ",
    subtitle: "การไฟฟ้าส่วนภูมิภาค (PEA)จัดกิจกรรมอบรมเชิงปฏิบัติการหลักสูตร “การปฏิบัติงานระบบจำหน่าย",
    date: "25 พฤษภาคม 2568",
    status: 'training',
    image: '/assets/images/test-image.png',
    created_date: '20 พฤษภาคม 2568'
  },
]

export const statusOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'ใหม่', value: 'new' },
  { label: 'ข่าวสาร', value: 'news' },
  { label: 'กิจกรรม/อบรม', value: 'activity' }
]

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new':
      return 'ใหม่'
    case 'news':
      return 'ข่าวสาร'
    case 'activity':
      return 'กิจกรรม'
    case 'training':
      return 'อบรม'
    default:
      return status
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800'
    case 'news':
      return 'bg-blue-100 text-blue-800'
    case 'activity':
      return 'bg-green-100 text-green-800'
    case 'training':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}