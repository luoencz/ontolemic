import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  projectsOpen: boolean;
  focusArea: 'sidebar' | 'main';
}

const initialState: NavigationState = {
  projectsOpen: false,
  focusArea: 'sidebar',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setProjectsOpen: (state, action: PayloadAction<boolean>) => {
      state.projectsOpen = action.payload;
    },
    toggleProjects: (state) => {
      state.projectsOpen = !state.projectsOpen;
    },
    setFocusArea: (state, action: PayloadAction<'sidebar' | 'main'>) => {
      state.focusArea = action.payload;
    },
  },
});

export const { setProjectsOpen, toggleProjects, setFocusArea } = navigationSlice.actions;

export default navigationSlice.reducer; 