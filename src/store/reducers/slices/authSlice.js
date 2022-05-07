import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signup, checkUserNameTaken, createUser, signin, signout } from 'services/firebaseApi';

export const requestSignIn = createAsyncThunk(
  'auth/requestSignin',
  async (inputData, { rejectWithValue }) => {
    try {
      const res = await signin(inputData);
      return res;
    } catch (error) {
      return rejectWithValue({ message: error?.message, code: error?.code });
    }
  }
);

export const requestSignUp = createAsyncThunk(
  'auth/requestSignup',
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
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
