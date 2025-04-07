import {
  initialStateIngredients,
  ingredientsDataSlice,
  getIngredientsDataSelector,
  getIngredientsData,
  setIsLoading
} from '@slices';
import { RootState } from '../../store';
import { dataIngs } from './fixtures';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

describe('Тесты ingredientsDataSlice', () => {
  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(
        ingredientsDataSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual(initialStateIngredients);
    });
  });
  describe('ingredientsDataSlice extraReducers', () => {
    it('getIngredientsData.pending: обнулить ошибку', () => {
      const initialState = {
        ...initialStateIngredients,
        error: 'Previous error'
      };
      const action = { type: getIngredientsData.pending.type };
      const result = ingredientsDataSlice.reducer(initialState, action);
      expect(result.error).toBeNull();
    });
    it('getIngredientsData.fulfilled: установить ингредиенты и ошибка = null', () => {
      const action = {
        type: getIngredientsData.fulfilled.type,
        payload: dataIngs.mockBun1
      };
      const result = ingredientsDataSlice.reducer(
        initialStateIngredients,
        action
      );

      expect(result.ingredients).toEqual(dataIngs.mockBun1);
      expect(result.error).toBeNull();
    });

    it('getIngredientsData.rejected: установить ошибку', () => {
      const errorMessage = 'Error message';
      const action = {
        type: getIngredientsData.rejected.type,
        payload: errorMessage
      };
      const result = ingredientsDataSlice.reducer(
        initialStateIngredients,
        action
      );

      expect(result.error).toBe(errorMessage);
    });
  });
});

describe('Селекторы из ingredientsDataSlice', () => {
  describe('getIngredientsDataSelector', () => {
    it('вернуть ingredients', () => {
      const initialIngs = [
        { ...dataIngs.mockBun1 },
        { ...dataIngs.mockIngredient1 }
      ];
      const mockState: Partial<RootState> = {
        ingredients: {
          ingredients: initialIngs,
          error: null
        }
      };

      const result = getIngredientsDataSelector(mockState as RootState);
      expect(result).toEqual(mockState.ingredients!.ingredients);
    });
    it('Если состояние хранилища пустое (начальное), селектор возвращает пустой constructorItems', () => {
      const mockState: Partial<RootState> = {
        ingredients: initialStateIngredients
      };

      const result = getIngredientsDataSelector(mockState as RootState);
      expect(result).toEqual(initialStateIngredients.ingredients);
    });
  });
});
