import { createSlice } from '@reduxjs/toolkit';

type TLoadingState = {
  isLoading: boolean;
};

const initialState: TLoadingState = {
  isLoading: false
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  },
  selectors: {
    isLoadingSelector: (state) => state.isLoading
  }
});

export const { setIsLoading } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
export const { isLoadingSelector } = loadingSlice.selectors;
