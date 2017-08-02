import { AppState } from '../reducers/app';

export const getCurrentSection = (state: AppState) => state.ui.location.section;
export const getCurrentTab = (state: AppState) => state.ui.location.tab;
