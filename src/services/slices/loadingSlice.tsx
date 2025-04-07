import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type TLoadingState = {
  isLoading: {
    user: boolean;
    ingredients: boolean;
    feed: boolean;
    order: boolean;
  };
};

export const initialStateLoading: TLoadingState = {
  isLoading: {
    user: false,
    ingredients: false,
    feed: false,
    order: false
  }
};

const sliceName = 'loading';

export const loadingSlice = createSlice({
  name: sliceName,
  initialState: initialStateLoading,
  reducers: {
    setIsLoading(
      state,
      action: PayloadAction<{
        isLoadingStatus: boolean;
        area: keyof TLoadingState['isLoading'];
      }>
    ) {
      const { isLoadingStatus, area } = action.payload;
      state.isLoading[area] = isLoadingStatus;
    }
  }
});
export const isLoadingSelector = (state: RootState) =>
  state[sliceName].isLoading;

export const { setIsLoading } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
