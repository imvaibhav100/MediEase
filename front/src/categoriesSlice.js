import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    name: "Cold & Cough",
    img: "https://davaindia.com/images/categories/cold-cough.png",
  },
  {
    name: "Diabetes Care",
    img: "https://davaindia.com/images/categories/diabetes.png",
  },
  {
    name: "Women's Health",
    img: "https://davaindia.com/images/categories/women-health.png",
  },
  {
    name: "Immunity Boosters",
    img: "https://davaindia.com/images/categories/immunity.png",
  },
  {
    name: "Heart Care",
    img: "https://davaindia.com/images/categories/heart.png",
  },
  {
    name: "Skin & Hair",
    img: "https://davaindia.com/images/categories/skin-hair.png",
  },
];

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
});

export default categoriesSlice.reducer;
