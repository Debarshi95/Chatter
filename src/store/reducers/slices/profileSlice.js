import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDocById, getPosts } from 'services/firebaseApi';

export const getProfileData = createAsyncThunk(
  'profile/getProfileData',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await Promise.all([getDocById(userId, 'users'), getPosts(userId)]);
      if (res) {
        const user = res[0];
        const posts = res[1];
        const data = {
          id: user.id,
          ...user.data(),
          posts: posts.docs.map((post) => ({ id: post.id, ...post.data() })),
        };
        return data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: {},
  error: '',
};
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  extraReducers: {
    [getProfileData.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getProfileData.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [getProfileData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default profileSlice.reducer;
