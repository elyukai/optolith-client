import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { isInteger } from '../../utils/RegexUtils';

export interface AttributesRemovePermanentProps {
	locale: UIMessages;
	node?: HTMLDivElement;
	remove(value: number): void;
}

interface State {
	value: string;
}

export class AttributesRemovePermanent extends React.Component<AttributesRemovePermanentProps, State> {
	state = {
		value: '',
	};

	onChange = (event: InputTextEvent) => this.setState({ value: event.target.value } as State);
	remove = () => this.props.remove(Number.parseInt(this.state.value));

	render() {
		const { value } = this.state;

		return (
			<Dialog id="overview-add-ap" title={_translate(this.props.locale, 'removepermanentenergypoints.title')} node={this.props.node} buttons={[
				{
					disabled: !isInteger(this.state.value),
					label: _translate(this.props.locale, 'modal.actions.remove'),
					onClick: this.remove,
				},
				{
					label: _translate(this.props.locale, 'modal.actions.cancel'),
				},
			]}>
				<TextField
					hint={_translate(this.props.locale, 'removepermanentenergypoints.inputhint')}
					value={value}
					onChange={this.onChange}
					fullWidth
					autoFocus
					/>
			</Dialog>
		);
	}
}
