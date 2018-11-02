import { connect } from 'react-redux';
import { AppState } from '../reducers/appReducer';
import { getTheme } from '../selectors/uisettingsSelectors';
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
