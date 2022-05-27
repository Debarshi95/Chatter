/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { getDownloadURL } from 'Firebase';
import {
  signup as userSignup,
  checkUserNameTaken,
  createUser,
  signin as userSignin,
  signout as userSignout,
  getDocById,
  updateUserProfile,
  uploadAvatar,
  updateUserInfo as updateProfileInfo,
} from 'services/firebaseApi';
import { getProfileData } from './profileSlice';

export const signin = createAsyncThunk('auth/signin', async (inputData, { rejectWithValue }) => {
  try {
    await userSignin(inputData);
  } catch (error) {
    return rejectWithValue({ message: error?.message, code: error?.code });
  }
  return null;
});

export const getAuthUserData = createAsyncThunk(
  'auth/getAuthUserData',
  async (user, { rejectWithValue, dispatch }) => {
    try {
      const res = await getDocById(user.uid, 'users');
      if (res?.id) {
        const authUser = { id: res.id, ...user, ...res.data() };
        localStorage.setItem('token', user.accessToken);
        // eslint-disable-next-line no-use-before-define
        dispatch(setUser(authUser));
      }
    } catch (error) {
      rejectWithValue({ message: error?.message });
    }
  }
);

export const signup = createAsyncThunk('auth/signup', async (inputData, { rejectWithValue }) => {
  try {
    const { email, password, username } = inputData;
    const resData = await checkUserNameTaken(username);

    if (resData?.docs?.length) {
      throw new Error('Username already taken!!');
    }

    const res = await userSignup({ email, password });
    if (res?.user) {
      await createUser({ username, email, uid: res.user.uid });
    }
  } catch (error) {
    rejectWithValue({ message: error?.message, code: error?.code });
  }
});

export const updateAuthUserProfile = createAsyncThunk(
  'profile/updateAuthUserProfile',
  async (userData, { rejectWithValue, dispatch }) => {
    const { avatar, username, bio, userId, fullname = '' } = userData;

    try {
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
      return { ...userData, avatar: url };
    } catch (error) {
      rejectWithValue(error);
    }
    return null;
  }
);

export const updateAuthUserData = createAsyncThunk(
  'auth/updateAuthUserData',
  async (userData, { rejectWithValue }) => {
    const { type, authUserId, userId } = userData;
    try {
      await Promise.all([
        updateUserProfile({ docId: userId, type, data: authUserId, path: 'followers' }),
        updateUserProfile({ docId: authUserId, type, data: userId, path: 'following' }),
      ]);
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const signout = createAsyncThunk('auth/signout', async (_, { dispatch }) => {
  await userSignout();
  localStorage.removeItem('token');
  // eslint-disable-next-line no-use-before-define
  dispatch(setUser(null));
});

const initialState = {
  user: null,
  loading: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
  extraReducers: {
    [signin.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [signup.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [getAuthUserData.pending]: (state) => {
      state.loading = true;
    },
    [getAuthUserData.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [updateAuthUserData.fulfilled]: (state, action) => {
      const { type, userId } = action.payload;

      if (type === 'UPDATE') {
        state.user.following.push(userId);
      } else {
        state.user.following = state.user.following.filter((followingId) => followingId !== userId);
      }
      state.error = '';
    },
    [updateAuthUserData.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [updateAuthUserProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [updateAuthUserProfile.fulfilled]: (state, action) => {
      const { payload } = action;
      const { user } = state;
      state.user = { ...user, ...payload };
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
