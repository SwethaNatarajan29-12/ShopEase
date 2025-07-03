import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk (Stripe payment intent)
export const createPaymentIntent = createAsyncThunk('payment/createIntent', async (paymentData, { dispatch }) => {
  const res = await axios.post('/api/payment/create-payment-intent', paymentData, { withCredentials: true });
  dispatch(setPaymentIntent(res.data));
  return res.data;
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: { status: 'idle', error: null, paymentIntent: null },
  reducers: {
    setPaymentIntent: (state, action) => {
      state.paymentIntent = action.payload;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
  },
});

export const { setPaymentIntent, clearPaymentIntent } = paymentSlice.actions;
export default paymentSlice.reducer;
