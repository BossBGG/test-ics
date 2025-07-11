
export interface News {
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

export interface GroupMaterial {
  id: number,
  name: string,
  status: string,
  is_active: boolean,
  material_equipments?: MaterialEquipment[]
}

export interface MaterialEquipment {
  id: number;
  code: string;
  uuid: string;
  name: string;
  quantity: number | string;
  unit: string;
  price?: number | string;
  status: string;
  is_active: boolean
  is_update: boolean
  is_edited: boolean
}