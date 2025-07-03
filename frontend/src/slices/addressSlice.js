import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks (fetch/add/update/delete addresses)
export const fetchAddresses = createAsyncThunk('address/fetch', async (_, { dispatch }) => {
  const res = await axios.get('/api/addresses');
  dispatch(setAddresses(res.data.addresses || []));
  return res.data.addresses || [];
});
export const addAddress = createAsyncThunk('address/add', async (address, { dispatch }) => {
  const res = await axios.post('/api/addresses', address);
  dispatch(addAddressReducer(res.data));
  return res.data;
});
export const updateAddress = createAsyncThunk('address/update', async (address, { dispatch }) => {
  // Use address._id for MongoDB, or address.id if that's what backend returns
  const id = address._id || address.id;
  const res = await axios.put(`/api/addresses/${id}`, address);
  dispatch(updateAddressReducer(res.data));
  return res.data;
});
export const deleteAddress = createAsyncThunk('address/delete', async (id, { dispatch }) => {
  await axios.delete(`/api/addresses/${id}`);
  dispatch(deleteAddressReducer(id));
  return id;
});

const addressSlice = createSlice({
  name: 'address',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    setAddresses: (state, action) => {
      state.items = action.payload;
    },
    addAddressReducer: (state, action) => {
      state.items.push(action.payload);
    },
    updateAddressReducer: (state, action) => {
      const idx = state.items.findIndex(a => a.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteAddressReducer: (state, action) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
  },
});

export const { setAddresses, addAddressReducer, updateAddressReducer, deleteAddressReducer } = addressSlice.actions;
export default addressSlice.reducer;
