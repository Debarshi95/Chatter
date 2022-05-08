import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsers } from 'services/firebaseApi';

export const requestGetAllUsers = createAsyncThunk(
  'search/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllUsers();

      if (res?.docs?.length) {
        const docs = [];
        res.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        return docs;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: '',
};
const searchSlice = createSlice({
  name: 'search',
  initialState,
  extraReducers: {
    [requestGetAllUsers.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestGetAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = [...action.payload];
      state.error = '';
    },
    [requestGetAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default searchSlice.reducer;
