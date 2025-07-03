import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks (register, login, fetch/update profile)
export const registerUser = createAsyncThunk('user/register', async (userData, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post('/api/users/register', userData, { withCredentials: true });
    dispatch(setUser(res.data));
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      console.log('registerUser thunk backend error:', err.response.data.message); // Debug log
      return rejectWithValue(err.response.data.message);
    } else if (err.message) {
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Registration failed');
    }
  }
});
export const loginUser = createAsyncThunk('user/login', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.post('/api/users/login', credentials, { withCredentials: true });
    dispatch(setUser(res.data));
    // Only fetch profile if login is successful
    await dispatch(fetchProfile());
    return res.data;
  } catch (err) {
    // Do NOT call fetchProfile on error
    if (err.response && err.response.data && (err.response.data.message || err.response.data.error)) {
      return rejectWithValue(err.response.data.message || err.response.data.error);
    } else if (err.message) {
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Login failed');
    }
  }
});
export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get('/api/users/profile', { withCredentials: true });
    dispatch(setUser(res.data));
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      return rejectWithValue(err.response.data.message);
    } else if (err.message) {
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Fetch profile failed');
    }
  }
});
export const updateProfile = createAsyncThunk('user/updateProfile', async (profileData, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.put('/api/users/profile', profileData, { withCredentials: true });
    dispatch(setUser(res.data));
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      return rejectWithValue(err.response.data.message);
    } else if (err.message) {
      return rejectWithValue(err.message);
    } else {
      return rejectWithValue('Update profile failed');
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Fetch profile failed';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Update profile failed';
      });
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
