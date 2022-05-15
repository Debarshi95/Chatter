import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
};
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
