import { connect } from 'react-redux';
import { AppState } from '../reducers/appReducer';
import { Help, HelpDispatchProps, HelpOwnProps, HelpStateProps } from '../views/help/Help';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const connectHelp = connect<HelpStateProps, HelpDispatchProps, HelpOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
);

export const HelpContainer = connectHelp (Help);
