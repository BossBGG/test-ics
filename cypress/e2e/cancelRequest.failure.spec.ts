import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest301,
  insertRequest302,
} from "./func/request";

import {
  failureChangeUser,
  failureCancelRequest,
  failureCancelCreate,
  failureCancelApplication,
  failureCancelQuotation,
  failureCancelSurvey,
  failureCancelSurveyHistory,
  failureCancelHistoryQuotation,
  failureCancelQuotationRequestApprover,
  failureCancelQuotationUserApprover,
  failureCancelCreateWalkInCase,
  failureCancelSurveyWalkInCase,
  failureCancelQuotationApprover,
  failureCancelApprover,
  failureCancelHistoryWalkInCase,
  failureCancelApproverQuotationWalkInCase,
  failureCancelRejectQuotationWalkInCase,
  failureCancelRequestQuotationWalkInCase,
  failureCancelRejectRequestQuotationWalkInCase,
} from "./func/cancelRequestFailure";

beforeEach(() => {
  ssoLogin();
});

afterEach(() => {});

describe("Failure Cancel Request", () => {
  it("Review Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelRequest(data);
    });
  });
  it("CreateBp Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelCreate(data);
    });
  });
  it("Application Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelApplication(data);
    });
  });
  it("Quotation Page | ไม่มี survey", () => {
    cy.wrap(insertRequest301()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelQuotation(data);
    });
  });
  it("Survey Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelSurvey(data);
    });
  });
  it("SurveyHistory Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelSurveyHistory(data);
    });
  });
  it("Quotation Page | มี survey", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelHistoryQuotation(data);
    });
  });
  it("Quotation Page | มี survey อนุมัติใบเสนอราคา (Request เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelApprover(data);
      failureChangeUser(data);
    });
  });
  it("Quotation Page | มี survey ไม่อนุมัติใบเสนอราคา (Request เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelQuotationRequestApprover(data);
      failureChangeUser(data);
    });
  });
  it("Quotation Page | มี survey อนุมัติใบเสนอราคา (Approver เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelQuotationApprover(data);
    });
  });
  it("Quotation Page | มี survey ไม่อนุมัติใบเสนอราคา (Approver เป็นคนยกเลิก)", () => {
    cy.wrap(insertRequest302()).then((data) => {
      Cypress.env("requestId", data.request_id);
      failureCancelQuotationUserApprover(data);
    });
  });
});

describe("Failure Cancel Request | กรณี Walk in ไม่มี survey", () => {
  it("กรณี Walk in ไม่มี survey", () => {
    failureCancelCreateWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Approver ยกเลิก)", () => {
    failureCancelApproverQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Approver ยกเลิก)", () => {
    failureCancelRejectQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey อนุมัติใบเสนอราคา (Request ยกเลิก)", () => {
    failureCancelRequestQuotationWalkInCase();
  });

  it("กรณี Walk in ไม่มี survey ไม่อนุมัติใบเสนอราคา (Request ยกเลิก)", () => {
    failureCancelRejectRequestQuotationWalkInCase();
  });
});

describe("Failure Cancel Request | กรณี Walk in มี survey", () => {
  it("กรณี Walk in มี survey | ยกเลิกหน้า Survey", () => {
    failureCancelSurveyWalkInCase();
  });

  it("กรณี Walk in มี survey | ยกเลิกหน้า Survey History", () => {
    failureCancelHistoryWalkInCase();
  });
});
