import { connect } from "react-redux"
import { AppStateRecord } from "../Models/AppState"
import { Help, HelpDispatchProps, HelpOwnProps, HelpStateProps } from "../Views/Help/Help"

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

const connectHelp = connect<HelpStateProps, HelpDispatchProps, HelpOwnProps, AppStateRecord> (
  mapStateToProps,
  mapDispatchToProps
)

export const HelpContainer = connectHelp (Help)
