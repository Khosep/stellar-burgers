import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api'; // alias из webpack.config.js
import { TLoginData, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { setIsLoading } from '@slices';
import { RootState } from '../store';

type TUserState = {
  isAuthorized: boolean;

  user: TUser | null;
  error: string | null;
};

const initialState: TUserState = {
  isAuthorized: false, // флаг для статуса проверки токена пользователя
  user: null,
  error: null
};

const sliceName = 'user';

export const loginUser = createAsyncThunk(
  `${sliceName}/login`,
  async ({ email, password }: TLoginData, { dispatch, rejectWithValue }) => {
    try {
      //dispatch(setIsLoading(true));
      const data = await loginUserApi({ email, password });
      //dispatch(setIsLoading(false));
      setCookie('accessToken', data.accessToken);

      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Неизвестная ошибка'
      ); // Передаем ошибку в action.payload в extrareducers
    }
  }
);

export const registerUser = createAsyncThunk(
  `${sliceName}/register`,
  async (
    { email, name, password }: TRegisterData,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setIsLoading(true));
      const data = await registerUserApi({ name, email, password });
      dispatch(setIsLoading(false));
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Неизвестная ошибка'
      );
    }
  }
);

export const getUser = createAsyncThunk(
  `${sliceName}/get`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading(true));
      const data = await getUserApi();
      dispatch(setIsLoading(false));
      return data.user;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Неизвестная ошибка'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  `${sliceName}/logout`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      //dispatch(setIsLoading(true));
      const data = await logoutApi();
      //dispatch(setIsLoading(false));
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Неизвестная ошибка'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  `${sliceName}/update`,
  async (user: Partial<TRegisterData>, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading(true));
      const data = await updateUserApi(user);
      dispatch(setIsLoading(false));
      return data.user;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        typeof error === 'object' && error !== null && 'message' in error
          ? error.message
          : 'Неизвестная ошибка'
      );
    }
  }
);

export const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    resetUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    builder
      .addCase(getUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const userReducer = userSlice.reducer; // будет обрабатывать действия из extrareducers
export const getUserDataSelector = (state: RootState) => state[sliceName];
export const getUserSelector = (state: RootState) => state[sliceName].user;
export const isAuthorizedSelector = (state: RootState) =>
  state[sliceName].isAuthorized;
export const getUserErrorSelector = (state: RootState) =>
  state[sliceName].error;
export const { resetUserError } = userSlice.actions;
