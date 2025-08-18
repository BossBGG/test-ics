import { ssoLogin } from "./func/peaSso";
import {
  reviewSubmit,
  insertRequest302,
} from "./func/request";
import { baseUrl, user, mockUser } from './func/env'
import { useInput } from "./func/input";
import { mockUserLogin } from "./func/mock";
import {
  createCase1Survey,
  createCase2Survey,
  createCase3Survey,
  createCase4Survey,
  createCase5Survey,
} from "./func/createBp";
import {
  surveySubmitFail,
} from "./func/survey";

beforeEach(() => {
  ssoLogin()
})

const approverId = 510706

describe('Request Survey | กรณีมีการสำรวจ | คนไทย | Failure', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง บุคคลธรรมดา (คนไทย)', () => {
    createCase1Survey(globalData);
  })

  it(`Can't Submit Survey`, () => {
    surveySubmitFail(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | คนต่างชาติ | Failure', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง บุคคลธรรมดา (คนต่างชาติ)', () => {
    createCase2Survey(globalData);
  })

  it(`Can't Submit Survey`, () => {
    surveySubmitFail(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | นิติบุคคล (แบบกรอกข้อมูล) | Failure', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง นิติบุคคล (แบบกรอกข้อมูล)', () => {
    createCase3Survey(globalData);
  })

  it('Survey', () => {
    surveySubmitFail(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | นิติบุคคล (แบบกรอกค้นหา) | Failure', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง นิติบุคคล (แบบกรอกค้นหา) | Popup ไม่สามารถดำเนินการได้ ', () => {
    createCase4Survey(globalData);
  })

  // it(`Can't Submit Survey`, () => {
  //   surveySubmitFail(globalData)
  // })

})

describe('Request Survey | กรณีมีการสำรวจ | หน่วยงานราชการ (แบบกรอกข้อมูล) | Failure', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง หน่วยงานราชการ (แบบกรอกข้อมูล)', () => {
    createCase5Survey(globalData);
  })

  it(`Can't Submit Survey`, () => {
    surveySubmitFail(globalData)
  })

})
