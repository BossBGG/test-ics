import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest301,
  insertRequest302,
  insertRequest303,
  insertRequest304,
  insertRequest305,
  insertRequest306,
  insertRequest307,
  insertRequest308,
  insertRequest309,
  insertRequest310,
  insertRequest311,
  insertRequest312,
  insertRequest313,
  insertRequest314,
  insertRequest315,
  insertRequest316,
  insertRequest317,
  insertRequest318,
  insertRequest319,
  insertRequest320,
  insertRequest321,
  insertRequest322,
  insertRequest323,
  insertRequest329,
  reviewSubmitUnhappy,
} from "./func/request";
import { baseUrl } from "./func/env";
import { saveCookies, restoreCookies } from "./func/cookie";
import { useInput, useClearInput, Please } from "./func/input";
import { createCase1 } from "./func/createBp";

beforeEach(() => {
  ssoLogin();
});

describe("Review Page", () => {
  it('Request S302 | บันทึก', () => {
    cy.wrap(insertRequest302()).then(data => {
      Cypress.env('requestId', data.request_id);
      reviewSubmit(data)
    })
  });

  it('รายละเอียดคำร้อง บุคคลธรรมดา (คนไทย)', () => {
    const requestId = Cypress.env('requestId') ?? '9f80429b-e6e0-4cef-a8ca-7bec11296402'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}createBp/${requestId}`)
    cy.url().should('eq', `${baseUrl}createBp/${requestId}`)

    useClearInput("#thaiPeople")
    Please.select(['คำนำหน้าชื่อ', 'เพศ', 'วัน เดือน ปี เกิด'])
    Please.input(['หมายเลขบัตรประชาชน', 'ชื่อ', 'นามสกุล'])

    useClearInput('#formAddressIDcard')
    useClearInput('#formAddressService')
    useClearInput('#formAddressBilling')
    Please.select(['จังหวัด', 'อำเภอ / เขต'])
    Please.input(['บ้านเลขที่'])

  })
});
