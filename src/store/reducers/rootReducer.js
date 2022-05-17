import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, postReducer, searchReducer, profileReducer, commentReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  search: searchReducer,
  profile: profileReducer,
  comments: commentReducer,
});

export default rootReducer;
