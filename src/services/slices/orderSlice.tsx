import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { setIsLoading } from '@slices';
import { RootState } from '../store';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orders: TOrder[];
  order: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orders: [],
  order: null,
  error: null
};

const sliceName = 'order';

// TNewOrderResponse возврат
export const createOrder = createAsyncThunk(
  `${sliceName}/create`,
  async (ingredients: string[], { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading(true));
      const data = await orderBurgerApi(ingredients);
      dispatch(setIsLoading(false));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const getUserOrders = createAsyncThunk(
  `${sliceName}/getUserOrders`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      //dispatch(setIsLoading(true));
      const data = await getOrdersApi();
      //dispatch(setIsLoading(false));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

// В order-info своя логика Preload (не нужен isLoading)
export const getOrderByNumber = createAsyncThunk(
  `${sliceName}/get`,
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(orderNumber);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    resetOrder: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Unknown error';
        state.orderRequest = false;
      });
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Unknown error';
      });
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Unknown error';
      });
  }
});

export const getOrderRequestSelector = (state: RootState) =>
  state[sliceName].orderRequest;
export const getOrderModalDataSelector = (state: RootState) =>
  state[sliceName].orderModalData;
export const getUserOrdersSelector = (state: RootState) =>
  state[sliceName].orders;
export const getOrderSelector = (state: RootState) => state[sliceName].order;

export const orderReducer = orderSlice.reducer;
export const { resetOrder } = orderSlice.actions;
