import * as React from 'react';
import { Dispatch } from 'redux';
import { Alert } from '../../components/Alert';
import { Alert as AlertOptions } from '../../types/data';
import { UIMessagesObject } from '../../types/ui';
import { Maybe } from '../../utils/dataUtils';

export interface AlertsOwnProps {
  locale: UIMessagesObject;
}

export interface AlertsStateProps {
  options: Maybe<AlertOptions>;
}

export interface AlertsDispatchProps {
  close (): void;
  dispatch: Dispatch;
}

export type AlertsProps = AlertsStateProps & AlertsDispatchProps & AlertsOwnProps;

export class Alerts extends React.Component<AlertsProps> {
  render () {
    return (
      <Alert {...this.props} />
    );
  }
}
