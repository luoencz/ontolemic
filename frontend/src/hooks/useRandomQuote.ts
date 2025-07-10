import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchRandomQuote } from '../store/slices/quoteSlice';

export const useRandomQuote = () => {
  const dispatch = useAppDispatch();
  const { currentQuote, loading, initialized } = useAppSelector(state => state.quote);

  useEffect(() => {
    // Only fetch quote if not already initialized
    if (!initialized) {
      dispatch(fetchRandomQuote());
    }
  }, [dispatch, initialized]);

  const refreshQuote = () => {
    dispatch(fetchRandomQuote());
  };

  return { quote: currentQuote, loading, refreshQuote };
}; 