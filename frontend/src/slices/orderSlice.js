import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const placeOrder = createAsyncThunk('order/place', async ({ userId, paymentMethod, address }, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/orders', { userId, paymentMethod, address });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order placement failed');
  }
});

export const fetchOrders = createAsyncThunk('order/fetchAll', async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`/api/orders/${userId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: { orders: [], currentOrder: null, status: 'idle', error: null },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
