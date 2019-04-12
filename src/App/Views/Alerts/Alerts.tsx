import * as React from "react";
import { Dispatch } from "redux";
import { Maybe } from "../../../Data/Maybe";
import { Alert as AlertOptions } from "../../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Alert } from "../Universal/Alert";

export interface AlertsOwnProps {
  l10n: L10nRecord
}

export interface AlertsStateProps {
  options: Maybe<AlertOptions>
}

export interface AlertsDispatchProps {
  close (): void
  dispatch: Dispatch
}

export type AlertsProps = AlertsStateProps & AlertsDispatchProps & AlertsOwnProps

export class Alerts extends React.Component<AlertsProps> {
  render () {
    return (
      <Alert {...this.props} />
    )
  }
}
