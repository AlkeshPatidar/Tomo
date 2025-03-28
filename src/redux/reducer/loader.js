import {createSlice} from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    loader: false
  },
  reducers: {
    
    setLoader(state, action) {
      return {...state, loader: action.payload};
    },
  },
});

export const {setLoader} = loaderSlice.actions;

export default loaderSlice.reducer;
