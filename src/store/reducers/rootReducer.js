import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './slices';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
