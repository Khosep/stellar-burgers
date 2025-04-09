import {
  constructorSlice,
  getConstructorItemsSelector,
  initialStateConstructor
} from '@slices';
import store, { RootState } from '../../store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { dataIngs } from './fixtures';
import { Direction } from '../../../utils/constants';

describe('Тесты constructorSlice', () => {
  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(
        constructorSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual(initialStateConstructor);
    });
  });

  describe('addIngredient', () => {
    it('добавить булку в конструктор', () => {
      const action = constructorSlice.actions.addIngredient(dataIngs.mockBun1);
      const result = constructorSlice.reducer(initialStateConstructor, action);
      expect(result.constructorItems.bun).toEqual({
        ...dataIngs.mockBun1,
        id: expect.any(String) // Проверяем, что id добавлен
      });
    });

    it('добавить ингредиент в конструктор', () => {
      const action = constructorSlice.actions.addIngredient(
        dataIngs.mockIngredient1
      );
      const result = constructorSlice.reducer(initialStateConstructor, action);
      expect(result.constructorItems.ingredients).toEqual([
        {
          ...dataIngs.mockIngredient1,
          id: expect.any(String)
        }
      ]);
    });
  });
  describe('removeIngredient', () => {
    it('удалить ингредиент по id', () => {
      const initialState = {
        constructorItems: {
          bun: null,
          ingredients: [
            { ...dataIngs.mockIngredient1, id: '1' },
            { ...dataIngs.mockIngredient2, id: '2' }
          ]
        }
      };
      // Удаляем с id = 1
      const action = constructorSlice.actions.removeIngredient({
        id: '1'
      } as TConstructorIngredient);
      const result = constructorSlice.reducer(initialState, action);

      // Ожидаем, что остался с id = 2
      expect(result.constructorItems.ingredients).toEqual([
        { ...dataIngs.mockIngredient2, id: '2' }
      ]);
    });
  });

  describe('moveIngredient', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [
          { ...dataIngs.mockIngredient1, id: '1' }, // index 0
          { ...dataIngs.mockIngredient2, id: '2' }, // index 1
          { ...dataIngs.mockIngredient3, id: '3' } // index 2
        ]
      }
    };

    it('переместить ингредиент вверх', () => {
      // ингредиент с id = 2 (индекс 1) перемещаем на 1 позицию вверх
      const action = constructorSlice.actions.moveIngredient({
        index: 1,
        direction: Direction.Up
      });
      const result = constructorSlice.reducer(initialState, action);
      // ожидаем, что ингредиент с id = 2 переместился на индекс 0 (первое место)
      expect(result.constructorItems.ingredients.map((i) => i.id)).toEqual([
        '2',
        '1',
        '3'
      ]);
    });

    it('переместить ингредиент вниз', () => {
      const action = constructorSlice.actions.moveIngredient({
        index: 1,
        direction: Direction.Down
      });
      const result = constructorSlice.reducer(initialState, action);
      expect(result.constructorItems.ingredients.map((i) => i.id)).toEqual([
        '1',
        '3',
        '2'
      ]);
    });

    it('нельзя переместить первый вверх или последний вниз', () => {
      const actionUp = constructorSlice.actions.moveIngredient({
        index: 0,
        direction: Direction.Up // Нельзя двигать первый элемент вверх
      });
      const actionDown = constructorSlice.actions.moveIngredient({
        index: 2,
        direction: Direction.Down // Нельзя двигать последний элемент вниз
      });

      const resultUp = constructorSlice.reducer(initialState, actionUp);
      const resultDown = constructorSlice.reducer(initialState, actionDown);

      expect(resultUp.constructorItems.ingredients.map((i) => i.id)).toEqual([
        '1',
        '2',
        '3'
      ]);
      expect(resultDown.constructorItems.ingredients.map((i) => i.id)).toEqual([
        '1',
        '2',
        '3'
      ]);
    });
  });
  describe('resetConstructor', () => {
    it('сбросить конструктор к начальному (пустому) состоянию', () => {
      const initialState = {
        constructorItems: {
          bun: { ...dataIngs.mockBun1, id: '1' },
          ingredients: [{ ...dataIngs.mockIngredient1, id: '2' }]
        }
      };

      const action = constructorSlice.actions.resetConstructor();
      const result = constructorSlice.reducer(initialState, action);

      expect(result).toEqual(initialStateConstructor);
    });
  });
});

describe('Селекторы из constructorSlice', () => {
  describe('getConstructorItemsSelector', () => {
    it('вернуть constructorItems', () => {
      const initialState = {
        constructorItems: {
          bun: { ...dataIngs.mockBun1, id: '1' },
          ingredients: [{ ...dataIngs.mockIngredient1, id: '2' }]
        }
      };
      const mockState: Partial<RootState> = {
        burgerConstructor: initialState
      };

      // Вызываем селектор с моковым состоянием
      const result = getConstructorItemsSelector(mockState as RootState);

      // Проверяем, что селектор возвращает правильные данные
      expect(result).toEqual(initialState.constructorItems);
    });

    it('Если состояние хранилища пустое (начальное), селектор возвращает пустой constructorItems', () => {
      const mockState: Partial<RootState> = {
        burgerConstructor: initialStateConstructor
      };

      const result = getConstructorItemsSelector(mockState as RootState);
      expect(result).toEqual(initialStateConstructor.constructorItems);
    });
  });
});
