import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPost, getPosts, updateUserPost } from 'services/firebaseApi';

export const requestCreatePost = createAsyncThunk(
  'post/createPost',
  async (postData, { rejectWithValue }) => {
    const { id, userId, content } = postData;
    try {
      const res = await createPost({ userId, content });
      if (res?.id) {
        const response = await Promise.all([getPosts(postData.userId), updateUserPost(id, res.id)]);
        if (response[0]?.docs) {
          const docs = [];
          response[0].docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          return docs;
        }
      }
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const requestGetAllPosts = createAsyncThunk(
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
  posts: [],
  newPost: null,
  loading: false,
  error: '',
};
const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: {
    [requestCreatePost.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestCreatePost.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [requestCreatePost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [requestGetAllPosts.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestGetAllPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [requestGetAllPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default postSlice.reducer;
