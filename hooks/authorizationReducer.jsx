import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    
    userInfo: {},
    token:''
  },
  reducers: {
    setuserInfo: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.access_token;
    },
   
    logout: (state, action) => {
      state.userInfo = {};
      state.token = '';
    },
  },
});

export const { setuserInfo, logout,setupdateuserInfo } = userSlice.actions;
export default userSlice.reducer;