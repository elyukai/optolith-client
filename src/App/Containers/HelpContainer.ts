import { connect } from "react-redux";
import { AppState } from "../Reducers/appReducer";
import { Help, HelpDispatchProps, HelpOwnProps, HelpStateProps } from "../Views/Help/Help";

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

const connectHelp = connect<HelpStateProps, HelpDispatchProps, HelpOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
)

export const HelpContainer = connectHelp (Help)
