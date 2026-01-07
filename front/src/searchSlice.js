import { BACKEND_BASE } from './api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGenericMedicine = createAsyncThunk(
  'search/fetchGenericMedicine',
  async (name, { rejectWithValue }) => {
    try {
      // Use the new find-generic API that returns salt + alternatives properly
      const genericRes = await axios.get(`${BACKEND_BASE}/api/find-generic?brandName=${encodeURIComponent(name)}`);
      const data = genericRes.data;
      
      // Format for UI
      return {
        medicines: [{
          id: 'search-' + name,
          name: name,
          salts: data.saltComposition || [],
          price: data.genericAlternatives?.[0]?.price || 0,
          saltFound: data.saltComposition && data.saltComposition.length > 0
        }],
        alternatives: data.success ? (data.genericAlternatives || []) : [],
        saltComposition: data.saltComposition,
        message: data.message
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Medicine not found.');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: '',
    result: null,
    error: '',
    status: 'idle',
  },
  reducers: {
    setSearchValue(state, action) {
      state.value = action.payload;
    },
    clearSearch(state) {
      state.value = '';
      state.result = null;
      state.error = '';
      state.status = 'idle';
    },
    clearSearchOverlay(state) {
      state.result = null;
      state.error = '';
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenericMedicine.pending, (state) => {
        state.status = 'loading';
        state.result = null;
        state.error = '';
      })
      .addCase(fetchGenericMedicine.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(fetchGenericMedicine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = typeof action.payload === 'string' ? action.payload : 'Medicine not found.';
      });
  },
});

export const { setSearchValue, clearSearch, clearSearchOverlay } = searchSlice.actions;
export default searchSlice.reducer;
