import { connect } from "react-redux"
import { AppStateRecord } from "../../Models/AppState"
import { getTheme } from "../../Selectors/uisettingsSelectors"
import { PortalWrapped, PortalWrappedDispatchProps, PortalWrappedOwnProps, PortalWrappedStateProps } from "./PortalWrapped"

const mapStateToProps = (state: AppStateRecord): PortalWrappedStateProps => ({
  theme: getTheme (state),
})

export { PortalWrappedOwnProps }

const connectPortal =
  connect<
    PortalWrappedStateProps,
    PortalWrappedDispatchProps,
    PortalWrappedOwnProps,
    AppStateRecord
  > (
    mapStateToProps
  )

export const Portal = connectPortal (PortalWrapped)
