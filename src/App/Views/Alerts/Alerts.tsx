import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { PromptOptions } from "../../Actions/AlertActions";
import { Alert } from "../Universal/Alert";

export interface AlertsOwnProps { }

export interface AlertsStateProps {
  options: Maybe<Record<PromptOptions<any>>>
}

export interface AlertsDispatchProps {
  close (): void
}

export type AlertsProps = AlertsStateProps & AlertsDispatchProps & AlertsOwnProps

export const Alerts = Alert
