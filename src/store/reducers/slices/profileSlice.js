import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDownloadURL } from 'Firebase';
import {
  getDocById,
  getPosts,
  updateUserProfile,
  updateUserInfo as updateProfileInfo,
  uploadAvatar,
} from 'services/firebaseApi';

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

export const updateProfileData = createAsyncThunk(
  'profile/updateProfileData',
  async (userData, { rejectWithValue }) => {
    const { type, authUserId, userId } = userData;

    try {
      await Promise.all([
        updateUserProfile({ docId: userId, type, data: authUserId, path: 'followers' }),
        updateUserProfile({ docId: authUserId, type, data: userId, path: 'following' }),
      ]);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'profile/updateUserInfo',
  async (userData, { rejectWithValue }) => {
    const { avatar: file, username, bio, userId } = userData;

    try {
      let url;
      if (typeof file === 'object') {
        const res = await uploadAvatar(file);
        if (res.ref.name) {
          url = await getDownloadURL(res.ref);
          await updateProfileInfo({ userId, username, bio, avatar: url || '' });
        }
      } else {
        await updateProfileInfo({ userId, username, bio, avatar: file });
      }

      return { ...userData, avatar: file || url };
    } catch (error) {
      rejectWithValue(error);
    }
    return null;
  }
);

const initialState = {
  user: {
    followers: [],
    following: [],
    posts: [],
    retweets: [],
    likes: [],
    loading: false,
    username: '',
    bio: '',
    avatar: '',
  },
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
    [updateUserInfo.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [updateUserInfo.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
    },
    [updateUserInfo.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export default profileSlice.reducer;
