import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as IOActions from '../actions/IOActions';
import * as LocaleActions from '../actions/LocaleActions';
import { AppState } from '../reducers/appReducer';
import { getLocaleId, getLocaleType } from '../selectors/stateSelectors';
import { areAnimationsEnabled, getTheme, getIsEditingHeroAfterCreationPhaseEnabled } from '../selectors/uisettingsSelectors';
import { Settings, SettingsDispatchProps, SettingsOwnProps, SettingsStateProps } from '../views/navigationbar/Settings';

function mapStateToProps(state: AppState) {
  return {
    localeString: getLocaleId(state),
    localeType: getLocaleType(state),
    isEditingHeroAfterCreationPhaseEnabled: getIsEditingHeroAfterCreationPhaseEnabled(state),
    areAnimationsEnabled: areAnimationsEnabled(state),
    theme: getTheme(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setTheme(theme: string) {
      dispatch(ConfigActions.setTheme(theme));
    },
    switchEnableEditingHeroAfterCreationPhase() {
      dispatch(ConfigActions.switchEnableEditingHeroAfterCreationPhase());
    },
    saveConfig() {
      dispatch(IOActions.requestConfigSave());
    },
    setLocale(id?: string) {
      dispatch(LocaleActions._setLocale(id));
    },
    switchEnableAnimations() {
      dispatch(ConfigActions.switchEnableAnimations());
    },
  };
}

export const SettingsContainer = connect<SettingsStateProps, SettingsDispatchProps, SettingsOwnProps>(mapStateToProps, mapDispatchToProps)(Settings);
