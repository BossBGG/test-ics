import { useInput } from "./input";

const applicationForm = useInput('#applicationForm')
const formCreateApplicationStatus = useInput('#formCreateApplicationStatus')

export function formCreateApplicationStatusInsert() {
  formCreateApplicationStatus.checkboxClick('.checkbox-morning-flag')
  formCreateApplicationStatus.checkboxClick('.checkbox-afternoon-flag')
  formCreateApplicationStatus.typingClear('.input-detail', "ทดสอบ ๆ รายละเอียด")
}

export function formInsertS301() {
  applicationForm.selectFirst('.select-equipment-type')
  applicationForm.inputTyping('.input-qty', "3")
}

export function formInsertS302() {
  applicationForm.selectFirst('.select-m-business-type')
}

