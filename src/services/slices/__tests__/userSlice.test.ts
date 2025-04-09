import {
  getUser,
  getUserDataSelector,
  getUserErrorSelector,
  getUserSelector,
  initialStateUser,
  isAuthorizedSelector,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userSlice
} from '@slices';
import { mockUser } from './fixtures';
import { RootState } from '../../store';

describe('Тесты userSlice', () => {
  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialStateUser
      );
    });
  });

  describe('reducers: resetUserError', () => {
    it('сбросить ошибку', () => {
      const stateWithError = {
        ...initialStateUser,
        error: 'Some error'
      };

      const result = userSlice.reducer(
        stateWithError,
        userSlice.actions.resetUserError()
      );

      expect(result.error).toBeNull();
    });
  });

  describe('extrareducers', () => {
    describe('обработка loginUser', () => {
      it('loginUser.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateUser, error: 'Previous error' };
        const action = { type: loginUser.pending.type };
        const result = userSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('loginUser.fulfilled: установить user, isAuthorized=true и ошибка = null', () => {
        const action = {
          type: loginUser.fulfilled.type,
          payload: mockUser
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthorized).toBe(true);
        expect(result.error).toBeNull();
      });

      it('loginUser.rejected установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: loginUser.rejected.type,
          payload: errorMessage
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.error).toBe(errorMessage);
      });
    });

    describe('обработка registerUser', () => {
      it('registerUser.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateUser, error: 'Previous error' };
        const action = { type: registerUser.pending.type };
        const result = userSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('registerUser.fulfilled: установить user, isAuthorized=true и ошибка = null', () => {
        const action = {
          type: registerUser.fulfilled.type,
          payload: mockUser
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthorized).toBe(true);
        expect(result.error).toBeNull();
      });

      it('registerUser.rejected установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: registerUser.rejected.type,
          payload: errorMessage
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.error).toBe(errorMessage);
      });
    });

    describe('обработка getUser', () => {
      it('getUser.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateUser, error: 'Previous error' };
        const action = { type: getUser.pending.type };
        const result = userSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('getUser.fulfilled: установить user, isAuthorized=true и ошибка = null', () => {
        const action = {
          type: getUser.fulfilled.type,
          payload: mockUser
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthorized).toBe(true);
        expect(result.error).toBeNull();
      });

      it('getUser.rejected установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: getUser.rejected.type,
          payload: errorMessage
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.error).toBe(errorMessage);
      });
    });

    describe('обработка updateUser', () => {
      it('updateUser.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateUser, error: 'Previous error' };
        const action = { type: updateUser.pending.type };
        const result = userSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('updateUser.fulfilled: установить user, isAuthorized=true и ошибка = null', () => {
        const action = {
          type: updateUser.fulfilled.type,
          payload: mockUser
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.user).toEqual(mockUser);
        expect(result.isAuthorized).toBe(true);
        expect(result.error).toBeNull();
      });

      it('updateUser.rejected установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: updateUser.rejected.type,
          payload: errorMessage
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.error).toBe(errorMessage);
      });
    });

    describe('обработка logoutUser', () => {
      it('logoutUser.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateUser, error: 'Previous error' };
        const action = { type: logoutUser.pending.type };
        const result = userSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('logoutUser.fulfilled: обнулить user, установить isAuthorized=true и ошибка = null', () => {
        const authrizedState = {
          ...initialStateUser,
          user: mockUser,
          isAuthorized: true
        };
        const action = { type: logoutUser.fulfilled.type };
        const result = userSlice.reducer(authrizedState, action);

        expect(result.user).toBeNull();
        expect(result.isAuthorized).toBe(false);
        expect(result.error).toBeNull();
      });

      it('logoutUser.rejected установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: logoutUser.rejected.type,
          payload: errorMessage
        };
        const result = userSlice.reducer(initialStateUser, action);

        expect(result.error).toBe(errorMessage);
      });
    });
  });

  describe('Селекторы из userSlice', () => {
    describe('Данные есть', () => {
      const mockState: Partial<RootState> = {
        user: {
          isAuthorized: true,
          user: mockUser,
          error: null
        }
      };

      it('getUserDataSelector: вернуть все данные из state', () => {
        const result = getUserDataSelector(mockState as RootState);
        expect(result).toEqual(mockState.user);
      });

      it('getUserSelector:  вернуть user (данные пользователя) ', () => {
        const result = getUserSelector(mockState as RootState);
        expect(result).toEqual(mockUser);
      });

      it('isAuthorizedSelector:  вернуть статус авторизации = true', () => {
        const result = isAuthorizedSelector(mockState as RootState);
        expect(result).toBe(true);
      });

      it('getUserErrorSelector:  вернуть сообщение об ошибке', () => {
        const errorState = {
          ...mockState,
          user: { ...mockState.user!, error: 'Error' }
        };
        const result = getUserErrorSelector(errorState as RootState);
        expect(result).toBe('Error');
      });
    });

    describe('Пустое хранилище', () => {
      const mockState: Partial<RootState> = {
        user: initialStateUser
      };
      it('getUserDataSelector: вернуть начальный (пустой) state', () => {
        const result = getUserDataSelector(mockState as RootState);
        expect(result).toEqual(initialStateUser);
      });

      it('getUserSelector: вернуть нулевой user', () => {
        const result = getUserSelector(mockState as RootState);
        expect(result).toBe(initialStateUser.user);
      });

      it('getUserOrdersSelector: вернуть isAuthorized=false', () => {
        const result = isAuthorizedSelector(mockState as RootState);
        expect(result).toBe(initialStateUser.isAuthorized);
      });

      it('getUserErrorSelector: вернуть нулевой error', () => {
        const result = getUserErrorSelector(mockState as RootState);
        expect(result).toBe(initialStateUser.error);
      });
    });
  });
});
