import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUsers as getUserList, getDocById, getPosts } from 'services/firebaseApi';

export const getAllUsers = createAsyncThunk(
  'search/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserList();

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

export const getTrendingPosts = createAsyncThunk(
  'post/getTrendingPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPosts('', '', 'ALL');
      if (res?.docs) {
        const posts = await Promise.all(
          res.docs.map(async (doc) => {
            const post = { id: doc.id, ...doc.data() };
            const user = await getDocById(post.userId, 'users');
            post.user = { id: user.id, ...user.data() };
            return post;
          })
        );
        return posts;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  users: [],
  posts: [],
  loading: false,
  error: '',
};
const searchSlice = createSlice({
  name: 'search',
  initialState,
  extraReducers: {
    [getAllUsers.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = [...action.payload];
      state.error = '';
    },
    [getAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getTrendingPosts.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getTrendingPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [getTrendingPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default searchSlice.reducer;
