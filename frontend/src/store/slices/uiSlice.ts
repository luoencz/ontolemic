import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarVisible: boolean;
  soundEnabled: boolean;
  showControls: boolean;
  showSettings: boolean;
}

const initialState: UIState = {
  sidebarVisible: true,
  soundEnabled: true,
  showControls: false,
  showSettings: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.sidebarVisible = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setShowControls: (state, action: PayloadAction<boolean>) => {
      state.showControls = action.payload;
    },
    setShowSettings: (state, action: PayloadAction<boolean>) => {
      state.showSettings = action.payload;
    },
    closeAllModals: (state) => {
      state.showControls = false;
      state.showSettings = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarVisible,
  toggleSound,
  setSoundEnabled,
  setShowControls,
  setShowSettings,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer; 