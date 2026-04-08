import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import {
  FLUSH,
  PERSIST,
  persistCombineReducers,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const fixedStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: "root",
  storage: fixedStorage,
  whitelist: ["auth"],
};

const persistedReducer = persistCombineReducers(persistConfig, {
  auth: authReducer,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [PERSIST, REHYDRATE, FLUSH, REGISTER, PURGE],
      },
    }),
});

export const persistor = persistStore(store);
export default store;