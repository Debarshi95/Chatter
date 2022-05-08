import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, postReducer, searchReducer, userReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  search: searchReducer,
  user: userReducer,
});

export default rootReducer;
