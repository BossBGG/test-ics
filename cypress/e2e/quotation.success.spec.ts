import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest301,
  insertRequest302,
} from "./func/request";
import { baseUrl, user, mockUser } from './func/env'
import { saveCookies, restoreCookies } from "./func/cookie";
import { useInput } from "./func/input";
import { mockUserLogin } from "./func/mock";
beforeEach(() => {
  ssoLogin()
})

const approverId = 510706

describe('Quotation กรณีมีการสำรวจ', () => {

  it('Request S302 | บันทึก', () => {
    cy.wrap(insertRequest302()).then(data => {
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

  it('Survey', () => {
    const requestId = Cypress.env('requestId') ?? '8e76a073-6979-4277-8129-44107ff1e0de'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}survey/${requestId}`)
    cy.url().should('eq', `${baseUrl}survey/${requestId}`).wait(40000)

    const surveyFormsurveyForm = useInput('#surveyForm')
    surveyFormsurveyForm.selectFirst(".surveyman-select")
    cy.get('.esri-search__input', { timeout: 20000 }).type('บ้านลาด')
    cy.get('.esri-search__submit-button').click()
    cy.get('.gis-submit-btn', { timeout: 40000 }).click({ timeout: 20000 })

    cy.get('.survey-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 20000 })
    // cy.screenshot()
  })

  it('Survey History', () => {
    const requestId = Cypress.env('requestId') ?? 'e1a29435-ea9b-406c-a636-e74a865ba858'
    cy.visit(`${baseUrl}survey/history/${requestId}`)
    cy.url().should('eq', `${baseUrl}survey/history/${requestId}`).wait(10000)

    cy.get('.save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 20000 })
    // cy.screenshot()
  })

  it('Quotation', () => {
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    const autoQts = [
      {
        name: 1,
        qty: 2,
        unitPrice: 2,
        discount: 1000
      },
      {
        name: 2,
        qty: 1,
        unitPrice: 2,
        discount: 599
      },
      {
        name: 3,
        qty: 4,
        unitPrice: 2129,
        discount: 0
      },
      {
        name: 4,
        qty: 4,
        unitPrice: 1999,
        discount: 0
      }
    ]

    const approver = useInput(`.approver`)
    approver.inputTyping('.qt-approver', approverId + '{downArrow}{Enter}')


    autoQts.forEach((q, index) => {
      const qtPriceRow = useInput(`.qt-price-${index}`)
      qtPriceRow.select(".qt-name", q.name)
      qtPriceRow.inputTypingClear(".qt-qty", q.qty)
      qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice)
      qtPriceRow.inputTyping(".qt-discount", q.discount)

      if ((index + 1) < autoQts.length) {
        cy.get('.add-qt', { timeout: 20000 }).click({ timeout: 20000 })
      }
    })

    cy.get('.qt-save', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })

    // cy.screenshot()
  })

  it('Approve Quotation', () => {
    mockUserLogin(approverId)
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    cy.get('.qt-approve-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('อนุมัติสำเร็จ', { timeout: 20000 })

    // cy.screenshot()
  })


  it('Print Quotation', () => {
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    cy.get('.qt-print-btn', { timeout: 20000 }).click({ timeout: 20000 })
  })

})

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


  it('Quotation', () => {
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    const autoQts = [
      {
        name: 1,
        qty: 2,
        unitPrice: 2,
        discount: 1000
      },
      {
        name: 2,
        qty: 1,
        unitPrice: 2,
        discount: 599
      },
      {
        name: 3,
        qty: 4,
        unitPrice: 2129,
        discount: 0
      },
      {
        name: 4,
        qty: 4,
        unitPrice: 1999,
        discount: 0
      }
    ]

    const approver = useInput(`.approver`)
    approver.inputTyping('.qt-approver', approverId + '{downArrow}{Enter}')


    autoQts.forEach((q, index) => {
      const qtPriceRow = useInput(`.qt-price-${index}`)
      qtPriceRow.select(".qt-name", q.name)
      qtPriceRow.inputTypingClear(".qt-qty", q.qty)
      qtPriceRow.inputTyping(".qt-unit-price", q.unitPrice)
      qtPriceRow.inputTyping(".qt-discount", q.discount)

      if ((index + 1) < autoQts.length) {
        cy.get('.add-qt', { timeout: 20000 }).click({ timeout: 20000 })
      }
    })

    cy.get('.qt-save', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })

    // cy.screenshot()
  })

  it('Approve Quotation', () => {
    mockUserLogin(approverId)
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    cy.get('.qt-approve-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.get('.app-confirm-save-btn', { timeout: 20000 }).click({ timeout: 20000 })
    cy.contains('อนุมัติสำเร็จ', { timeout: 20000 })

    // cy.screenshot()
  })


  it('Print Quotation', () => {
    const requestId = Cypress.env('requestId') ?? 'd75f9f9a-c062-4a6a-9bed-ff5b5bf5c192'
    cy.log('REQUEST ID', requestId)

    cy.visit(`${baseUrl}quotation/${requestId}`)
    cy.url().should('eq', `${baseUrl}quotation/${requestId}`).wait(10000)


    cy.get('.qt-print-btn', { timeout: 20000 }).click({ timeout: 20000 })
  })

})
