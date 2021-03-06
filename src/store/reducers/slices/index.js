export {
  default as authReducer,
  signin,
  signup,
  setUser,
  signout,
  getAuthUserData,
  updateAuthUserData,
} from './authSlice';

export {
  default as postReducer,
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} from './postSlice';

export { default as searchReducer, getAllUsers, getTrendingPosts } from './searchSlice';
export {
  default as profileReducer,
  getProfileData,
  setProfileState,
  updateProfile,
} from './profileSlice';
export {
  default as commentReducer,
  createComment,
  getPostComments,
  getPostById,
} from './commentSlice';
