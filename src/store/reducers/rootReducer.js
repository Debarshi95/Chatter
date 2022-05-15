import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, postReducer, searchReducer, profileReducer, sidebarReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  search: searchReducer,
  profile: profileReducer,
  sidebar: sidebarReducer,
});

export default rootReducer;
