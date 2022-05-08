export {
  default as authReducer,
  requestSignIn,
  requestSignUp,
  setUser,
  requestSignOut,
  requestGetAuthUserData,
} from './authSlice';

export {
  default as postReducer,
  requestCreatePost,
  requestGetAllPosts,
  requestUpdatePost,
} from './postSlice';

export { default as searchReducer, requestGetAllUsers } from './searchSlice';
export {
  default as userReducer,
  requestGetUserProfilePosts,
  requestUpdateUserProfileData,
} from './userSlice';
