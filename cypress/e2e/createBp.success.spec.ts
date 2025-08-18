import { ssoLogin } from "./func/peaSso";
import { reviewSubmit, insertRequest301 } from "./func/request";
import { baseUrl } from "./func/env";
import { saveCookies, restoreCookies } from "./func/cookie";
import { useInput } from "./func/input";
import {
  createCase1,
  createCase2,
  createCase3,
  createCase4,
} from "./func/createBp";

beforeEach(() => {
  ssoLogin();
});

// describe('Review Page', () => {
//   it('บันทึก BP | E-Service', () => {
//     cy.wrap(insertRequest301()).then(data => {
//       Cypress.env('requestId', data.request_id);
//       cy.visit(`${baseUrl}request/${data.request_id}`)
//       cy.url().should('eq', `${baseUrl}request/${data.request_id}`)
//       cy.wait(1000).contains('ข้อมูลผู้ใช้ไฟฟ้า', { timeout: 10000 })
//       cy.contains('บันทึกและค้นหาข้อมูล BP', { timeout: 10000 }).click({ timeout: 10000 })
//       cy.get('.request-submit', { timeout: 10000, force: true }).click({ timeout: 10000 })
//       cy.get('#btn-close-alert').click({ force: true, timeout: 20000 })
//       cy.wait(1000).url({ timeout: 10000 }).should('eq', `https://ics.pea.co.th/authentication/login`)
//     })
//   })

//   it('รายละเอียดคำร้อง บุคคลธรรมดา (คนไทย)', () => {
//     const requestId = Cypress.env('requestId') ?? '0d6d50e0-7fd2-45b1-905d-85c611d7948f'
//     cy.visit(`${baseUrl}createBp/${requestId}`)
//     cy.url().should('eq', `${baseUrl}createBp/${requestId}`)
//     // thaiPeople Card -----------------------------------------------------------------
//     const thaiPeople = useInput('#thaiPeople')
//     thaiPeople.typing('.idCard', '3908042041779')
//     thaiPeople.inputTyping('.birthDate', "18/03/1997")
//     thaiPeople.selectFirst('.select-title-name')
//     thaiPeople.inputTyping('.firstName', "ออโต้บอท")
//     thaiPeople.inputTyping('.lastName', "ทดสอบ")
//     thaiPeople.selectFirst('.select-title-name')
//     thaiPeople.selectFirst('.select-gender')
//     thaiPeople.selectFirst('.select-martial-status')
//     // thaiPeople ID Card Address ------------------------------------------------------
//     const formAddressIDcard = useInput('#formAddressIDcard')
//     formAddressIDcard.typing('.room-no', '075')
//     formAddressIDcard.typing('.floor', '2')
//     formAddressIDcard.typing('.house_name', 'บ้านน่าอยู่')
//     formAddressIDcard.typing('.house_no', '102/24')
//     formAddressIDcard.typing('.moo', '6')
//     formAddressIDcard.typing('.street', 'ลาดยาง')
//     formAddressIDcard.typing('.lane', 'แตร่ก')
//     formAddressIDcard.typing('.alley', 'ตัน')
//     formAddressIDcard.selectFirst('.select-province')
//     formAddressIDcard.selectFirst('.select-district')
//     formAddressIDcard.selectFirst('.select-sub-district')
//     // thaiPeople Service Address ------------------------------------------------------
//     const formAddressService = useInput('#formAddressService')
//     formAddressService.checkboxClick('.checkbox-same-address')
//     // thaiPeople Billing Address ------------------------------------------------------
//     const formAddressBilling = useInput('#formAddressBilling')
//     formAddressBilling.checkboxClick('.checkbox-same-address')
//     // thaiPeople User Information -----------------------------------------------------
//     const formElectricityUser = useInput('#formElectricityUser')
//     formElectricityUser.inputTypingClear('.input-home-telephone', "0875822476")
//     formElectricityUser.inputTypingClear('.input-mobile', "0875822476")
//     formElectricityUser.inputTypingClear('.input-fax', "xxxxxxxxx")
//     formElectricityUser.inputTypingClear('.input-email', "dabornz@gmail.com")
//     // thaiPeople Go Next --------------------------------------------------------------
//     cy.get('.create-bp-next').click({ timeout: 20000 })
//     // thaiPeople Check Url Is Application ---------------------------------------------
//     cy.wait(500).url().should('match', /(?<baseUrl>.+)application/)
//     // thaiPeople Application Go Next --------------------------------------------------
//     cy.get('.app-save-btn').click({ timeout: 20000 })
//     cy.wait(1000).get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
//     // thaiPeople Save Success ---------------------------------------------------------
//     cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 50000 })
//     cy.get('#btn-close-alert').click({ force: true, timeout: 20000 })
//     // thaiPeople Check Url Is Quotation ---------------------------------------------
//     cy.wait(500).url().should('match', /(?<baseUrl>.+)quotation/)
//   })
// })

describe("CreateBP Page", () => {
  it("รายละเอียดคำร้อง บุคคลธรรมดา", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      createCase1(data);
    });
  });

  it("รายละเอียดคำร้อง บุคคลธรรมดา (คนต่างชาติ)", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      createCase2(data);
    });
  });

  it("รายละเอียดคำร้อง นิติบุคคล (แบบกรอกข้อมูล)", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      createCase3(data);
    });
  });

  it("รายละเอียดคำร้อง นิติบุคคล (แบบกรอกค้นหา)", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      createCase4(data);
    });
  });

  it("รายละเอียดคำร้อง หน่วยงานราชการ (แบบกรอกข้อมูล)", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      createCase4(data);
    });
  });
});
