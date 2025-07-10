import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CachedContent {
  data: any;
  timestamp: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface ContentState {
  cache: Record<string, CachedContent>;
  prefetchQueue: string[];
  isPrefetching: boolean;
}

const initialState: ContentState = {
  cache: {},
  prefetchQueue: [],
  isPrefetching: false,
};

// Async thunk for fetching content
export const fetchContent = createAsyncThunk(
  'content/fetch',
  async ({ key, fetcher }: { key: string; fetcher: () => Promise<any> }) => {
    const data = await fetcher();
    return { key, data };
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    addToPrefetchQueue: (state, action: PayloadAction<string[]>) => {
      // Add unique items to queue
      const newItems = action.payload.filter(item => !state.prefetchQueue.includes(item));
      state.prefetchQueue.push(...newItems);
    },
    removeFromPrefetchQueue: (state, action: PayloadAction<string>) => {
      state.prefetchQueue = state.prefetchQueue.filter(item => item !== action.payload);
    },
    setPrefetching: (state, action: PayloadAction<boolean>) => {
      state.isPrefetching = action.payload;
    },
    setCachedContent: (state, action: PayloadAction<{ key: string; data: any }>) => {
      state.cache[action.payload.key] = {
        data: action.payload.data,
        timestamp: Date.now(),
        status: 'succeeded',
      };
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state, action) => {
        const key = action.meta.arg.key;
        state.cache[key] = {
          data: null,
          timestamp: Date.now(),
          status: 'loading',
        };
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.cache[key] = {
          data,
          timestamp: Date.now(),
          status: 'succeeded',
        };
      })
      .addCase(fetchContent.rejected, (state, action) => {
        const key = action.meta.arg.key;
        state.cache[key] = {
          data: null,
          timestamp: Date.now(),
          status: 'failed',
        };
      });
  },
});

export const {
  addToPrefetchQueue,
  removeFromPrefetchQueue,
  setPrefetching,
  setCachedContent,
  clearCache,
} = contentSlice.actions;

export default contentSlice.reducer; 