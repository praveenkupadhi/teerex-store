import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  storeName: string;
}

const initialState: GlobalState = {
  storeName: 'TeeRex Store'
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    modifyStoreName: (state, action: PayloadAction<string>) => {
      state.storeName = action.payload;
    }
  }
});

export const { modifyStoreName } = globalSlice.actions;
export default globalSlice.reducer;
