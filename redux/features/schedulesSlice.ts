import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  schedules: [],
};

const schedulesSlice = createSlice({
  initialState,
  name: 'schedules',
  reducers: {
    setSchedule: (state, action) => {
      state.schedules = [...state.schedules, action.payload];
    },
  },
});

export const { setSchedule } = schedulesSlice.actions;

export default schedulesSlice.reducer;
