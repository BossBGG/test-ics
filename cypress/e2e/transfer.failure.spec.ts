import { ssoLogin } from "./func/peaSso";
import { insertRequest303, insertRequest304 } from "./func/request";
import { baseUrl } from './func/env'
import { saveCookies, restoreCookies } from "./func/cookie";
import { Please, useClearSelect } from "./func/input";

beforeEach(() => {
  ssoLogin()
})


describe('Start', () => {
  it('โอนคำร้อง ไม่ระบุพื้นที่ที่รับผิดชอบ', () => {
    cy.wrap(insertRequest304()).then(data => {
      cy.visit(`${baseUrl}request/${data.request_id}`)
      cy.url().should('eq', `${baseUrl}request/${data.request_id}`)
      cy.contains('ข้อมูลผู้ใช้ไฟฟ้า', { timeout: 10000 })
      // cy.get('.esri-search__input', { timeout: 20000 }).type('บ้านลาด')
      cy.get('.esri-search__submit-button').click()
      cy.get('.gis-submit-btn').click()
      cy.get('.request-transfer-btn').click()
      cy.get('.btn-request-confirm-transfer').then(($btn) => {
        if ($btn.is(':disabled')) {
          // cy.get('.select-area-transfer').click(), { timeout: 10000 };

          useClearSelect('.select-area-transfer')
          // cy.get('.q-menu .q-item').first().click(), { timeout: 10000 };
          // cy.get('.btn-request-confirm-transfer').click(), { timeout: 10000 };
          // cy.contains('โอนย้ายคำร้องสำเร็จ', { timeout: 10000 })
        } else {
          useClearSelect('.select-area-transfer')
          cy.get('.btn-request-confirm-transfer').click({ force: true });
          Please.select(['พื้นที่รับผิดชอบ'])
        }
      });
    })
  })
})
