import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  projectsOpen: boolean;
  researchOpen: boolean;
  backstageOpen: boolean;
  focusArea: 'sidebar' | 'main';
}

const initialState: NavigationState = {
  projectsOpen: false,
  researchOpen: false,
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
    setResearchOpen: (state, action: PayloadAction<boolean>) => {
      state.researchOpen = action.payload;
    },
    toggleResearch: (state) => {
      state.researchOpen = !state.researchOpen;
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

export const { setProjectsOpen, toggleProjects, setResearchOpen, toggleResearch, setBackstageOpen, toggleBackstage, setFocusArea } = navigationSlice.actions;

export default navigationSlice.reducer; 