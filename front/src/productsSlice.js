import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    name: "Paracetamol 500mg",
    image: "https://davaindia.com/images/products/paracetamol.jpg",
    mrp: 50,
    price: 15,
    rating: 5,
  },
  {
    name: "Cetirizine 10mg",
    image: "https://davaindia.com/images/products/cetirizine.jpg",
    mrp: 40,
    price: 12,
    rating: 4,
  },
  {
    name: "Metformin 500mg",
    image: "https://davaindia.com/images/products/metformin.jpg",
    mrp: 80,
    price: 25,
    rating: 5,
  },
  {
    name: "Vitamin C Tablets",
    image: "https://davaindia.com/images/products/vitamin-c.jpg",
    mrp: 60,
    price: 20,
    rating: 4,
  },
];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
