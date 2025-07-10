import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import navigationReducer from './slices/navigationSlice';
import contentReducer from './slices/contentSlice';
import quoteReducer from './slices/quoteSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    navigation: navigationReducer,
    content: contentReducer,
    quote: quoteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 