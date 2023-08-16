import axios from "axios";
import { createSlice,  createAsyncThunk,  } from "@reduxjs/toolkit";

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzas', async(params) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get(
        `https://6464c842127ad0b8f8a7d62b.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      );
        return data;
    });

const initialState = {
  items: [],
  status: 'loading',
};
const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPizzas.fulfilled, (state, action) => { 
        state.items = action.payload;
        state.status = 'success';
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = 'error';
        state.items = [];
      });
  },
  
});

export const selectPizzaData = (state) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
