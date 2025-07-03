import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import paymentReducer from './slices/paymentSlice';
import orderReducer from './slices/orderSlice';

// Default initial states for slices
const userInitial = { user: null, status: 'idle', error: null };
const cartInitial = { items: [], status: 'idle', error: null };

// Helpers for localStorage persistence
const loadState = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    const serializedCart = localStorage.getItem('cart');
    return {
      user: serializedUser ? { ...userInitial, user: JSON.parse(serializedUser) } : userInitial,
      cart: serializedCart ? { ...cartInitial, items: JSON.parse(serializedCart) } : cartInitial,
    };
  } catch (e) {
    return { user: userInitial, cart: cartInitial };
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('user', JSON.stringify(state.user.user));
    localStorage.setItem('cart', JSON.stringify(state.cart.items));
  } catch (e) {}
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    cart: cartReducer,
    address: addressReducer,
    payment: paymentReducer,
    order: orderReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    user: store.getState().user,
    cart: store.getState().cart,
  });
});

export default store;
