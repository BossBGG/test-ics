export const BUSINESS_PARTNER = {
  TYPE1: {
    value: 1,
    name: "thai",
    label: 'บุคคลธรรมดา <br class="show_sm_mb"/> (คนไทย)',
  },
  TYPE2: {
    value: 2,
    name: "foreigner",
    label: 'บุคคลธรรมดา <br class="show_sm_mb"/> (คนต่างชาติ)',
  },
  TYPE3: {
    value: 3,
    name: "legal_entity",
    label: "นิติบุคคล",
  },
  TYPE4: {
    value: 4,
    name: "government",
    label: "หน่วยงานราชการ",
  },
};

export const DISCOUNTS = [
  {
    value: "1",
    label: "เปอร์เซ็นต์",
    sign: "%",
  },
  {
    value: "2",
    label: "บาท",
    sign: "บาท",
  },
];

export const PUBLISH_OPTIONS = [
  {
    value: "wait_publish",
    label: "กำหนดเวลาเผยแพร่",
  },
  {
    value: "publish",
    label: "ไม่กำหนดเวลาเผยแพร่",
  },
];

export const DISCOUNTS_SIGN = (value) => {
  return DISCOUNTS.find((item) => item.value == value)?.sign || "-";
};

export function isHasValueInItems(id, items) {
  return computed(() => {
    return items.some((item) => item.id == id);
  });
}
