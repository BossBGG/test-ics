import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest301,
  insertRequest302,
} from "./func/request";

import { baseUrl } from "./func/env";
import { useInput } from "./func/input";
import {
  changeUser,
  cancelRequest,
  cancelCreate,
  cancelApplication,
  cancelQuotation,
  cancelSurvey,
  cancelSurveyHistory,
  cancelHistoryQuotation,
  cancelQuotationRequestApprover,
  cancelQuotationUserApprover,
  cancelCreateWalkInCase,
  cancelSurveyWalkInCase,
  cancelQuotationApprover,
  cancelApprover,
  cancelHistoryWalkInCase,
  cancelApproverQuotationWalkInCase,
  cancelRejectQuotationWalkInCase,
  cancelRequestQuotationWalkInCase,
  cancelRejectRequestQuotationWalkInCase,
} from "./func/cancelRequest";

beforeEach(() => {
  ssoLogin();
});

afterEach(() => {});

describe("Cancel Request", () => {
  it("Review Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelRequest(data);
    });
  });
  it("CreateBp Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelCreate(data);
    });
  });
  it("Application Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelApplication(data);
    });
  });
  it("Quotation Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelQuotation(data);
    });
  });
  it("Survey Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelSurvey(data);
    });
  });
  it("SurveyHistory Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelSurveyHistory(data);
    });
  });
  it("Quotation Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelHistoryQuotation(data);
    });
  });
  it("Quotation Page | มี survey อนุมัติใบเสนอราคา (Request เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelApprover(data);
      changeUser(data);
    });
  });
  it("Quotation Page | มี survey ไม่อนุมัติใบเสนอราคา (Request เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelQuotationRequestApprover(data);
      changeUser(data);
    });
  });
  it("Quotation Page | มี survey อนุมัติใบเสนอราคา (Approver เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelQuotationApprover(data);
    });
  });
  it("Quotation Page | มี survey ไม่อนุมัติใบเสนอราคา (Approver เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      cancelQuotationUserApprover(data);
    });
  });
});

describe("Cancel Request | กรณี Walk in ไม่มี survey", () => {
  it("กรณี Walk in ไม่มี survey", () => {
    cancelCreateWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Approver ยกเลิก)", () => {
    cancelApproverQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Approver ยกเลิก)", () => {
    cancelRejectQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Request ยกเลิก)", () => {
    cancelRequestQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Request ยกเลิก)", () => {
    cancelRejectRequestQuotationWalkInCase();
  });
});

describe("Cancel Request | กรณี Walk in มี survey", () => {
  it("กรณี Walk in มี survey | ยกเลิกหน้า Survey", () => {
    cancelSurveyWalkInCase();
  });

  it("กรณี Walk in มี survey | ยกเลิกหน้า Survey History", () => {
    cancelHistoryWalkInCase();
  });
});
