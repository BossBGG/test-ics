// src/data/newsData.ts
export interface NewsData {
  id: number
  image: string
  title: string
  description: string
  content: string
  publish_date: string
  is_active: boolean
  status: 'draft' | 'published' | 'pending' | 'expired'
  created_date: string
  created_by: string
}

export const mockNewsData: NewsData[] = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150x100',
    title: 'ประกาศแจ้งปรับปรุงระบบไฟฟ้า',
    description: 'การไฟฟ้าฟ้องานการนครหลวงจะดำเนินการปรับปรุงระบบไฟฟ้าในพื้นที่',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '28 ม.ค. 2568 - 28 ก.พ. 2568',
    is_active: true,
    status: 'published',
    created_date: '28 ม.ค. 2568',
    created_by: 'Sek Phinjain'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 2',
    description: 'รายละเอียดข่าวประกาศ 2',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '21 ม.ค. 2568 - 21 ก.พ. 2568',
    is_active: true,
    status: 'pending',
    created_date: '21 ม.ค. 2568',
    created_by: 'Pongsatorn Senawong'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 3',
    description: 'รายละเอียดข่าวประกาศ 3',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '19 ม.ค. 2568 - 19 ก.พ. 2568',
    is_active: false,
    status: 'draft',
    created_date: '19 ม.ค. 2568',
    created_by: 'Thannika Jaedangkrasert'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 4',
    description: 'รายละเอียดข่าวประกาศ 4',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '17 ม.ค. 2568 - 17 ก.พ. 2568',
    is_active: true,
    status: 'published',
    created_date: '17 ม.ค. 2568',
    created_by: 'Kwantra Kittisompong'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 5',
    description: 'รายละเอียดข่าวประกาศ 5',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '15 ม.ค. 2568 - 15 ก.พ. 2568',
    is_active: true,
    status: 'pending',
    created_date: '15 ม.ค. 2568',
    created_by: 'Kanikan Suklasem'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 6',
    description: 'รายละเอียดข่าวประกาศ 6',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '10 ม.ค. 2568 - 10 ก.พ. 2568',
    is_active: false,
    status: 'expired',
    created_date: '10 ม.ค. 2568',
    created_by: 'Karnika Sopuauk'
  },
  {
    id: 7,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 7',
    description: 'รายละเอียดข่าวประกาศ 7',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '5 ม.ค. 2568 - 5 ก.พ. 2568',
    is_active: false,
    status: 'expired',
    created_date: '5 ม.ค. 2568',
    created_by: 'Nemununt Yuimaneewat'
  },
  {
    id: 8,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 8',
    description: 'รายละเอียดข่าวประกาศ 8',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '1 ม.ค. 2568 - 1 ก.พ. 2568',
    is_active: true,
    status: 'pending',
    created_date: '1 ม.ค. 2568',
    created_by: 'Tharathin Sewangatwaya'
  },
  {
    id: 9,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 9',
    description: 'รายละเอียดข่าวประกาศ 9',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '28 ธ.ค. 2567 - 28 ม.ค. 2568',
    is_active: true,
    status: 'published',
    created_date: '28 ธ.ค. 2567',
    created_by: 'Nut Siruadudboe'
  },
  {
    id: 10,
    image: 'https://via.placeholder.com/150x100',
    title: 'ข่าวประกาศ 10',
    description: 'รายละเอียดข่าวประกาศ 10',
    content: '<p>เนื้อหาข่าวแบบละเอียด...</p>',
    publish_date: '24 ธ.ค. 2567 - 24 ม.ค. 2568',
    is_active: true,
    status: 'published',
    created_date: '24 ธ.ค. 2567',
    created_by: 'Tharathin Sewangatwaya'
  }
]

export const statusOptions = [
  { label: 'แบบร่าง', value: 'draft' },
  { label: 'เผยแพร่', value: 'published' },
  { label: 'รอเผยแพร่', value: 'pending' },
  { label: 'หมดเวลาเผยแพร่', value: 'expired' }
]

export const publishOptions = [
  { label: 'เผยแพร่', value: 'published' },
  { label: 'ไม่เผยแพร่', value: 'draft' }
]

export const getStatusLabel = (status: string) => {
  const statusItem = statusOptions.find(item => item.value === status)
  return statusItem ? statusItem.label : status
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'expired':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}