import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TMove } from '@utils-types';
import { RootState } from '../store';
import { Direction } from '../../utils/constants';

// constructorItems используется в burger-constructor и ingredients-category
type TConstructortState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructortState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const sliceName = 'burgerConstructor';

export const constructorSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Добавляет ингредиент
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        //console.log('Current state:', JSON.stringify(state, null, 2));
        // Булку отдельно: она одна всегда: добавление с нуля либо замена
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload;
          // Все остальные - в ингредиенты (может быть несколько одинаковых!)
        } else {
          state.constructorItems.ingredients.push(payload);
        }
      },
      // добавляем к ингредиенту поле id и генерируем уникальное значение (вызывается перед reducer)
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    // Удаляет ингредиент по id
    removeIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ing) => ing.id !== payload.id
        );
    },
    // Перемещает ингредиент вверх или вниз
    moveIngredient: (state, { payload }: PayloadAction<TMove>) => {
      const { index: i, direction } = payload;
      const { ingredients } = state.constructorItems;
      if (i > 0 && direction === Direction.Up) {
        [ingredients[i - 1], ingredients[i]] = [
          ingredients[i],
          ingredients[i - 1]
        ];
      }
      if (i < ingredients.length - 1 && direction === Direction.Down) {
        [ingredients[i + 1], ingredients[i]] = [
          ingredients[i],
          ingredients[i + 1]
        ];
      }
    },
    resetConstructor: () => initialState
  }
});

export const getConstructorItemsSelector = (state: RootState) =>
  state[sliceName].constructorItems;

export const {
  addIngredient,
  moveIngredient,
  removeIngredient,
  resetConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
