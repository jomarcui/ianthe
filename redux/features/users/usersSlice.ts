import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const usersSlice = createSlice({
  initialState,
  name: 'users',
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
