import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  color: string;
  currency: string;
  gender: 'Men' | 'Women';
  id: number;
  imageURL: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = { products: [] };

const productsSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addBulkProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload];
    }
  }
});

export const { addBulkProducts } = productsSlice.actions;
export default productsSlice.reducer;
