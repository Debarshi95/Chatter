export {
  default as authReducer,
  requestSignIn,
  requestSignUp,
  setUser,
  requestSignOut,
} from './authSlice';

export { default as postReducer, requestCreatePost, requestGetAllPosts } from './postSlice';

export { default as searchReducer, requestGetAllUsers } from './searchSlice';
export {
  default as userReducer,
  requestGetUserPosts,
  requestUpdateUserProfileData,
} from './userSlice';
