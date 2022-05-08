import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPosts, updateUserStats } from 'services/firebaseApi';
import { requestGetAuthUserData } from './authSlice';
import { requestGetAllUsers } from './searchSlice';

export const requestUpdateUserProfileData = createAsyncThunk(
  'users/updateUserProfileData',
  async (userData, { rejectWithValue, dispatch }) => {
    const { type, authUserId, userId } = userData;
    try {
      await Promise.all([
        updateUserStats({ docId: userId, type, data: authUserId, path: 'followers' }),
        updateUserStats({ docId: authUserId, type, data: userId, path: 'following' }),
      ]);

      dispatch(requestGetAllUsers());
      dispatch(requestGetAuthUserData(authUserId));
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const requestGetUserProfilePosts = createAsyncThunk(
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
  retweets: [],
  likes: [],
  loading: false,
  error: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    [requestGetUserProfilePosts.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestGetUserProfilePosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [requestGetUserProfilePosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default userSlice.reducer;
