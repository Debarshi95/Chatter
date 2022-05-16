import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getDocById,
  createComment as createPostComment,
  getAllComments,
} from 'services/firebaseApi';

export const getPostComments = createAsyncThunk(
  'comments/getPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await getAllComments(postId);
      if (res?.docs) {
        const comments = await Promise.all(
          res.docs.map(async (doc) => {
            const comment = { id: doc.id, ...doc.data() };
            const user = await getDocById(comment.userId, 'users');
            comment.user = { id: user.id, ...user.data() };
            return comment;
          })
        );

        return comments;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (postData, { rejectWithValue, dispatch }) => {
    try {
      const res = await createPostComment(postData);
      if (res?.id) {
        dispatch(getPostComments(postData.postId));
      }
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: '',
};
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  extraReducers: {
    [getPostComments.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getPostComments.fulfilled]: (state, action) => {
      state.loading = false;
      state.comments = [...action.payload];
      state.error = '';
    },
    [getPostComments.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default commentSlice.reducer;
