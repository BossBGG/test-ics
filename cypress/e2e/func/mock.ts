
export function mockUserLogin(userId) {
  cy.window().then((win) => {
    if (userId) {
      win.localStorage.setItem('mockUser', userId);
    }
  });
}