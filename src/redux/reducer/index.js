// import {combineReducers} from '@reduxjs/toolkit';
// import user from './user';
// export default combineReducers({
//   user,
// });


import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import loader from './loader';
import theme from './theme';

export default combineReducers({
  user,
  loader,
  theme
});
