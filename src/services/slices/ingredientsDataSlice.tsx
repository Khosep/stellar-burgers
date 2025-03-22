import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { setIsLoading } from '@slices';
import { RootState } from '../store';

type TIngrediensDatatState = {
  ingredients: TIngredient[];
  error: string | null;
};

const initialState: TIngrediensDatatState = {
  ingredients: [],
  error: null
};

const sliceName = 'ingredients';
export const getIngredientsData = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>(`${sliceName}/get`, async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setIsLoading(true));
    const data = await getIngredientsApi();
    dispatch(setIsLoading(false));
    return data;
  } catch (error) {
    console.error(error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

export const ingredientsDataSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsData.pending, (state) => {
        state.error = null;
      })
      .addCase(
        getIngredientsData.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.error = null;
        }
      )
      .addCase(getIngredientsData.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Unknown error';
      });
  }
});

export const getIngredientsDataSelector = (state: RootState) =>
  state[sliceName].ingredients;

export const ingredientsDataReducer = ingredientsDataSlice.reducer;
