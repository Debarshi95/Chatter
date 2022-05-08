import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts, updateUserStats } from 'services/firebaseApi';
import { requestGetAllUsers } from './searchSlice';

export const requestUpdateUserProfileData = createAsyncThunk(
  'users/updateUserProfileData',
  async (userData, { rejectWithValue, dispatch }) => {
    const { type, authUserId, userId } = userData;

    try {
      await Promise.all([
        updateUserStats({ docId: userId, type, userId: authUserId, path: 'followers' }),
        updateUserStats({ docId: authUserId, type, userId, path: 'following' }),
      ]);

      dispatch(requestGetAllUsers());
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const requestGetUserPosts = createAsyncThunk(
  'post/getAllPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getPosts(userId);
      if (res?.docs) {
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
  followers: [],
  following: [],
  posts: [],
  loading: false,
  error: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    [requestGetUserPosts.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestGetUserPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [requestGetUserPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default userSlice.reducer;
