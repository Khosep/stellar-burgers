// Сборка заказа в конструкторе и отправка по кнопке 'Оформить заказ'

import { BASE_API_URL } from 'cypress/support/commands';

describe('Тест сборки заказа', () => {
  before(() => {
    //Перехватываем запрос на получение ингредиентов и подменяем данные (см. commands.ts)
    cy.interceptIngredientsAPI();
    //Записываем токены
    cy.setCookie('accessToken', 'accessToken');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'refreshToken');
    });
    //Перехватываем запрос на получение данных пользователя и подменяем ответ фикстурой
    cy.intercept(`${BASE_API_URL}/auth/user`, {
      fixture: 'getUserApiResponse.json'
    }).as('getUser');
    //Перехватываем запрос на создание заказа и подменяем ответ фикстурой
    cy.intercept(`${BASE_API_URL}/orders`, {
      fixture: 'createOrderApiResponse.json',
      delay: 1000 // Чтобы увидеть 'Оформляем заказ...'
    }).as('createOrder');
    cy.visit('/');
    cy.wait('@getUser', { timeout: 10000 });
  });

  // Очищаем сами - такие требования в задании (хотя Cypress и так это автоматически сделает либо перед тестом, либо после закрытия)
  // В документации не рекомендуют применять очистку кук и localStorage, т.к.:
  //  1) Cypress сам это делает;
  //  2) Мы не увидим состояние после окончания теста (сотрется) - плохая практика
  // https://docs.cypress.io/api/commands/clearcookies
  // https://docs.cypress.io/api/commands/clearlocalstorage
  // https://docs.cypress.io/app/core-concepts/best-practices#Using-after-Or-afterEach-Hooks
  after(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Собрать и оформить заказ', () => {
    //___Сборка (конструирование) заказа

    const nameBun1 = 'Краторная булка N-200i';
    const nameBun2 = 'Флюоресцентная булка R2-D3';
    const nameIng1 = 'Плоды Фалленианского дерева';
    const nameIng2 = 'Говяжий метеорит (отбивная)';
    const nameIng3 = 'Соус традиционный галактический';
    //Добавим булку
    cy.addIngToConstructor('bun', nameBun1);
    //Добавим ингредиенты
    cy.addIngToConstructor('ing', nameIng1);
    cy.addIngToConstructor('ing', nameIng2);
    cy.addIngToConstructor('ing', nameIng3);
    //Поменяем булку
    cy.addIngToConstructor('bun', nameBun2);

    //___Оформление заказа

    cy.contains('button', 'Оформить заказ').click();
    cy.contains('Оформляем заказ...');
    cy.wait('@createOrder', { timeout: 10000 });

    // Проверяем номер заказа в модальном окне
    cy.get('[data-cy="modal"]').contains('73660').should('be.visible');

    // Закрываем модальное окно и проверяем, что его нет
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем что конструктор пустой после закрытия окна
    cy.get('[data-cy="bun-top"]').should('not.exist');
    cy.get('[data-cy="bun-bottom"]').should('not.exist');
    cy.get('[data-cy="no-bun-middle"]').contains('Выберите начинку');
  });
});
