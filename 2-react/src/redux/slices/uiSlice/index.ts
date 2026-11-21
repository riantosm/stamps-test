import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUiReduxState } from "@/types/ui.types";

const initialState: IUiReduxState = {
  isGlobalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.isGlobalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
