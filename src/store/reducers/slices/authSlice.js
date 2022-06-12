import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  signup as userSignup,
  checkUserNameTaken,
  createUser,
  signin as userSignin,
  signout as userSignout,
  getDocById,
  updateUserProfile,
} from 'services/firebaseApi';

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
  async (user, { getState, requestId }) => {
    const { loading, currentRequestId } = getState().auth;
    if (loading !== 'pending' || currentRequestId !== requestId) {
      return null;
    }
    const res = await getDocById(user.uid, 'users');
    if (res?.id) {
      const authUser = { id: res.id, ...user, ...res.data() };
      localStorage.setItem('token', user.accessToken);
      return authUser;
    }
    return null;
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
  loading: 'idle',
  currentRequestId: undefined,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = 'idle';
    },
  },
  extraReducers: {
    [signin.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    [signin.rejected]: (state, action) => {
      state.user = null;
      state.loading = 'idle';
      state.error = action.payload;
    },
    [signup.pending]: (state) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },
    [signup.rejected]: (state, action) => {
      state.user = null;
      state.loading = 'idle';
      state.error = action.payload;
    },
    [getAuthUserData.pending]: (state, action) => {
      if (state.loading === 'idle' || !state.currentRequestId) {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [getAuthUserData.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.user = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [getAuthUserData.rejected]: (state, action) => {
      state.user = null;
      state.loading = 'idle';
      state.error = action.payload;
      state.currentRequestId = undefined;
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
      const {
        payload,
        meta: { requestId },
      } = action;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.error = payload;
      }
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
