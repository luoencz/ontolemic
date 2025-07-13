import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import yaml from 'js-yaml';

interface Quote {
  text: string;
  author: string;
}

interface QuotesData {
  quotes: Quote[];
}

interface QuoteState {
  currentQuote: string;
  loading: boolean;
  initialized: boolean;
}

const initialState: QuoteState = {
  currentQuote: '',
  loading: false,
  initialized: false,
};

export const fetchRandomQuote = createAsyncThunk(
  'quote/fetchRandom',
  async () => {
    const response = await fetch('/data/quotes.yaml');
    const yamlText = await response.text();
    const data = yaml.load(yamlText) as QuotesData;
    
    if (data.quotes && data.quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.quotes.length);
      return data.quotes[randomIndex].text;
    }
    throw new Error('No quotes available');
  }
);

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRandomQuote.fulfilled, (state, action) => {
        state.currentQuote = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchRandomQuote.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export default quoteSlice.reducer; 