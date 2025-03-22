import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { setIsLoading } from '@slices';
import { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

const sliceName = 'feed';

// TFeedsResponse возврат
export const getFeed = createAsyncThunk(
  `${sliceName}/getFeed`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setIsLoading(true));
      const data = await getFeedsApi();
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

export const feedSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Unknown error';
      });
  }
});

export const getOrderFeedSelector = (state: RootState) =>
  state[sliceName].orders;
export const getTotalOrdersSelector = (state: RootState) =>
  state[sliceName].total;
export const getTotalTodayOrdersSelector = (state: RootState) =>
  state[sliceName].totalToday;

export const feedReducer = feedSlice.reducer;
