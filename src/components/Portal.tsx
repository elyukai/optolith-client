import { connect } from 'react-redux';
import { AppState } from '../reducers/appReducer';
import { getTheme } from '../selectors/uisettingsSelectors';
import { PortalWrapped, PortalWrappedDispatchProps, PortalWrappedOwnProps, PortalWrappedStateProps } from './PortalWrapped';

function mapStateToProps(state: AppState) {
  return {
    theme: getTheme(state)
  };
}

function mapDispatchToProps() {
  return {};
}

export { PortalWrappedOwnProps };

export const Portal = connect<PortalWrappedStateProps, PortalWrappedDispatchProps, PortalWrappedOwnProps>(mapStateToProps, mapDispatchToProps)(PortalWrapped);
