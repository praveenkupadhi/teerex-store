import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './globalSlice';
import productReducer from './productsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalReducer,
      products: productReducer
    }
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
