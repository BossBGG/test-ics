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
} from "./func/request";
import { baseUrl } from "./func/env";
import { saveCookies, restoreCookies } from "./func/cookie";
import { useInput } from "./func/input";
import { createCase1 } from "./func/createBp";

beforeEach(() => {
  ssoLogin();
});

describe("Review Page", () => {
  it("Request S301 | บันทึก", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
      // createCase1(data);

    });
  });

  it("Request S302 | บันทึก", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S303 | บันทึก", () => {
    cy.wrap(insertRequest303()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S304 | บันทึก", () => {
    cy.wrap(insertRequest304()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S305 | บันทึก", () => {
    cy.wrap(insertRequest305()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S306 | บันทึก", () => {
    cy.wrap(insertRequest306()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S307 | บันทึก", () => {
    cy.wrap(insertRequest307()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S308 | บันทึก", () => {
    cy.wrap(insertRequest308()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S309 | บันทึก", () => {
    cy.wrap(insertRequest309()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S310 | บันทึก", () => {
    cy.wrap(insertRequest310()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S311 | บันทึก", () => {
    cy.wrap(insertRequest311()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S312 | บันทึก", () => {
    cy.wrap(insertRequest312()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S313 | บันทึก", () => {
    cy.wrap(insertRequest313()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S314 | บันทึก", () => {
    cy.wrap(insertRequest314()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S315 | บันทึก", () => {
    cy.wrap(insertRequest315()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S316 | บันทึก", () => {
    cy.wrap(insertRequest316()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S317 | บันทึก", () => {
    cy.wrap(insertRequest317()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S318 | บันทึก", () => {
    cy.wrap(insertRequest318()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S319 | บันทึก", () => {
    cy.wrap(insertRequest319()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S320 | บันทึก", () => {
    cy.wrap(insertRequest320()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S321 | บันทึก", () => {
    cy.wrap(insertRequest321()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S322 | บันทึก", () => {
    cy.wrap(insertRequest322()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S323 | บันทึก", () => {
    cy.wrap(insertRequest323()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });

  it("Request S329 | บันทึก", () => {
    cy.wrap(insertRequest329()).then((data) => {
      Cypress.env("requestId", data.request_id);
      reviewSubmit(data);
    });
  });
});
