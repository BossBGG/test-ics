import { baseUrl, user, password, mockUser } from './env'
import { mockUserLogin } from './mock'
export const ssoLogin = () => {

  mockUserLogin(mockUser)

  cy.visit(baseUrl)
  cy.url().should('eq', baseUrl)
  // cy.url().should('match', /^https:\/\/sso2\.pea\.co\.th\/realms\/pea-users\/protocol\/openid-connect\/auth/, { timeout: 10000 })
  cy.get('#username')
    .type(user)
  cy.get('#password')
    .type(password + '{Enter}')
  // cy.contains(user, { timeout: 20000 })
  cy.wait(5000);

  // cy.saveKeycloakData();
  // cy.saveLocalStorage();
}
