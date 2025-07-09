import { useInput } from "./input";

const applicationForm = useInput('#applicationForm')

export function formThaiPeopleInsert() {
  const thaiPeople = useInput('#thaiPeople')
  thaiPeople.typing('.idCard', '3908042041779')
  thaiPeople.inputTyping('.birthDate', "18/03/1997")
  thaiPeople.selectFirst('.select-title-name')
  thaiPeople.inputTyping('.firstName', "ออโต้บอท")
  thaiPeople.inputTyping('.lastName', "ทดสอบ")
  thaiPeople.selectFirst('.select-title-name')
  thaiPeople.selectFirst('.select-gender')
  thaiPeople.selectFirst('.select-martial-status')
}

export function formIdCardInsert() {
  const formAddressIDcard = useInput('#formAddressIDcard')
  formAddressIDcard.typing('.room-no', '075')
  formAddressIDcard.typing('.floor', '2')
  formAddressIDcard.typing('.house_name', 'บ้านน่าอยู่')
  formAddressIDcard.typing('.house_no', '102/24')
  formAddressIDcard.typing('.moo', '6')
  formAddressIDcard.typing('.street', 'ลาดยาง')
  formAddressIDcard.typing('.lane', 'แตร่ก')
  formAddressIDcard.typing('.alley', 'ตัน')
  formAddressIDcard.selectFirst('.select-province')
  formAddressIDcard.selectFirst('.select-district')
  formAddressIDcard.selectFirst('.select-sub-district')
}

export function formAddressServiceSameAddressClick() {
  const formAddressService = useInput('#formAddressService')
  formAddressService.checkboxClick('.checkbox-same-address')
}

export function formAddressBillingSameAddressClick() {
  const formAddressBilling = useInput('#formAddressBilling')
  formAddressBilling.checkboxClick('.checkbox-same-address')
}

export function formElectricityUserInsert() {
  const formElectricityUser = useInput('#formElectricityUser')
  formElectricityUser.inputTyping('.input-home-telephone', "0875822476")
  formElectricityUser.inputTyping('.input-mobile', "0875822476")
  formElectricityUser.inputTyping('.input-fax', "xxxxxxxxx")
  formElectricityUser.inputTyping('.input-email', "dabornz@gmail.com")
}
