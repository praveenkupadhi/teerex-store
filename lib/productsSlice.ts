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
  backupProducts: Product[];
  loading: boolean;
  cartMap: Record<number, number>;
}

export interface AddBulkProductsAction {
  products: Product[];
  replace?: boolean;
}

const initialState: ProductsState = {
  products: [],
  backupProducts: [],
  loading: true,
  cartMap: {}
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addBulkProducts: (state, action: PayloadAction<AddBulkProductsAction>) => {
      state.loading = true;
      const products = action.payload.products.map((product) => {
        product.cartQuantity = 0;
        return product;
      });
      state.products = action.payload.replace
        ? [...products]
        : [...state.products, ...products];
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
      state.cartMap[action.payload] = product.cartQuantity;
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
      state.cartMap[action.payload] = product.cartQuantity;
    },
    searchProducts(state, action: PayloadAction<string | undefined>) {
      const searchData = action.payload;
      const backupProducts = [...(state.backupProducts as Product[])];
      if (!searchData) {
        const filteredBackupProducts = backupProducts
          .filter(
            (backupProduct) =>
              !state.products.some((product) => product.id === backupProduct.id)
          )
          .map((backupProduct) => {
            return {
              ...backupProduct,
              cartQuantity: state.cartMap?.[backupProduct.id] ?? 0
            };
          });
        state.products = [...state.products, ...filteredBackupProducts];
        return;
      }
      const filteredProducts = state.products.filter(
        ({ name, type, color }) => {
          return (
            name.toLowerCase().replace(/\s+/g, '').includes(searchData) ||
            type.toLowerCase().includes(searchData) ||
            color.toLowerCase().includes(searchData)
          );
        }
      );
      filteredProducts.forEach((product) => {
        state.cartMap[product.id] = product.cartQuantity;
      });
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
