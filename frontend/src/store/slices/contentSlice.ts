import { createSlice } from '@reduxjs/toolkit';

// Simplified content state - can be expanded later if needed
interface ContentState {
  // Placeholder for future content state
}

const initialState: ContentState = {};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Add reducers as needed
  },
});

export default contentSlice.reducer; 