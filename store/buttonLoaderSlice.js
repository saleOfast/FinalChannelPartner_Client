import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isButtonLoading: false,
};

export const buttonLoaderSlice = createSlice({
  name: 'buttonLoader',
  initialState,
  reducers: {
    startButtonLoading: (state) => {
      state.isButtonLoading = true;
    },
    stopButtonLoading: (state) => {
      state.isButtonLoading = false;
    },
  },
});

export const { startButtonLoading, stopButtonLoading } = buttonLoaderSlice.actions;

export default buttonLoaderSlice.reducer;
