import { baseUrl } from "./env";
import { useInput } from "./input";

// รายละเอียดคำร้อง บุคคลธรรมดา
export const createCase1 = (data) => {
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
};

export const createCase1Survey = (data) => {
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
};

// รายละเอียดคำร้อง บุคคลธรรมดา (คนต่างชาติ)
export const createCase2 = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 1);
  //------------------------------------------------------------------------
  const foreignerPeople = useInput("#foreignerPeople");
  foreignerPeople.inputTyping(".idPassport", "A123456");
  foreignerPeople.inputTyping(".birthDate", "18/03/1997");
  foreignerPeople.selectFirst(".select-title-name");
  foreignerPeople.inputTyping(".firstName", "ออโต้บอท");
  foreignerPeople.inputTyping(".lastName", "ทดสอบสัญชาติ");
  foreignerPeople.selectFirst(".select-gender");
  foreignerPeople.selectFirst(".select-martial-status");
  foreignerPeople.selectFirst(".select-nationality");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.typing(".room-no", "075");
  formAddressService.typing(".floor", "2");
  formAddressService.typing(".house_name", "บ้านน่าอยู่");
  formAddressService.typing(".house_no", "102/24");
  formAddressService.typing(".moo", "6");
  formAddressService.typing(".street", "ลาดยาง");
  formAddressService.typing(".lane", "แตร่ก");
  formAddressService.typing(".alley", "ตัน");
  formAddressService.selectFirst(".select-province");
  formAddressService.selectFirst(".select-district");
  formAddressService.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
};

export const createCase2Survey = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 1);
  //------------------------------------------------------------------------
  const foreignerPeople = useInput("#foreignerPeople");
  foreignerPeople.inputTyping(".idPassport", "A123456");
  foreignerPeople.inputTyping(".birthDate", "18/03/1997");
  foreignerPeople.selectFirst(".select-title-name");
  foreignerPeople.inputTyping(".firstName", "ออโต้บอท");
  foreignerPeople.inputTyping(".lastName", "ทดสอบสัญชาติ");
  foreignerPeople.selectFirst(".select-gender");
  foreignerPeople.selectFirst(".select-martial-status");
  foreignerPeople.selectFirst(".select-nationality");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.typing(".room-no", "075");
  formAddressService.typing(".floor", "2");
  formAddressService.typing(".house_name", "บ้านน่าอยู่");
  formAddressService.typing(".house_no", "102/24");
  formAddressService.typing(".moo", "6");
  formAddressService.typing(".street", "ลาดยาง");
  formAddressService.typing(".lane", "แตร่ก");
  formAddressService.typing(".alley", "ตัน");
  formAddressService.selectFirst(".select-province");
  formAddressService.selectFirst(".select-district");
  formAddressService.selectFirst(".select-sub-district");
  //------------------------------------------------------------------------
  const formAddressBilling = useInput("#formAddressBilling");
  formAddressBilling.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  const formElectricityUser = useInput("#formElectricityUser");
  formElectricityUser.inputTypingClear(".input-home-telephone", "0875822476");
  formElectricityUser.inputTypingClear(".input-mobile", "0875822476");
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
};

// รายละเอียดคำร้อง นิติบุคคล (แบบกรอกข้อมูล)
export const createCase3 = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 2);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-legal-entity");
  boxLegalEntity.typing(".input-legal-entity", "1234567891011");
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.inputTyping(".legal-entity-name", "นายเทสออโต้");
  boxLegalEntity.radioClick(".option-business-type-code", 1);
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "099");
  formAddressIDcard.typing(".floor", "9");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่9");
  formAddressIDcard.typing(".house_no", "99/99");
  formAddressIDcard.typing(".moo", "9");
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
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
};

export const createCase3Survey = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 2);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-legal-entity");
  boxLegalEntity.typing(".input-legal-entity", "1234567891011");
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.inputTyping(".legal-entity-name", "นายเทสออโต้");
  boxLegalEntity.radioClick(".option-business-type-code", 1);
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "099");
  formAddressIDcard.typing(".floor", "9");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่9");
  formAddressIDcard.typing(".house_no", "99/99");
  formAddressIDcard.typing(".moo", "9");
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
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
};

// รายละเอียดคำร้อง นิติบุคคล (แบบกรอกค้นหา)
export const createCase4 = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 2);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-legal-entity");
  boxLegalEntity.typing(".input-legal-entity", "0105565005891");
  cy.get(".search-ID").click({ timeout: 20000 });
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.radioClick(".option-business-type-code", 1);
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "-");
  formAddressIDcard.typing(".floor", "-");
  formAddressIDcard.typing(".moo", "-");
  formAddressIDcard.typing(".lane", "-");
  formAddressIDcard.typing(".alley", "-");
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
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
};

export const createCase4Survey = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 2);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-legal-entity");
  boxLegalEntity.typing(".input-legal-entity", "0105565005891");
  cy.get(".search-ID").click({ timeout: 20000 });
  cy.wait(1000)
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.radioClick(".option-business-type-code", 1);
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.inputTypingClear(".house_no", "99/99");
  formAddressIDcard.typing(".room-no", "-");
  formAddressIDcard.typing(".floor", "-");
  formAddressIDcard.typing(".moo", "-");
  formAddressIDcard.typing(".lane", "-");
  formAddressIDcard.typing(".alley", "-");
  //------------------------------------------------------------------------
  const formAddressService = useInput("#formAddressService");
  formAddressService.checkboxClick(".checkbox-same-address");
  //------------------------------------------------------------------------
  cy.contains("ไม่สามารถดำเนินการได้", { timeout: 50000 });
};

// รายละเอียดคำร้อง หน่วยงานราชการ (แบบกรอกข้อมูล)
export const createCase5 = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 3);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-government");
  boxLegalEntity.typing(".input-government", "1234567891011");
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.inputTyping(".government-name", "นายเทสออโต้");
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "099");
  formAddressIDcard.typing(".floor", "9");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่9");
  formAddressIDcard.typing(".house_no", "99/99");
  formAddressIDcard.typing(".moo", "9");
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
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)quotation/);
};

export const createCase5Survey = (data) => {
  const requestId = data.request_id;
  cy.visit(`${baseUrl}createBp/${requestId}`);
  cy.url().should("eq", `${baseUrl}createBp/${requestId}`);
  cy.wait(1000);
  //------------------------------------------------------------------------
  const customerType = useInput("#card-option");
  customerType.radioClick(".option-form-customer-type", 3);
  //------------------------------------------------------------------------
  const boxLegalEntity = useInput("#box-government");
  boxLegalEntity.typing(".input-government", "1234567891011");
  boxLegalEntity.inputTyping(".tex-number", "1234567891011");
  boxLegalEntity.inputTyping(".branch-code", "1234567891011");
  boxLegalEntity.inputTyping(".government-name", "นายเทสออโต้");
  boxLegalEntity.selectFirst(".select-legal-forms");
  boxLegalEntity.selectFirst(".select-business");
  //------------------------------------------------------------------------
  const formAddressIDcard = useInput("#formAddressIDcard");
  formAddressIDcard.typing(".room-no", "099");
  formAddressIDcard.typing(".floor", "9");
  formAddressIDcard.typing(".house_name", "บ้านน่าอยู่9");
  formAddressIDcard.typing(".house_no", "99/99");
  formAddressIDcard.typing(".moo", "9");
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
  formElectricityUser.inputTypingClear(".input-fax", "999999999");
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
  cy.wait(500)
    .url()
    .should("match", /(?<baseUrl>.+)survey/);
};
