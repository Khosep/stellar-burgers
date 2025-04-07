import {
  initialStateLoading,
  isLoadingSelector,
  loadingSlice,
  TLoadingState
} from '@slices';
import { RootState } from '../../store';

// Для параметризированного теста (чтобы TS не ругался на'any' type для result.isLoading[area])
type LoadingArea = keyof TLoadingState['isLoading'];

describe('Тесты loadingSlice', () => {
  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(
        loadingSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
      ).toEqual(initialStateLoading);
    });
  });

  //https://jestjs.io/docs/api#describeeachtablename-fn-timeout
  describe.each<LoadingArea>(['user', 'ingredients', 'feed', 'order'])(
    'setIsLoading for %s',
    (area) => {
      it(`установить loading status for ${area}`, () => {
        const action = {
          type: loadingSlice.actions.setIsLoading.type,
          payload: { isLoadingStatus: true, area }
        };
        const result = loadingSlice.reducer(initialStateLoading, action);
        expect(result.isLoading[area]).toBe(true);

        // Проверяем, что другие области не изменились (исключаем наш area и итерируемся по остальным с проверкой)
        (Object.keys(result.isLoading) as LoadingArea[])
          .filter((key) => key !== area)
          .forEach((otherArea) => {
            expect(result.isLoading[otherArea]).toBe(false);
          });
      });
    }
  );

  describe('Селекторы из loadingSlice', () => {
    describe('Данные есть', () => {
      const mockState: Partial<RootState> = {
        loading: {
          isLoading: {
            user: true,
            ingredients: false,
            feed: true,
            order: false
          }
        }
      };

      it('isLoadingSelector: вернуть все данные из state', () => {
        const result = isLoadingSelector(mockState as RootState);
        expect(result).toEqual({
          user: true,
          ingredients: false,
          feed: true,
          order: false
        });
      });
    });

    describe('Пустое хранилище (все false)', () => {
      const mockState: Partial<RootState> = {
        loading: initialStateLoading
      };
      it('isLoadingSelector: вернуть начальный (все false) state', () => {
        const result = isLoadingSelector(mockState as RootState);
        expect(result).toEqual(initialStateLoading.isLoading);
      });
    });
  });
});
