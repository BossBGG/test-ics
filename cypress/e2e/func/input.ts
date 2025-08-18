export function useInput(name) {
  function typing(to, text) {
    cy.get(name, { timeout: 20000 }).find(to).type(text, { timeout: 20000 });
  }

  function typingClear(to, text) {
    cy.get(name, { timeout: 20000 })
      .find(to)
      .clear()
      .type(text, { timeout: 20000 });
  }

  function inputTyping(to, text) {
    cy.get(name, { timeout: 20000 })
      .find(to)
      .find("input")
      .type(text, { timeout: 20000 });
  }

  function inputTypingClear(to, text) {
    cy.get(name, { timeout: 20000 })
      .find(to)
      .find("input")
      .clear()
      .type(text, { timeout: 20000 });
  }

  function select(select, index = 0) {
    cy.get(name, { timeout: 20000 }).find(select, { timeout: 20000 }).click();
    cy.wait(500)
      .get(".q-menu .q-item", { timeout: 20000 })
      .eq(index)
      .click({ timeout: 20000 });
  }

  function selectFirst(select) {
    cy.get(name, { timeout: 20000 }).find(select, { timeout: 20000 }).click();
    cy.wait(500)
      .get(".q-menu .q-item", { timeout: 20000 })
      .first()
      .click({ timeout: 20000 });
  }

  function checkboxClick(checkbox) {
    cy.get(name, { timeout: 20000 })
      .find(checkbox, { timeout: 20000 })
      .click({ force: true, timeout: 20000 });
    cy.wait(500);
  }

  function radioClick(radio, index = 0) {
    cy.get(name, { timeout: 20000 })
      .find(radio, { timeout: 20000 })
      .find("input")
      .eq(index)
      .click({ force: true });
  }

  return {
    typing,
    typingClear,
    inputTyping,
    inputTypingClear,
    select,
    selectFirst,
    checkboxClick,
    radioClick,
  };
}

export function useClearInput(name) {
  cy.get(name, { timeout: 40000 }).within(() => {
    cy.get('input, textarea', { timeout: 40000 }).each(($input) => {
      if ($input.is(':input:not([type="file"]):not([disabled]):not(.hidden)')) {
        cy.wrap($input).clear({ force: true, timeout: 40000 });
      } else {
      }
    });
  });
}

export function useClearSelect(name) {
  cy.get(name, { timeout: 40000 }).find('.q-icon.notranslate.material-icons', { timeout: 40000 }).eq(0).click({ force: true, timeout: 40000 })
}

function PleaseBase(txt, validateText) {
  if (Array.isArray(txt)) {
    txt.forEach(t => {
      cy.contains(`${validateText}${t}`, { timeout: 30000 })
    });
  } else {
    cy.contains(`${validateText}${txt}`, { timeout: 30000 })
  }
}
export const Please = {
  input: (txt) => {
    const validateText = 'กรุณากรอก'
    PleaseBase(txt, validateText)
  },
  select: (txt) => {
    const validateText = 'กรุณาเลือก'
    PleaseBase(txt, validateText)
  }
}
