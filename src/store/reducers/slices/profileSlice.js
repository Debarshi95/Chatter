import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDownloadURL } from 'Firebase';
import {
  getDocById,
  getPosts,
  uploadAvatar,
  updateUserInfo as updateProfileInfo,
} from 'services/firebaseApi';
import { setUser } from './authSlice';

export const getProfileData = createAsyncThunk(
  'profile/getProfileData',
  async (userId, { getState, requestId }) => {
    const { loading, currentRequestId } = getState().profile;

    if (loading !== 'pending' || currentRequestId !== requestId) {
      return null;
    }
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
  }
);
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (userData, { dispatch, getState }) => {
    const { user } = getState().auth;

    const { avatar, username, bio, userId, fullname = '' } = userData;

    let url;
    if (typeof avatar === 'object') {
      const res = await uploadAvatar(avatar);
      if (res.ref.name) {
        url = await getDownloadURL(res.ref);
        await updateProfileInfo({ userId, username, bio, fullname, avatar: url || '' });
      }
    } else {
      url = avatar;
      await updateProfileInfo({ userId, username, bio, avatar, fullname });
    }
    dispatch(getProfileData(userId));
    dispatch(setUser({ ...user, avatar: url }));
    return null;
  }
);

const initialState = {
  user: null,
  error: '',
  loading: 'pending',
  currentRequestId: undefined,
};
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileState: (state, action) => {
      state.loading = action.payload || 'idle';
    },
  },

  extraReducers: {
    [getProfileData.pending]: (state, action) => {
      if (state.loading === 'idle' || !state.currentRequestId) {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
        state.error = '';
      }
    },
    [getProfileData.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.user = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [getProfileData.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [updateProfile.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
  },
});

export const { setProfileState } = profileSlice.actions;
export default profileSlice.reducer;
