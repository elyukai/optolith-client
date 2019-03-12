import { connect } from 'react-redux';
import { Help, HelpDispatchProps, HelpOwnProps, HelpStateProps } from '../../views/help/Help';
import { AppState } from '../Reducers/appReducer';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const connectHelp = connect<HelpStateProps, HelpDispatchProps, HelpOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
);

export const HelpContainer = connectHelp (Help);
