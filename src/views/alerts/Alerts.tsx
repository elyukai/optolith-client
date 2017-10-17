import * as React from 'react';
import { Action } from 'redux';
import { Alert } from '../../components/Alert';
import { Alert as AlertOptions } from '../../types/data.d';
import { UIMessages } from '../../types/ui';

export interface AlertsOwnProps {
	locale: UIMessages;
}

export interface AlertsStateProps {
	options: AlertOptions | null;
}

export interface AlertsDispatchProps {
	close(): void;
	dispatch(action: Action): void;
}

export type AlertsProps = AlertsStateProps & AlertsDispatchProps & AlertsOwnProps;

export class Alerts extends React.Component<AlertsProps> {
	render() {
		return (
			<Alert {...this.props} />
		);
	}
}

