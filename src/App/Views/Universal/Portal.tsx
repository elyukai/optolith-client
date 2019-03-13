import { connect } from 'react-redux';
import { AppState } from '../App/Reducers/appReducer';
import { getTheme } from '../App/Selectors/uisettingsSelectors';
import { PortalWrapped, PortalWrappedDispatchProps, PortalWrappedOwnProps, PortalWrappedStateProps } from './PortalWrapped';

const mapStateToProps = (state: AppState): PortalWrappedStateProps => ({
  theme: getTheme (state),
});

export { PortalWrappedOwnProps };

const connectPortal =
  connect<PortalWrappedStateProps, PortalWrappedDispatchProps, PortalWrappedOwnProps, AppState> (
    mapStateToProps
  );

export const Portal = connectPortal (PortalWrapped);
