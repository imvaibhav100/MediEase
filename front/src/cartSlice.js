import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://mediease-backend-production.up.railway.app';
const API_URL = `${BACKEND_BASE}/api`;

// Helper to get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('MeduEase_user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Async thunks for API calls
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/cart`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching cart');
  }
});

export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async (item, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      medicineId: item.id || '',
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      genericSource: item.genericSource || '',
      category: item.category || '',
      salts: item.salts ? (Array.isArray(item.salts) ? item.salts.join(', ') : item.salts) : ''
    }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error adding to cart');
  }
});

export const removeFromCartAsync = createAsyncThunk('cart/removeFromCartAsync', async (medicineName, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/remove/${encodeURIComponent(medicineName)}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error removing from cart');
  }
});

export const updateCartItemAsync = createAsyncThunk('cart/updateCartItemAsync', async ({ medicineName, quantity }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/cart/update`, { medicineName, quantity }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating cart');
  }
});

export const clearCartAsync = createAsyncThunk('cart/clearCartAsync', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/clear`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error clearing cart');
  }
});

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local actions for when user is not logged in
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.name === item.name);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      state.totalItems = state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
      state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.name !== action.payload.name);
      state.totalItems = state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
      state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
    },
    updateCartItem: (state, action) => {
      const { name, quantity } = action.payload;
      const item = state.items.find((i) => i.name === name);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.name !== name);
        } else {
          item.quantity = quantity;
        }
      }
      state.totalItems = state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
      state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
    setCartFromStorage: (state, action) => {
      const cart = action.payload;
      state.items = cart.items || [];
      state.totalItems = cart.totalItems || state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
      state.totalAmount = cart.totalAmount || state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 0;
        state.totalAmount = action.payload.items?.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0) || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totalItems = state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
        state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
      })
      // Update cart item
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
        state.totalItems = state.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
        state.totalAmount = state.items.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);
      })
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart, setCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
