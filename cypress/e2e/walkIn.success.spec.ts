import { ssoLogin } from "./func/peaSso";
import { baseUrl } from './func/env'
import { saveCookies, restoreCookies } from "./func/cookie";
import { useInput } from "./func/input";
import {
  formThaiPeopleInsert,
  formIdCardInsert,
  formAddressServiceSameAddressClick,
  formAddressBillingSameAddressClick,
  formElectricityUserInsert,
} from "./func/formCreateBp";

import {
  formCreateApplicationStatusInsert,
  formInsertS301,
  formInsertS302
} from "./func/formApplication";

beforeEach(() => {
  ssoLogin()
})

describe('Walk In Case', () => {
  it('บุคคลธรรมดา (คนไทย) | S301 |', () => {
    cy.visit(`${baseUrl}searchBp?service=S301`, { timeout: 20000 })
    cy.wait(2000).url().should('match', /(?<baseUrl>.+)createBp/)
    formThaiPeopleInsert()
    formIdCardInsert()
    formAddressServiceSameAddressClick()
    formAddressBillingSameAddressClick()
    formElectricityUserInsert()
    cy.get('.create-bp-next').click({ timeout: 20000 })
    cy.wait(500).url().should('match', /(?<baseUrl>.+)application/)
    formInsertS301()
    formCreateApplicationStatusInsert()
    cy.get('.app-save-btn').click({ timeout: 20000 })
    cy.wait(1000).get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 50000 })
    cy.get('#btn-close-alert').click({ force: true, timeout: 20000 })
    cy.wait(500).url().should('match', /(?<baseUrl>.+)quotation/)
  })

  it('บุคคลธรรมดา (คนไทย) | S302 |', () => {
    cy.visit(`${baseUrl}searchBp?service=S302`, { timeout: 20000 })
    cy.wait(2000).url().should('match', /(?<baseUrl>.+)createBp/)
    formThaiPeopleInsert()
    formIdCardInsert()
    formAddressServiceSameAddressClick()
    formAddressBillingSameAddressClick()
    formElectricityUserInsert()
    cy.get('.create-bp-next').click({ timeout: 20000 })
    cy.wait(500).url().should('match', /(?<baseUrl>.+)application/)
    formInsertS302()
    formCreateApplicationStatusInsert()
    cy.get('.app-save-btn').click({ timeout: 20000 })
    cy.wait(1000).get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 50000 })
    cy.get('#btn-close-alert').click({ force: true, timeout: 20000 })
    cy.wait(500).url().should('match', /(?<baseUrl>.+)survey/)
  })

})
