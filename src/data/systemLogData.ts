// src/data/systemLogData.ts
export interface SystemLogData {
  id: number
  date: string
  time: string
  date_time?: string
  level: 'Error' | 'Info' | 'Warning' | 'Critical' | 'Success' | 'Debug' | 'Notice' | 'Alert' | 'Failure' | 'Caution'
  user: {
    name: string
    avatar: string
  }
  event: string
  ip_address: string
  details?: string
  system_info?: {
    browser?: string
    os?: string
    device?: string
  }
}

export interface SystemLogDataDetail {
  id: number
  date_time?: string
  old_data: string,
  new_data: string
}

export const mockSystemLogData: SystemLogData[] = [
  {
    id: 1,
    date: '14 ธันวาคม 2566',
    time: '14:05',
    date_time: '14 ธันวาคม 2566 14:05',
    level: 'Error',
    user: {
      name: 'ธีระคุณ ฤทธิพงษ์',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'ระบบล้มเหลวตอนพยายามสำเหรา',
    ip_address: '192.168.1.1',
    details: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล เนื่องจาก connection timeout หลังจากรอเป็นเวลา 30 วินาที',
    system_info: {
      browser: 'Chrome 119.0.0.0',
      os: 'Windows 10',
      device: 'Desktop'
    }
  },
  {
    id: 2,
    date: '14 ธันวาคม 2566',
    time: '13:50',
    level: 'Info',
    user: {
      name: 'แนนณัท ธรรมประดิษฐา',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'เข้าสู่ระบบสำเร็จ',
    ip_address: '192.168.1.2',
    details: 'ผู้ใช้ได้เข้าสู่ระบบสำเร็จผ่าน Single Sign-On (SSO)',
    system_info: {
      browser: 'Firefox 120.0',
      os: 'macOS Sonoma',
      device: 'MacBook Pro'
    }
  },
  {
    id: 3,
    date: '14 ธันวาคม 2566',
    time: '13:45',
    level: 'Warning',
    user: {
      name: 'นิรนาน มาชัย',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'พยายามล็อกอินผิด 3 ครั้ง',
    ip_address: '192.168.1.3',
    details: 'ผู้ใช้พยายามเข้าสู่ระบบด้วยรหัสผ่านผิด 3 ครั้งติดต่อกัน บัญชีถูกล็อกชั่วคราว',
    system_info: {
      browser: 'Safari 17.1',
      os: 'iOS 17.1',
      device: 'iPhone'
    }
  },
  {
    id: 4,
    date: '14 ธันวาคม 2566',
    time: '13:30',
    level: 'Critical',
    user: {
      name: 'ธีระคุณ ศรีไกรเวล',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'เกิดข้อผิดพลาดใน API',
    ip_address: '192.168.1.4',
    details: 'API endpoint /api/users/profile ตอบสนองช้า มากกว่า 5 วินาที และส่งคืน error 500',
    system_info: {
      browser: 'Edge 119.0.0.0',
      os: 'Windows 11',
      device: 'Desktop'
    }
  },
  {
    id: 5,
    date: '14 ธันวาคม 2566',
    time: '13:15',
    level: 'Success',
    user: {
      name: 'มาริษา ประชาพุฒ',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'ระบบล้มเหลวตอนพยายามสำเหรา',
    ip_address: '192.168.1.5',
    details: 'การสำรองข้อมูลรายวันเสร็จสิ้นสมบูรณ์ ขนาดไฟล์ 2.5 GB',
    system_info: {
      browser: 'Chrome 119.0.0.0',
      os: 'Ubuntu 22.04',
      device: 'Server'
    }
  },
  {
    id: 6,
    date: '14 ธันวาคม 2566',
    time: '13:00',
    level: 'Debug',
    user: {
      name: 'กนษดินท์ วงศ์สวัสดิกุล',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'เข้าสู่ระบบสำเร็จ',
    ip_address: '192.168.1.6',
    details: 'การดำเนินการ debug session เริ่มต้นสำหรับการตรวจสอบปัญหาประสิทธิภาพ',
    system_info: {
      browser: 'Chrome 119.0.0.0',
      os: 'Windows 10',
      device: 'Desktop'
    }
  },
  {
    id: 7,
    date: '14 ธันวาคม 2566',
    time: '12:45',
    level: 'Notice',
    user: {
      name: 'ไนทวี ศิริแสนพงศ์',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'พยายามล็อกอินผิด 3 ครั้ง',
    ip_address: '192.168.1.7',
    details: 'ระบบได้รับการแจ้งเตือนเกี่ยวกับการอัพเดตความปลอดภัยใหม่',
    system_info: {
      browser: 'Firefox 120.0',
      os: 'macOS Ventura',
      device: 'iMac'
    }
  },
  {
    id: 8,
    date: '14 ธันวาคม 2566',
    time: '12:30',
    level: 'Alert',
    user: {
      name: 'พงศกร สำราชนิล',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'เกิดข้อผิดพลาดใน API',
    ip_address: '192.168.1.8',
    details: 'ตรวจพบการเข้าถึงที่ผิดปกติจาก IP address หลายแห่งในเวลาเดียวกัน',
    system_info: {
      browser: 'Chrome 119.0.0.0',
      os: 'Android 14',
      device: 'Mobile'
    }
  },
  {
    id: 9,
    date: '14 ธันวาคม 2566',
    time: '12:15',
    level: 'Failure',
    user: {
      name: 'นันทกร แสงดวงวิณ',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'ระบบล้มเหลวตอนพยายามสำเหรา',
    ip_address: '192.168.1.9',
    details: 'การสำรองข้อมูลล้มเหลว เนื่องจากพื้นที่เก็บข้อมูลไม่เพียงพอ',
    system_info: {
      browser: 'Safari 17.0',
      os: 'iOS 17.0',
      device: 'iPad'
    }
  },
  {
    id: 10,
    date: '14 ธันวาคม 2566',
    time: '12:00',
    level: 'Caution',
    user: {
      name: 'จรูวู วัฒนกิตติ',
      avatar: 'https://via.placeholder.com/40x40'
    },
    event: 'เข้าสู่ระบบสำเร็จ',
    ip_address: '192.168.1.10',
    details: 'ตรวจพบการใช้งาน CPU สูงกว่า 80% เป็นเวลานานกว่า 10 นาที',
    system_info: {
      browser: 'Edge 119.0.0.0',
      os: 'Windows Server 2022',
      device: 'Server'
    }
  }
]

export const logLevelOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'Error', value: 'Error' },
  { label: 'Info', value: 'Info' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Critical', value: 'Critical' },
  { label: 'Success', value: 'Success' },
  { label: 'Debug', value: 'Debug' },
  { label: 'Notice', value: 'Notice' },
  { label: 'Alert', value: 'Alert' },
  { label: 'Failure', value: 'Failure' },
  { label: 'Caution', value: 'Caution' }
]

export const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'Error':
      return 'bg-red-100 text-red-800'
    case 'Info':
      return 'bg-blue-100 text-blue-800'
    case 'Warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'Critical':
      return 'bg-red-200 text-red-900'
    case 'Success':
      return 'bg-green-100 text-green-800'
    case 'Debug':
      return 'bg-gray-100 text-gray-800'
    case 'Notice':
      return 'bg-indigo-100 text-indigo-800'
    case 'Alert':
      return 'bg-orange-100 text-orange-800'
    case 'Failure':
      return 'bg-red-100 text-red-800'
    case 'Caution':
      return 'bg-yellow-200 text-yellow-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const mockSystemLogDataDetail: SystemLogDataDetail[] = [
  {
    id: 1,
    date_time: '14 ธันวาคม 2566 14:05',
    old_data: 'ระบบเชื่อมต่อฐานข้อมูลล้มเหลว',
    new_data: 'ระบบเชื่อมต่อฐานข้อมูลล้มเหลว'
  },
  {
    id: 2,
    date_time: '14 ธันวาคม 2566 13:50',
    old_data: 'เข้าสู่ระบบสำเร็จ',
    new_data: 'เข้าสู่ระบบสำเร็จ'
  },
]