import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  constructorReducer,
  feedReducer,
  ingredientsDataReducer,
  loadingReducer,
  orderReducer,
  userReducer
} from '@slices';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// При конструировании стора объединяем все редюсеры в один корневой редюсер
export const rootReducer = combineReducers({
  loading: loadingReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  ingredients: ingredientsDataReducer,
  order: orderReducer,
  user: userReducer
});

export const store = configureStore({
  reducer: rootReducer,
  // Устранение предупреждения о несериализуемых значениях
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false
  //   }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

// Будем импортировать useDispatch и useSelector отсюда (а не из 'react-redux')
// они типизированы под наше глобальное состояние.
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
