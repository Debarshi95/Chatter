import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, postReducer, searchReducer, profileReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  search: searchReducer,
  profile: profileReducer,
});

export default rootReducer;
