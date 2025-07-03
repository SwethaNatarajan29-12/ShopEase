import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks (fetch/add/update/delete products)
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { dispatch }) => {
  const res = await axios.get('/api/products');
  dispatch(setProducts(res.data));
  return res.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
