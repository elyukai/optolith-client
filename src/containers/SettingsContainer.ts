import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as IOActions from '../actions/IOActions';
import * as LocaleActions from '../actions/LocaleActions';
import { AppState } from '../reducers/appReducer';
import { getLocaleId, getLocaleType } from '../selectors/stateSelectors';
import { areAnimationsEnabled, getIsEditingHeroAfterCreationPhaseEnabled, getTheme } from '../selectors/uisettingsSelectors';
import { Maybe } from '../utils/dataUtils';
import { Settings, SettingsDispatchProps, SettingsOwnProps, SettingsStateProps } from '../views/navigationbar/Settings';

const mapStateToProps = (state: AppState): SettingsStateProps => ({
  localeString: getLocaleId (state),
  localeType: getLocaleType (state),
  isEditingHeroAfterCreationPhaseEnabled: getIsEditingHeroAfterCreationPhaseEnabled (state),
  areAnimationsEnabled: areAnimationsEnabled (state),
  theme: getTheme (state),
});

const mapDispatchToProps =
  (dispatch: Dispatch<Action, AppState>, ownProps: SettingsOwnProps): SettingsDispatchProps => ({
    setTheme (theme: Maybe<string>) {
      if (Maybe.isJust (theme)) {
        dispatch (ConfigActions.setTheme (Maybe.fromJust (theme)));
      }
    },
    switchEnableEditingHeroAfterCreationPhase () {
      dispatch (ConfigActions.switchEnableEditingHeroAfterCreationPhase ());
    },
    saveConfig () {
      dispatch (IOActions.requestConfigSave (ownProps.locale));
    },
    setLocale (id: Maybe<string>) {
      dispatch (LocaleActions.setLocale (id));
    },
    switchEnableAnimations () {
      dispatch (ConfigActions.switchEnableAnimations ());
    },
  });

export const connectSettings =
  connect<SettingsStateProps, SettingsDispatchProps, SettingsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const SettingsContainer = connectSettings (Settings);
