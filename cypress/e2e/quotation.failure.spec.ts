import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest301,
  insertRequest302,
} from "./func/request";
import { baseUrl, user, mockUser } from './func/env'
import { saveCookies, restoreCookies } from "./func/cookie";
import { Please, useInput } from "./func/input";
import { mockUserLogin } from "./func/mock";
beforeEach(() => {
  ssoLogin()
})

const approverId = 510706



describe('Quotation กรณีไม่มีการสำรวจ', () => {

  it('Request S301 | บันทึก', () => {
    cy.wrap(insertRequest301()).then(data => {
      Cypress.env('requestId', data.request_id);
      reviewSubmit(data)
    })
  });

  it('รายละเอียดคำร้อง บุคคลธรรมดา (คนไทย)', () => {
    const requestId = Cypress.env('requestId') ?? '0d6d50e0-7fd2-45b1-905d-85c611d7948f'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}createBp/${requestId}`)
    cy.url().should('eq', `${baseUrl}createBp/${requestId}`)
    // thaiPeople Card -----------------------------------------------------------------
    const thaiPeople = useInput('#thaiPeople')
    thaiPeople.typing('.idCard', '3908042041779')
    thaiPeople.inputTyping('.birthDate', "18/03/1997")
    thaiPeople.selectFirst('.select-title-name')
    thaiPeople.inputTyping('.firstName', "ออโต้บอท")
    thaiPeople.inputTyping('.lastName', "ทดสอบ")
    thaiPeople.selectFirst('.select-title-name')
    thaiPeople.selectFirst('.select-gender')
    thaiPeople.selectFirst('.select-martial-status')
    // thaiPeople ID Card Address ------------------------------------------------------
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
    // thaiPeople Service Address ------------------------------------------------------
    const formAddressService = useInput('#formAddressService')
    formAddressService.checkboxClick('.checkbox-same-address')
    // thaiPeople Billing Address ------------------------------------------------------
    const formAddressBilling = useInput('#formAddressBilling')
    formAddressBilling.checkboxClick('.checkbox-same-address')
    // thaiPeople Go Next --------------------------------------------------------------
    cy.get('.create-bp-next').click()
    // thaiPeople Check Url Is Application ---------------------------------------------
    cy.wait(500).url().should('match', /(?<baseUrl>.+)application\/(?<requestId>.+)/)
    // thaiPeople Application Go Next --------------------------------------------------
    cy.wait(1000).get('.app-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.wait(500).get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    // thaiPeople Save Success ---------------------------------------------------------
    cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 20000 })
    // cy.screenshot()
  })


  it('Quotation ไม่เลือกผู้อนุมัติ', () => {
    const requestId = Cypress.env('requestId') ?? '18a6532e-c801-4ec7-a52e-57738ac777b8'
    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    cy.get('.qt-save', { timeout: 20000 }).click({ timeout: 20000 })
    Please.select(['ผู้ดำเนินการอนุมัติ'])
    // cy.screenshot()
  })

})
