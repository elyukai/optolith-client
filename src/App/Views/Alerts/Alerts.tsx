import * as React from "react";
import { Dispatch } from "redux";
import { Maybe } from "../../../Data/Maybe";
import { Alert as AlertOptions } from "../../Actions/AlertActions";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Alert, AlertProps } from "../Universal/Alert";

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

export const Alerts: React.FC<AlertProps> = ({ dispatch, l10n, options, close }) => (
  <Alert
    dispatch={dispatch}
    l10n={l10n}
    options={options}
    close={close}
    />
)
