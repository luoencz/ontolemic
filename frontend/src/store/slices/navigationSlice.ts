import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  expandedIds: Record<string, boolean>;
  focusArea: 'sidebar' | 'main';
  // Legacy fields for backward compatibility
  projectsOpen: boolean;
  researchOpen: boolean;
  backstageOpen: boolean;
}

const initialState: NavigationState = {
  expandedIds: {},
  focusArea: 'sidebar',
  // Legacy fields
  projectsOpen: false,
  researchOpen: false,
  backstageOpen: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNodeExpanded: (state, action: PayloadAction<{ id: string; expanded: boolean }>) => {
      state.expandedIds[action.payload.id] = action.payload.expanded;
      // Sync legacy fields
      if (action.payload.id === 'projects') state.projectsOpen = action.payload.expanded;
      if (action.payload.id === 'research') state.researchOpen = action.payload.expanded;
      if (action.payload.id === 'backstage') state.backstageOpen = action.payload.expanded;
    },
    toggleNode: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.expandedIds[id] = !state.expandedIds[id];
      // Sync legacy fields
      if (id === 'projects') state.projectsOpen = !state.projectsOpen;
      if (id === 'research') state.researchOpen = !state.researchOpen;
      if (id === 'backstage') state.backstageOpen = !state.backstageOpen;
    },
    setFocusArea: (state, action: PayloadAction<'sidebar' | 'main'>) => {
      state.focusArea = action.payload;
    },
    // Legacy actions for backward compatibility
    setProjectsOpen: (state, action: PayloadAction<boolean>) => {
      state.projectsOpen = action.payload;
      state.expandedIds['projects'] = action.payload;
    },
    toggleProjects: (state) => {
      state.projectsOpen = !state.projectsOpen;
      state.expandedIds['projects'] = state.projectsOpen;
    },
    setResearchOpen: (state, action: PayloadAction<boolean>) => {
      state.researchOpen = action.payload;
      state.expandedIds['research'] = action.payload;
    },
    toggleResearch: (state) => {
      state.researchOpen = !state.researchOpen;
      state.expandedIds['research'] = state.researchOpen;
    },
    setBackstageOpen: (state, action: PayloadAction<boolean>) => {
      state.backstageOpen = action.payload;
      state.expandedIds['backstage'] = action.payload;
    },
    toggleBackstage: (state) => {
      state.backstageOpen = !state.backstageOpen;
      state.expandedIds['backstage'] = state.backstageOpen;
    },
  },
});

export const { 
  setNodeExpanded, 
  toggleNode, 
  setFocusArea,
  // Legacy exports
  setProjectsOpen, 
  toggleProjects, 
  setResearchOpen, 
  toggleResearch, 
  setBackstageOpen, 
  toggleBackstage 
} = navigationSlice.actions;

export default navigationSlice.reducer; 