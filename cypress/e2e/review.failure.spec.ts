import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmitUnhappy,
  clickNextToTest,
  formatRequestName,
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

beforeEach(() => {
  ssoLogin();
});

afterEach(() => {
});

describe("Review Page - Unhappy Flow Batch 1", () => {
  const requests = [
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
  ];

  requests.forEach((request) => {
    it(`Request ${formatRequestName(request)} | Unhappy Flow`, () => {
      cy.wrap(request()).then((data) => {
        Cypress.env("requestId", data.request_id);
        reviewSubmitUnhappy(data);
        clickNextToTest();
      });
    });
  });
});

describe("Review Page - Unhappy Flow Batch 2", () => {
  const requests = [
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
  ];

  requests.forEach((request) => {
    it(`Request ${formatRequestName(request)} | Unhappy Flow`, () => {
      cy.wrap(request()).then((data) => {
        Cypress.env("requestId", data.request_id);
        reviewSubmitUnhappy(data);
        clickNextToTest();
      });
    });
  });
});

describe("Review Page - Unhappy Flow Batch 3", () => {
  const requests = [
    insertRequest321,
    insertRequest322,
    insertRequest323,
    insertRequest329,
  ];

  requests.forEach((request) => {
    it(`Request ${formatRequestName(request)} | Unhappy Flow`, () => {
      cy.wrap(request()).then((data) => {
        Cypress.env("requestId", data.request_id);
        reviewSubmitUnhappy(data);
        clickNextToTest();
      });
    });
  });
});
