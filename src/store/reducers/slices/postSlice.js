import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDownloadURL } from 'firebase/storage';
import {
  createPost as createNewPost,
  getDocById,
  getPosts,
  updatePost as updatePostData,
  deletePost as deleteUserPost,
  updateUserProfile,
  uploadPostImage,
} from 'services/firebaseApi';

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async (userData, { rejectWithValue }) => {
    const { userId, following } = userData;
    try {
      const res = await getPosts(userId, following);
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

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData, { rejectWithValue, dispatch }) => {
    const { user, content, image } = postData;
    try {
      let url = '';
      if (image) {
        const imgRes = await uploadPostImage(image);
        if (imgRes.ref.name) {
          url = await getDownloadURL(imgRes.ref);
        }
      }
      const res = await createNewPost({
        userId: user.id,
        content,
        image: url,
        username: user.username,
      });
      if (res?.id) {
        await Promise.all([
          updateUserProfile({ data: res.id, docId: user.id, path: 'posts', type: 'UPDATE' }),
          dispatch(getAllPosts({ userId: user.uid, following: user.following })),
        ]);
      }
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      await Promise.all([
        deleteUserPost(postId),
        updateUserProfile({ data: postId, docId: userId, path: 'posts', type: 'DELETE' }),
      ]);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async (postData, { rejectWithValue }) => {
    const { type, postId, userId, path } = postData;
    try {
      await updatePostData({ docId: postId, data: userId, path, type });
      return postData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: '',
  isUploading: false,
};
const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: {
    [createPost.pending]: (state) => {
      state.loading = true;
      state.isUploading = true;
      state.error = '';
    },
    [createPost.fulfilled]: (state) => {
      state.loading = false;
      state.isUploading = false;
      state.error = '';
    },
    [createPost.rejected]: (state, action) => {
      state.loading = false;
      state.isUploading = false;
      state.error = action.payload?.message;
    },
    [updatePost.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [updatePost.fulfilled]: (state, action) => {
      const { postId, path, userId, type } = action.payload;

      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (type === 'DELETE') {
        state.posts[postIndex][path].pop(userId);
      } else {
        state.posts[postIndex][path].push(userId);
      }

      state.error = '';
      state.loading = false;
    },
    [updatePost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getAllPosts.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [getAllPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = [...action.payload];
      state.error = '';
    },
    [getAllPosts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [deletePost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default postSlice.reducer;
