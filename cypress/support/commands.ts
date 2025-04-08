/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
export const BASE_API_URL = Cypress.env('API_URL');

// console.log(`----!!! BASE_URL_API = ${BASE_API_URL}`);
// console.log(`----!!! baseUrl: ${Cypress.config('baseUrl')}`);

Cypress.Commands.add('interceptIngredientsAPI', () => {
  //Перехватывает запрос на получение ингредиентов и подменяет данные
  cy.intercept(`${BASE_API_URL}/ingredients`, {
    fixture: 'getIngredientsApiResponse.json'
  }).as('getIngredients');
  cy.visit('/');
  cy.wait('@getIngredients', { timeout: 10000 });
});

Cypress.Commands.add('modalShouldNotExist', () => {
  cy.get('[data-cy="modal"]').should('not.exist');
});

Cypress.Commands.add('openIngModalWithCheck', (ingName) => {
  // Открывает модальное окно; проверяет, что его видно
  cy.get('[data-cy="ingredient-card"]').contains(ingName).click();
  cy.get('[data-cy="modal"]').should('be.visible').and('contain', ingName);
});

Cypress.Commands.add('shouldNotExistOrNotContain', (selector, text) => {
  cy.get('body').then(($body) => {
    const element = $body.find(selector);

    if (element.length > 0) {
      // Если элемент существует, проверяем текст
      cy.wrap(element).should('not.contain', text);
    }
    // Если элементов нет - ничего не делаем, проверка пройдена
  });
});

Cypress.Commands.add('addIngToConstructor', (ingType, ingName) => {
  cy.get('[data-cy="ingredient-card"]')
    .contains(ingName) // ищем в дочерних элементах
    .parents('[data-cy="ingredient-card"]') // Поднимаемся обратно до родительского элемента карточки
    .within(() => {
      // Работаем внутри этой конкретной карточки
      //Ищем кнопку "Добавить" внутри
      cy.contains('button', 'Добавить')
        .scrollIntoView()
        .should('be.visible')
        .click();
    });
  // Проверка в конструкторе
  if (ingType === 'bun') {
    // Проверяем, что булка есть (и видна) сверху и снизу
    cy.get('[data-cy="bun-top"]').contains(ingName).should('be.visible');
    cy.get('[data-cy="bun-bottom"]').contains(ingName).should('be.visible');
    // Проверяем, что булки нет в центре
    cy.shouldNotExistOrNotContain('[data-cy="no-bun-middle"]', ingName);
    //cy.get('[data-cy="no-bun-middle"]').contains(ingName).should('not.exist');
  } else {
    // Проверяем, что обычный ингредиент (не булка) должен быть в центральной части
    //cy.get('[data-cy="no-bun-middle"]').contains(ingName).should('exist');
    cy.get('[data-cy="no-bun-middle"] li')
      .last()
      .should('contain', ingName)
      .and('exist');
    // Проверяем, что обычного ингредиента нет там, где должны быть только булки
    cy.shouldNotExistOrNotContain('[data-cy="bun-top"]', ingName);
    cy.shouldNotExistOrNotContain('[data-cy="bun-bottom"]', ingName);
    //cy.get('[data-cy="bun-top"]').contains(ingName).should('not.exist');
    //cy.get('[data-cy="bun-bottom"]').contains(ingName).should('not.exist');
  }
  cy.log(`-----Добавлено: ${ingName}-----`);
});

// Чтобы команды были доступны, нужно добавить в глобальную область видимости (файл e2e.ts)
