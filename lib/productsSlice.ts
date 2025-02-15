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
  backupProducts?: Product[];
  loading?: boolean;
}

export interface AddBulkProductsAction extends ProductsState {
  replace?: boolean;
}

const initialState: ProductsState = {
  products: [],
  backupProducts: [],
  loading: true
};

const productsSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    addBulkProducts: (state, action: PayloadAction<AddBulkProductsAction>) => {
      state.loading = true;
      const products = action.payload.products;
      products.forEach((product: Product) => (product.cartQuantity = 0));
      if (action.payload.replace) {
        state.products = [...products];
      } else {
        state.products = [...state.products, ...products];
      }
      state.backupProducts = [...state.products];
      state.loading = false;
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
      state.backupProducts = [...state.products];
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
      state.backupProducts = [...state.products];
    },
    searchProducts(state, action: PayloadAction<string | undefined>) {
      const searchData = action.payload;
      const backupProducts = state.backupProducts as Product[];
      if (!searchData) {
        state.products = [...backupProducts];
        return;
      }
      const filteredProducts = backupProducts.filter(
        ({ name, type, color }) => {
          return (
            name.toLowerCase().split(' ').join('').includes(searchData) ||
            type.toLowerCase().includes(searchData) ||
            color.toLowerCase().includes(searchData)
          );
        }
      );
      state.products = [...filteredProducts];
    }
  }
});

export const {
  addBulkProducts,
  addProductToCart,
  removeProductFromCart,
  searchProducts
} = productsSlice.actions;
export default productsSlice.reducer;
