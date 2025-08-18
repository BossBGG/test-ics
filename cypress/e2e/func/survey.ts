import { baseUrl } from "./env";
import { useInput, inputTypingClear ,Please } from "./input";

export const surveySubmit = (data) => {

  const requestId = data.request_id

  cy.visit(`${baseUrl}survey/${requestId}`)
  cy.url().should('eq', `${baseUrl}survey/${requestId}`).wait(10000)

  const surveyForm = useInput('#surveyForm')
  surveyForm.selectFirst(".surveyman-select")
  cy.get('.esri-search__input', { timeout: 30000 }).type('บ้านลาด')
  cy.get('.esri-search__submit-button').click()
  cy.get('.gis-submit-btn', { timeout: 40000 }).click({ timeout: 30000 })

  const formCustomerType = useInput("#formCustomerType");
  formCustomerType.inputTypingClear(".input-home-telephone", "0875822476");
  formCustomerType.inputTypingClear(".input-mobile", "0875822476");
  formCustomerType.inputTypingClear(".input-fax", "xxxxxxxxx");
  formCustomerType.inputTypingClear(".input-email", "dabornz@gmail.com");

  cy.get('.survey-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
  cy.get('.app-confirm-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
  cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 30000 })
};

export const surveyHistorySubmit = (data) => {

  const requestId = data.request_id

  cy.visit(`${baseUrl}survey/history/${requestId}`)
  cy.url().should('eq', `${baseUrl}survey/history/${requestId}`).wait(10000)

  cy.get('.save-btn', { timeout: 30000 }).click({ timeout: 30000 })
  cy.get('.app-confirm-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
  cy.contains('บันทึกข้อมูลสำเร็จ', { timeout: 30000 })
};

export const surveySubmitFail = (data) => {

  const requestId = data.request_id

  cy.visit(`${baseUrl}survey/${requestId}`)
  cy.url().should('eq', `${baseUrl}survey/${requestId}`).wait(10000)

  const formCustomerType = useInput("#formCustomerType");
  formCustomerType.inputTypingClear(".input-home-telephone", "0875822476");
  formCustomerType.inputTypingClear(".input-mobile", "0875822476");
  formCustomerType.inputTypingClear(".input-fax", "xxxxxxxxx");
  formCustomerType.inputTypingClear(".input-email", "dabornz@gmail.com");

  cy.get('.survey-save-btn', { timeout: 30000 }).click({ timeout: 30000 })

  Please.select(['ผู้ดำเนินการสำรวจ'])

};
