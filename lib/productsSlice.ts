import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  color: string;
  currency: string;
  gender: 'Men' | 'Women';
  id: number;
  imageURL: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  cartQuantity: number;
}

export interface ProductsState {
  products: Product[];
}

export interface AddBulkProductsAction {
  products: Product[];
  replace?: boolean;
}

const initialState: ProductsState = { products: [] };

const productsSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addBulkProducts: (state, action: PayloadAction<AddBulkProductsAction>) => {
      const products = action.payload.products;
      products.forEach((product: Product) => (product.cartQuantity = 0));
      if (action.payload.replace) {
        state.products = [...products];
      } else {
        state.products = [...state.products, ...products];
      }
    },
    addProductToCart: (state, action: PayloadAction<number>) => {
      const product = state.products.find(
        (product) => product.id === action.payload
      );
      if (!product || product.quantity === product.cartQuantity) {
        return;
      }
      if (product.cartQuantity > 0) {
        product.cartQuantity += 1;
      } else {
        product.cartQuantity = 1;
      }
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      const product = state.products.find(
        (product) => product.id === action.payload
      );
      if (!product || product.cartQuantity === 0) {
        return;
      }
      if (product.cartQuantity > 0) {
        product.cartQuantity -= 1;
      }
    }
  }
});

export const { addBulkProducts, addProductToCart, removeProductFromCart } =
  productsSlice.actions;
export default productsSlice.reducer;
