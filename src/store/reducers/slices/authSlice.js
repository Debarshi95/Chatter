import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  signup,
  checkUserNameTaken,
  createUser,
  signin,
  signout,
  getDocById,
} from 'services/firebaseApi';

export const requestSignIn = createAsyncThunk(
  'auth/signin',
  async (inputData, { rejectWithValue }) => {
    try {
      const res = await signin(inputData);
      return res;
    } catch (error) {
      return rejectWithValue({ message: error?.message, code: error?.code });
    }
  }
);

export const requestGetUserData = createAsyncThunk(
  'auth/getUserData',
  async (uid, { rejectWithValue }) => {
    try {
      const res = await getDocById(uid, 'users');
      if (res?.id) {
        return { id: res.id, ...res.data() };
      }
      return null;
    } catch (error) {
      return rejectWithValue({ message: error?.message });
    }
  }
);

export const requestSignUp = createAsyncThunk(
  'auth/signup',
  async (inputData, { rejectWithValue }) => {
    try {
      const { email, password, username } = inputData;
      const resData = await checkUserNameTaken(username);

      if (resData?.docs?.length) {
        throw new Error('Username already taken!!');
      }

      const res = await signup({ email, password });
      if (res?.user) {
        const response = await createUser({ username, email, uid: res.user.uid });
        return response;
      }
      return null;
    } catch (error) {
      return rejectWithValue({ message: error?.message, code: error?.code });
    }
  }
);

export const requestSignOut = createAsyncThunk('auth/signout', async () => {
  await signout();
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
    [requestSignIn.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestSignIn.fulfilled]: (state) => {
      state.loading = false;
    },
    [requestSignIn.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [requestSignUp.pending]: (state) => {
      state.loading = true;
      state.error = '';
    },
    [requestSignUp.fulfilled]: (state) => {
      state.loading = false;
    },
    [requestSignUp.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    [requestGetUserData.fulfilled]: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.loading = false;
      state.error = '';
    },
    [requestGetUserData.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
