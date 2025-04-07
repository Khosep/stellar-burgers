import {
  initialStateConstructor,
  initialStateFeed,
  initialStateIngredients,
  initialStateLoading,
  initialStateOrder,
  initialStateUser
} from '@slices';
import store, { rootReducer, RootState } from '../../store';

describe('тест rootReducer', () => {
  it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
    // Определяем ожидаемое начальное состояние (берем из начальных состояний из модулей со слайсами)
    const expectedInitialState: RootState = {
      loading: initialStateLoading,
      burgerConstructor: initialStateConstructor,
      feed: initialStateFeed,
      ingredients: initialStateIngredients,
      order: initialStateOrder,
      user: initialStateUser
    };

    // Вызываем rootReducer с undefined состоянием и экшеном, который не обрабытывается никаким редюсером
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что результат соответствует ожидаемому начальному состоянию
    expect(result).toEqual(expectedInitialState);
  });
});
