import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPost, getPosts, updateUserPost } from 'services/firebaseApi';

export const requestGetAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async (userData, { rejectWithValue }) => {
    const { userId, following } = userData;
    try {
      const res = await getPosts(userId, following);
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

export const requestCreatePost = createAsyncThunk(
  'post/createPost',
  async (postData, { rejectWithValue, dispatch }) => {
    const { userId, content, following, username } = postData;
    try {
      const res = await createPost({ userId, content, username });
      if (res?.id) {
        await Promise.all([
          dispatch(requestGetAllPosts({ userId, following })),
          updateUserPost(userId, res.id),
        ]);
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
    [requestCreatePost.fulfilled]: (state) => {
      state.loading = false;
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
