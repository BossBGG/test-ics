export function splitTextWith(text, symbol) {
  if (text === "" || text === null) {
    return "";
  }
  if (typeof text !== "string")
    throw new TypeError('The "text" parameter must be a string.');
  const result = text.split(symbol);
  return result;
}

export function useTitleFormAddressIDcard() {
  const businessPartnerStore = useBusinessPartnerStore();
  const { businessPartnerForm } = storeToRefs(businessPartnerStore);

  const title = computed(() => {
    let text;
    switch (businessPartnerForm.value.legal_type) {
      case BUSINESS_PARTNER.TYPE1.value:
        text = "ที่อยู่ตามบัตรประชาชน";
        break;
      case BUSINESS_PARTNER.TYPE3.value:
        text = "ที่อยู่ที่ใช้จดทะเบียนบริษัท";
        break;
      case BUSINESS_PARTNER.TYPE4.value:
        text = "ที่อยู่ที่ใช้จดหน่วยงานราชการ";
        break;
      default:
        text = "ที่อยู่ตามบัตรประชาชน";
    }
    return text;
  });

  return title.value;
}

export function useTitleSameFormAddressIDcard() {
  const businessPartnerStore = useBusinessPartnerStore();
  const { businessPartnerForm } = storeToRefs(businessPartnerStore);

  const checkbox = computed(() => {
    let text;
    switch (businessPartnerForm.value.legal_type) {
      case BUSINESS_PARTNER.TYPE1.value:
        text = "ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรประชาชน";
        break;
      case BUSINESS_PARTNER.TYPE2.value:
        text = "ใช้ที่อยู่เดียวกับที่อยู่สำหรับขอรับบริการ";
        break;
      case BUSINESS_PARTNER.TYPE3.value:
        text = "ใช้ที่อยู่เดียวกับที่อยู่ที่ใช้จดทะเบียนบริษัท";
        break;
      case BUSINESS_PARTNER.TYPE4.value:
        text = "ใช้ที่อยู่เดียวกับที่อยู่ที่ใช้จดหน่วยงานราชการ";
        break;
      default:
        text = "";
    }
    return text;
  });

  return checkbox.value;
}

export function hasSameWord(str1, str2) {
  const words1 = str1.split(/[^\w]+/).filter(Boolean);
  const words2 = str2.split(/[^\w]+/).filter(Boolean);

  const wordsSet = new Set(words1);

  for (const word of words2) {
    if (wordsSet.has(word)) {
      return true;
    }
  }

  return false;
}

export const BUTTON_TEXT = {
  PREV: "ย้อนกลับ",
  NEXT: "ถัดไป",
  APPROVE: "อนุมัติ",
  REJECT: "ไม่อนุมัติ",
  PASS: "ผ่าน",
  FAIL: "ไม่ผ่าน",
  SAVE: "บันทึก",
  REQUEST: {
    EDIT: "แก้ไขคำร้อง",
    SAVE: "บันทึกและค้นหาข้อมูล BP",
    CANCEL: "ยกเลิกคำร้อง",
    TRANSFER: "โอนคำร้อง"
  },
  BP: {
    SAVE: "",
    SEARCH: "ค้นหา BP",
    SAVESURVEY: "บันทึกและสำรวจ",
    SAVEQUOTATION: "บันทึกและออกใบเสนอราคา",
  },
  SURVEY: {
    EDIT: "แก้ไขงานสำรวจ",
    SAVE: "บันทึกและรอผลสำรวจ",
    NEXT: "ไปหน้าผลสำรวจ",
  },
  QUOTATION: {
    EDIT: "แก้ไขใบเสนอราคา",
    SAVE: "บันทึกคำร้องและใบเสนอราคา",
    CANCEL: "ยกเลิกใบเสนอราคา",
    PRINT: "พิมพ์ใบเสนอราคา",
  },
};

export function splitDate(dateString) {
  if (typeof dateString !== "string" || dateString.length !== 8) {
    throw new Error("Invalid date string. It must be in YYYYMMDD format.");
  }

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return {
    year: year,
    month: month,
    day: day,
    fullDate: year + "/" + month + "/" + day,
  };
}
