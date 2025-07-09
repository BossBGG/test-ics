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
  surveySubmit,
  surveyHistorySubmit,
} from "./func/survey";

beforeEach(() => {
  ssoLogin()
})

const approverId = 510706

describe('Request Survey | กรณีมีการสำรวจ | คนไทย', () => {

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

  it('Survey', () => {
    surveySubmit(globalData)
  })

  it('Survey History', () => {
    surveyHistorySubmit(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | คนต่างชาติ', () => {

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

  it('Survey', () => {
    surveySubmit(globalData)
  })

  it('Survey History', () => {
    surveyHistorySubmit(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | นิติบุคคล (แบบกรอกข้อมูล)', () => {

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
    surveySubmit(globalData)
  })

  it('Survey History', () => {
    surveyHistorySubmit(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | นิติบุคคล (แบบกรอกค้นหา)', () => {

  let globalData

  it('Review | Request S302', () => {
    cy.wrap(insertRequest302()).then(data => {
      globalData = data
      reviewSubmit(globalData)
    })
  });

  it('Create BP | รายละเอียดคำร้อง นิติบุคคล (แบบกรอกค้นหา)', () => {
    createCase4Survey(globalData);
  })

  it('Survey', () => {
    surveySubmit(globalData)
  })

  it('Survey History', () => {
    surveyHistorySubmit(globalData)
  })

})

describe('Request Survey | กรณีมีการสำรวจ | หน่วยงานราชการ (แบบกรอกข้อมูล)', () => {

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

  it('Survey', () => {
    surveySubmit(globalData)
  })

  it('Survey History', () => {
    surveyHistorySubmit(globalData)
  })

})
