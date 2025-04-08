// Получение игредиентов (перехват и подмена) и проверка работы мод. окна ингредиента
import { TIngredient } from '@utils-types';

describe('Тест ингредиентов', () => {
  beforeEach(() => {
    //Перехватываем запрос на получение ингредиентов и подменяем данные (см. commands.ts)
    cy.interceptIngredientsAPI();

    //Все запросы посмотреть
    // cy.intercept('*', (req) => {
    //   console.log('---Запрос:', req.url);
    //   req.continue();
    // });
  });

  // В целях дебага тестирования, отдельно не нужен, т.к. дублирует wait в interceptIngredientsAPI
  // it('Проверить, что запрос перехвачен', () => {
  //   cy.wait('@getIngredients').then((interception) => {
  //     expect(interception.request.url).to.include('/ingredients');
  //   });
  // });

  it('Проверить отображение ингредиентов', () => {
    //cy.get('li').should('have.length.greaterThan', 0);
    cy.fixture('getIngredientsApiResponse').then((data) => {
      // Получаем количество ингредиентов в массиве фикстур
      const ingsArray: TIngredient[] = data.data;
      const numberIngs = ingsArray.length;
      cy.log(`Количество ингредиентов в фикстурах: ${numberIngs}`);
      // Проверяем, что все ингредиенты, полученные из фикстур, отображаются
      cy.get('[data-cy="ingredient-card"]').should('have.length', numberIngs);
      // Для каждого элемента в массиве проверяем, что он отображается на странице
      ingsArray.forEach((ing) => {
        cy.get('[data-cy="ingredient-card"]')
          .contains(ing.name) // Проверяем, что карточка ингредиента содержит имя из фикстур
          .scrollIntoView() // Скроллим, чтобы карточка попала в видимую область (без этого - ошибка)
          .should('be.visible'); // Проверяем, что карточка видна (а не только находится в видимой области)
      });
    });
  });

  describe('Работа модального окна с детальным описанием по ингредиенту', () => {
    it('Открыть модальное окно', () => {
      // Убеждаемся, что модальное окно не открыто
      cy.modalShouldNotExist();
      // Открыть модальное окно кликом на карточку с ингредиентом (с проверкой открытия)
      cy.openIngModalWithCheck('Флюоресцентная булка R2-D3');
    });

    it('Закрыть модальное окна по нажатию на кнопку', () => {
      cy.openIngModalWithCheck('Флюоресцентная булка R2-D3');
      // Закрытие модального окна по кнопке
      cy.get('[data-cy="modal-close-button"]').click();
      cy.modalShouldNotExist();
    });

    it('Закрыть модальное окна по Esc', () => {
      cy.openIngModalWithCheck('Биокотлета из марсианской Магнолии');
      // Закрытие модального окна по клавише Esc
      cy.get('body').type('{esc}');
      cy.modalShouldNotExist();
    });
    it('Закрыть модальное окна по нажатию на оверлей', () => {
      cy.openIngModalWithCheck('Сыр с астероидной плесенью');
      // Закрытие модального окна по клавише Esc
      cy.get('[data-cy="modal-close-overlay"]').click({ force: true });
      cy.modalShouldNotExist();
    });
  });
});
