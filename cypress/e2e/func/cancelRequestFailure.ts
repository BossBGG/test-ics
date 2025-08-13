import { useInput } from "./input";
import { baseUrl } from "./env";

import { reviewSubmit } from "./request";
import { createCase1 } from "./createBp";

import { mockUserLogin } from "./mock";

import {
  formThaiPeopleInsert,
  formIdCardInsert,
  formAddressServiceSameAddressClick,
  formAddressBillingSameAddressClick,
  formElectricityUserInsert,
} from "./formCreateBp";

import {
  formCreateApplicationStatusInsert,
  formInsertS301,
  formInsertS302,
} from "./formApplication";

const originalId = 421109;
const approverId = 510706;

// ไม่มี survey
export const failureCancelRequest = (data) => {
  cy.wait(500).visit(`${baseUrl}request/${data.request_id}`);
  cy.url().should("eq", `${baseUrl}request/${data.request_id}`);
  cy.contains("ข้อมูลผู้ใช้ไฟฟ้า", { timeout: 30000 });
  cy.wait(1000);
  cancelFailure();
};

export const failureCancelCreate = (data) => {
  reviewSubmit(data);

  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  cancelFailure();
};

export const failureCancelApplication = (data) => {
  reviewSubmit(data);

  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  cancelFailure();
};

export const failureCancelQuotation = (data) => {
  reviewSubmit(data);
  createCase1(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
    {
      name: 3,
      qty: 4,
      unitPrice: 2129,
      discount: 0,
    },
    {
      name: 4,
      qty: 4,
      unitPrice: 1999,
      discount: 0,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cancelFailure();
};

// มี survey
export const failureCancelSurvey = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //------------------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  //------------------------------------------------------------------------
  cancelFailure();
};

export const failureCancelSurveyHistory = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // ------------------------------------------------------------------------
  cancelFailure();
};

export const failureCancelHistoryQuotation = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า history------------------------------------------------------------------------
  cy.get(".save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // ------------------------------------------------------------------------
  cancelFailure();
};

//* ต้องใช้ร่วมกัน cancelQuotationRequestApprover กับ changeUser*/
//* คน Request เป็นคนยกเลิก กรณีอนุมัตใบเสนอราคา
export const failureCancelApprover = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า history----------------------------------------------------------
  cy.get(".save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า quotation---------------------------------------------------------

  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
    {
      name: 3,
      qty: 4,
      unitPrice: 2129,
      discount: 0,
    },
    {
      name: 4,
      qty: 4,
      unitPrice: 1999,
      discount: 0,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  mockUserLogin(approverId);
  // cy.log("REQUEST ID", requestId);
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cy.get(".qt-approve-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("อนุมัติสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);
  cancelFailure();
};

//* คน Request เป็นคนยกเลิก กรณีไม่่อนุมัตใบเสนอราคา
export const failureCancelQuotationRequestApprover = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า history----------------------------------------------------------
  cy.get(".save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า quotation---------------------------------------------------------

  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
    {
      name: 3,
      qty: 4,
      unitPrice: 2129,
      discount: 0,
    },
    {
      name: 4,
      qty: 4,
      unitPrice: 1999,
      discount: 0,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  mockUserLogin(approverId);
  // cy.log("REQUEST ID", requestId);
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cy.get(".qt-reject-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("ไม่อนุมัติสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);
};

//* คน Request เป็นคนยกเลิก
export const failureChangeUser = (data) => {
  mockUserLogin(originalId);
  const requestId =
    Cypress.env("requestId") ?? "d75f9f9a-c062-4a6a-9bed-ff5b5bf5c192";
  // cy.log('REQUEST ID', requestId)
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cancelFailure();
};

//* คน Approver เป็นคนยกเลิก กรณีอนุมัตใบเสนอราคา
export const failureCancelQuotationApprover = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า history----------------------------------------------------------
  cy.get(".save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า quotation---------------------------------------------------------

  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
    {
      name: 3,
      qty: 4,
      unitPrice: 2129,
      discount: 0,
    },
    {
      name: 4,
      qty: 4,
      unitPrice: 1999,
      discount: 0,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  mockUserLogin(approverId);

  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cy.get(".qt-approve-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("อนุมัติสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cancelFailure();
};

//* คน Approver เป็นคนยกเลิก กรณีไม่่อนุมัตใบเสนอราคา
export const failureCancelQuotationUserApprover = (data) => {
  reviewSubmit(data);
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const thaiPeople = useInput("#thaiPeople");
  thaiPeople.typing(".idCard", "3908042041779");
  thaiPeople.inputTyping(".birthDate", "18/03/1997");
  thaiPeople.selectFirst(".select-title-name");
  thaiPeople.inputTyping(".firstName", "ออโต้บอท");
  thaiPeople.inputTyping(".lastName", "ทดสอบ");
  thaiPeople.selectFirst(".select-gender");
  thaiPeople.selectFirst(".select-martial-status");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "075");
  formAddressIDcard.typing(".floor", "2");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่");
  formAddressIDcard.typing(".house_no", "102/24");
  formAddressIDcard.typing(".moo", "6");
  formAddressIDcard.typing(".street", "ลาดยาง");
  formAddressIDcard.typing(".lane", "แตร่ก");
  formAddressIDcard.typing(".alley", "ตัน");
  formAddressIDcard.selectFirst(".select-province");
  formAddressIDcard.selectFirst(".select-district");
  formAddressIDcard.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "xxxxxxxxx");
  formElectricityUser.inputTypingClear(".input-email", "dabornz@gmail.com");
  //------------------------------------------------------------------------
  cy.get(".create-bp-next").click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  //------------------------------------------------------------------------
  cy.wait(1000)
    .get(".app-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  //------------------------------------------------------------------------
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  //ไปหน้า survey------------------------------------------------------------
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า history----------------------------------------------------------
  cy.get(".save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });

  // ไปหน้า quotation---------------------------------------------------------

  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
    {
      name: 3,
      qty: 4,
      unitPrice: 2129,
      discount: 0,
    },
    {
      name: 4,
      qty: 4,
      unitPrice: 1999,
      discount: 0,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  mockUserLogin(approverId);
  // cy.log("REQUEST ID", requestId);
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cy.get(".qt-reject-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("ไม่อนุมัติสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.visit(`${baseUrl}quotation/${requestId}`);
  cy.url().should("eq", `${baseUrl}quotation/${requestId}`).wait(10000);

  cancelFailure();
};

//กรณี Walk in ไม่มี survey
export const failureCancelCreateWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS301();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  cancelFailure();
};

//กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Approver ยกเลิก)
export const failureCancelApproverQuotationWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS301();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // --------------------------------------------------------------------------------
  mockUserLogin(approverId);
  // --------------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------
  cy.get(".qt-approve-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("อนุมัติสำเร็จ", { timeout: 20000 });
  // --------------------------------------------------------------------------------
  cancelFailure();
};

//กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Approver ยกเลิก)
export const failureCancelRejectQuotationWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS301();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // --------------------------------------------------------------------------------
  mockUserLogin(approverId);
  // --------------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------
  cy.get(".qt-reject-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("ไม่อนุมัติสำเร็จ", { timeout: 20000 });

  // --------------------------------------------------------------------------------
  cancelFailure();
};

//กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Request ยกเลิก)
export const failureCancelRequestQuotationWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS301();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // --------------------------------------------------------------------------------
  mockUserLogin(approverId);
  // --------------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------
  cy.get(".qt-approve-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("อนุมัติสำเร็จ", { timeout: 20000 });

  // -----

  mockUserLogin(originalId);
  cy.reload();
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  cancelFailure();
};

//กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Request  ยกเลิก)
export const failureCancelRejectRequestQuotationWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS301();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  const autoQts = [
    {
      name: 1,
      qty: 2,
      unitPrice: 2,
      discount: 1000,
    },
    {
      name: 2,
      qty: 1,
      unitPrice: 2,
      discount: 599,
    },
  ];

  const approver = useInput(`.approver`);
  approver.inputTyping(".qt-approver", approverId + "{downArrow}{Enter}");

  autoQts.forEach((q, index) => {
    const qtPriceRow = useInput(`.qt-price-${index}`);
    qtPriceRow.select(".qt-name", q.name);
    qtPriceRow.inputTypingClear(".qt-qty", q.qty);
    qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice);
    qtPriceRow.inputTyping(".qt-discount", q.discount);

    if (index + 1 < autoQts.length) {
      cy.get(".add-qt", { timeout: 20000 }).click({ timeout: 20000 });
    }
  });
  cy.get(".qt-save", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  // --------------------------------------------------------------------------------
  mockUserLogin(approverId);
  // --------------------------------------------------------------------------------
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------
  cy.get(".qt-reject-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.get(".app-confirm-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.contains("ไม่อนุมัติสำเร็จ", { timeout: 20000 });

  // --

  mockUserLogin(originalId);
  cy.reload();

  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
  // --------------------------------------------------------------------------------
  cancelFailure();
};

//กรณี Walk in มี survey ยกเลิกหน้า survey WalkInCase
export const failureCancelSurveyWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S302`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS302();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
  cancelFailure();
};

//กรณี Walk in มี survey ยกเลิกหน้า history WalkInCase
export const failureCancelHistoryWalkInCase = () => {
  cy.visit(`${baseUrl}searchBp?service=S302`, { timeout: 20000 });
  cy.wait(2000)
    .url()
    .should("match", /(?<baseUrl>.+)createBp/);
  formThaiPeopleInsert();
  formIdCardInsert();
  formAddressServiceSameAddressClick();
  formAddressBillingSameAddressClick();
  formElectricityUserInsert();
  cy.get(".create-bp-next").click({ timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)application/);
  formInsertS302();
  formCreateApplicationStatusInsert();
  cy.get(".app-save-btn").click({ timeout: 20000 });
  cy.wait(1000)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 50000 });
  cy.wait(500).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
  cy.wait(4000).get("#btn-close-alert").click({ force: true, timeout: 20000 });
  const surveyFormsurveyForm = useInput("#surveyForm");
  surveyFormsurveyForm.selectFirst(".surveyman-select");
  cy.get(".survey-save-btn", { timeout: 20000 }).click({ timeout: 20000 });
  cy.wait(500)
    .get(".app-confirm-save-btn", { timeout: 20000 })
    .click({ timeout: 20000 });
  cy.contains("บันทึกข้อมูลสำเร็จ", { timeout: 20000 });
  cy.get("#btn-close-alert").click({ force: true, timeout: 20000 });
  cancelFailure();
};

export const cancelFailure = () => {
  cy.wait(500)
    .get(".btn-cancel-request", { timeout: 20000 })
    .click({ force: true, timeout: 20000 });
  cy.get(".app-confirm-cancel-btn").click({ timeout: 20000 });
  cy.contains("กรุณาระบุหมายเหตุ", { timeout: 30000 });
};
