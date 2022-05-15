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
    const res = await userSignin(inputData);
    return res;
  } catch (error) {
    return rejectWithValue({ message: error?.message, code: error?.code });
  }
});

export const getAuthUserData = createAsyncThunk(
  'auth/getAuthUserData',
  async (user, { rejectWithValue }) => {
    try {
      const res = await getDocById(user.uid, 'users');
      if (res?.id) {
        return { id: res.id, ...user, ...res.data() };
      }
      return null;
    } catch (error) {
      return rejectWithValue({ message: error?.message });
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
      const response = await createUser({ username, email, uid: res.user.uid });
      return response;
    }
    return null;
  } catch (error) {
    return rejectWithValue({ message: error?.message, code: error?.code });
  }
});

export const updateAuthUserProfile = createAsyncThunk(
  'auth/updateAuthUserProfile',
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
    [signin.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [signin.fulfilled]: (state) => {
      state.loading = false;
    },
    [signin.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [signup.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [signup.fulfilled]: (state) => {
      state.loading = false;
    },
    [signup.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [getAuthUserData.fulfilled]: (state, action) => {
      state.user = { ...action.payload };
      state.loading = false;
      state.error = '';
    },
    [getAuthUserData.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [updateAuthUserProfile.fulfilled]: (state, action) => {
      const {
        payload: { type, userId },
      } = action;

      if (type === 'UPDATE') {
        state.user.following.push(userId);
      } else {
        state.user.following = state.user.following.filter((followingId) => followingId !== userId);
      }
      state.error = '';
    },
    [updateAuthUserProfile.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
