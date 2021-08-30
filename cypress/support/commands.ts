// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
let Session = { value: '' };

function login() {
  cy.visit('/login.html');
  cy.get('#username').type('24');
  cy.get('#password').type('Nobug1234@');
  cy.contains('登 录').click();

  cy.request({
    method: 'PUT',
    url: '/multidept/selectCurrentDept?deptCode=A00001',
  }).then(() => {
    cy.visit('/application/ana/index.html');
  });

  Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false;
    }
  });

  cy.getCookie('SESSION').then((x) => {
    Session = x;
  });
}

function getByTaKey(subject, taKey: string, parentTaKeys?: string[], index = 0) {
  const taKeys = (parentTaKeys || []).concat([taKey]);
  let i = 0;
  let cyObject = subject || cy;
  for (const key of taKeys) {
    if (cyObject === cy) {
      cyObject = cyObject.get(`[data-ta-key="${key}"]`);
    } else {
      cyObject = cyObject.find(`[data-ta-key="${key}"]`);
    }
    i++;
  }

  return cyObject.eq(index) as Cypress.cy & EventEmitter;
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Login to automation test workspace
     */
    login(): Chainable;
    /**
     * injectSession to test cases to avoid login again
     * must be after login
     */
    injectSession(): Chainable;
    /**
     * get element by data-ta-key
     */
    getByTaKey(taKey: string, parentTaKeys?: string[], index?: number): Chainable<Element>;
  }
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('injectSession', () => {
  cy.setCookie('SESSION', Session.value);
});

Cypress.Commands.add(
  'getByTaKey',
  {
    prevSubject: 'optional',
  },
  getByTaKey,
);
