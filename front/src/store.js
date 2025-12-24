import { configureStore } from '@reduxjs/toolkit';

import productsReducer from './productsSlice';
import categoriesReducer from './categoriesSlice';
import cartReducer from './cartSlice';

import searchReducer from './searchSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    search: searchReducer,
  },
});

export default store;
