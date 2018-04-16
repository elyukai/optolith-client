import * as React from 'react';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { isNaturalNumber } from '../../utils/RegexUtils';

export interface AttributesRemovePermanentProps extends DialogProps {
	locale: UIMessages;
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
		const { locale, ...other } = this.props;
		const { value } = this.state;

		return (
			<Dialog
				{...other}
				id="overview-add-ap"
				title={_translate(locale, 'removepermanentenergypoints.title')}
				buttons={[
					{
						disabled: !isNaturalNumber(this.state.value),
						label: _translate(locale, 'modal.actions.remove'),
						onClick: this.remove,
					},
					{
						label: _translate(locale, 'modal.actions.cancel'),
					},
				]}>
				<TextField
					hint={_translate(locale, 'removepermanentenergypoints.inputhint')}
					value={value}
					onChange={this.onChange}
					fullWidth
					autoFocus
					/>
			</Dialog>
		);
	}
}
