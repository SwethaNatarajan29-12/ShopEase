import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper to get userId from state
const getUserId = (getState) => getState().user.user?._id;

// Helper to map backend cart items to have id field
const mapCartItems = (items) =>
  (items || []).map(item => ({
    ...item,
    id: item.product?._id || item.product
  }));

// Async thunks (fetch/add/update/delete/clear cart)
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const userId = getUserId(getState);
    if (!userId) return [];
    const res = await axios.get(`/api/cart/${userId}`, { withCredentials: true });
    const items = mapCartItems(res.data.items);
    dispatch(setCartItems(items));
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch cart');
  }
});
export const addToCart = createAsyncThunk('cart/add', async (item, { dispatch, getState, rejectWithValue }) => {
  try {
    const userId = getUserId(getState);
    if (!userId) return;
    const payload = { productId: item._id, quantity: item.quantity };
    const res = await axios.post(`/api/cart/${userId}`, payload, { withCredentials: true });
    const items = mapCartItems(res.data.items);
    dispatch(setCartItems(items));
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to add to cart');
  }
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ id, quantity }, { dispatch, getState, rejectWithValue }) => {
  try {
    const userId = getUserId(getState);
    if (!userId) return;
    const payload = { productId: id, quantity };
    const res = await axios.post(`/api/cart/${userId}`, payload, { withCredentials: true });
    const items = mapCartItems(res.data.items);
    dispatch(setCartItems(items));
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update cart item');
  }
});
export const deleteCartItem = createAsyncThunk('cart/delete', async (id, { dispatch, getState, rejectWithValue }) => {
  try {
    const userId = getUserId(getState);
    if (!userId) return;
    const res = await axios.delete(`/api/cart/${userId}/${id}`, { withCredentials: true });
    const items = mapCartItems(res.data.items);
    dispatch(setCartItems(items));
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete cart item');
  }
});
export const clearCart = createAsyncThunk('cart/clear', async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const userId = getUserId(getState);
    if (!userId) return;
    const res = await axios.put(`/api/cart/${userId}`, {}, { withCredentials: true });
    const items = mapCartItems(res.data.items);
    dispatch(setCartItems(items));
    return items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addOrUpdateCartItem: (state, action) => {
      const found = state.items.find(i => i.id === action.payload.id);
      if (found) {
        found.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateCartItemReducer: (state, action) => {
      const found = state.items.find(i => i.id === action.payload.id);
      if (found) {
        found.quantity = action.payload.quantity;
      }
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    resetCart: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCartItems, addOrUpdateCartItem, updateCartItemReducer, removeCartItem, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
