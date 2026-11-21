import { type Action, combineReducers, configureStore, type ThunkAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore, type PersistConfig, type Storage } from "redux-persist";
import { uiSlice } from "./slices";

const storage: Storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

const reducer = combineReducers({
  ui: uiSlice,
});

const persistConfig: PersistConfig<ReturnType<typeof reducer>> = {
  key: "2-react-root-1",
  version: 1,
  storage,
  // Prakiraan selalu di-fetch ulang; tidak ada state yang perlu disimpan.
  whitelist: [],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
