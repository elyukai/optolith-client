import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { PromptOptions } from "../../Actions/AlertActions";
import { Alert, AlertProps } from "../Universal/Alert";

export interface AlertsOwnProps { }

export interface AlertsStateProps {
  options: Maybe<Record<PromptOptions<any>>>
}

export interface AlertsDispatchProps {
  close (): void
}

export type AlertsProps = AlertsStateProps & AlertsDispatchProps & AlertsOwnProps

export const Alerts: React.FC<AlertProps> = ({ options, close }) => (
  <Alert
    options={options}
    close={close}
    />
)
