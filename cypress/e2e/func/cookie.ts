export function saveCookies() {
  cy.getCookies().then(cookies => {
    const cookieJson = {};
    cookies.forEach(cookie => {
      cookieJson[cookie.name] = cookie;
    });
    Cypress.env('cookies', cookieJson);
  });
}

export function restoreCookies() {
  const cookies = Cypress.env('cookies');
  if (cookies) {
    Object.values(cookies).forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expiry: cookie.expiry
      });
    });
  }
}
