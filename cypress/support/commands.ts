console.log('cmd')
Cypress.Commands.add('saveKeycloakData', () => {
  // Assuming keycloak instance is globally available on the window object
  cy.window().then((win) => {
    const keycloak = win.keycloak;

    if (keycloak && keycloak.authenticated) {
      cy.setLocalStorage('kc_token', keycloak.token);
      cy.setLocalStorage('kc_refreshToken', keycloak.refreshToken);
      cy.setLocalStorage('kc_idToken', keycloak.idToken);
    } else {
      throw new Error('Keycloak is not authenticated');
    }
  });
});


let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
