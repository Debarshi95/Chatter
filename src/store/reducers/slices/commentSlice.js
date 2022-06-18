import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDownloadURL } from 'firebase/storage';
import {
  getDocById,
  createComment as createPostComment,
  getAllComments,
  uploadCommentImage,
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
    const { image } = postData;

    try {
      let url = '';
      if (image) {
        const imgRes = await uploadCommentImage(image);
        if (imgRes.ref.name) {
          url = await getDownloadURL(imgRes.ref);
        }
      }

      const res = await createPostComment({ ...postData, url });
      if (res?.id) {
        dispatch(getPostComments(postData.postId));
      }
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getPostById = createAsyncThunk(
  'comments/getPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await getDocById(postId, 'posts');

      if (res?.id) {
        const post = { id: res.id, ...res.data() };
        const postUser = await getDocById(post.userId, 'users');
        if (postUser?.id) {
          post.user = { id: postUser.id, ...postUser.data() };
        }
        return post;
      }
      return {};
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const initialState = {
  comments: [],
  post: null,
  loading: false,
  error: '',
  isUploading: false,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  extraReducers: {
    [getPostById.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getPostById.fulfilled]: (state, action) => {
      state.loading = false;
      state.post = { ...action.payload };
      state.error = '';
    },
    [getPostById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
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
    [createComment.pending]: (state) => {
      state.loading = true;
      state.isUploading = true;
      state.error = '';
    },
    [createComment.fulfilled]: (state) => {
      state.isUploading = false;
      state.loading = false;
      state.error = '';
    },
    [createComment.rejected]: (state, action) => {
      state.isUploading = false;
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default commentSlice.reducer;
