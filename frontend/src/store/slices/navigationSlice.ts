import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  projectsOpen: boolean;
  backstageOpen: boolean;
  focusArea: 'sidebar' | 'main';
}

const initialState: NavigationState = {
  projectsOpen: false,
  backstageOpen: false,
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
    setBackstageOpen: (state, action: PayloadAction<boolean>) => {
      state.backstageOpen = action.payload;
    },
    toggleBackstage: (state) => {
      state.backstageOpen = !state.backstageOpen;
    },
    setFocusArea: (state, action: PayloadAction<'sidebar' | 'main'>) => {
      state.focusArea = action.payload;
    },
  },
});

export const { setProjectsOpen, toggleProjects, setBackstageOpen, toggleBackstage, setFocusArea } = navigationSlice.actions;

export default navigationSlice.reducer; 