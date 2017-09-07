import * as React from 'react';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { SegmentedControls } from '../../components/SegmentedControls';
import { TextField } from '../../components/TextField';
import { ExperienceLevel, InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface Props extends DialogProps {
	locale: UIMessages;
	elList: Map<string, ExperienceLevel>;
	close(): void;
	createHero(name: string, sex: 'm' | 'f', el: string): void;
}

export interface State {
	name: string;
	gender?: 'm' | 'f';
	el?: string;
}

export class HeroCreation extends React.Component<Props, State> {
	state: State = {
		name: '',
	};

	changeName = (event: InputTextEvent) => this.setState({ name: event.target.value } as State);
	changeGender = (gender: string) => this.setState({ gender } as State);
	changeEL = (el: string) => this.setState({ el } as State);
	create = () => {
		const { name, gender, el } = this.state;
		if (name.length > 0 && gender && el) {
			this.props.createHero(name, gender, el);
		}
	}
	close = () => {
		this.props.close();
		this.setState({ name: '', gender: undefined, el: undefined });
	}

	render() {
		const { elList, locale, ...other } = this.props;
		const experienceLevels = [...elList.values()].map(e => {
			const { id, name, ap } = e;
			return { id, name: `${name} (${ap} AP)` };
		});

		return (
			<Dialog {...other} id="herocreation" title={_translate(locale, 'herocreation.title')} close={this.close} buttons={[
				{
					disabled: this.state.name === '' || !this.state.gender || !this.state.el,
					label: _translate(locale, 'herocreation.actions.start'),
					onClick: this.create,
					primary: true,
				},
			]}>
				<TextField
					hint={_translate(locale, 'herocreation.options.nameofhero')}
					value={this.state.name}
					onChange={this.changeName}
					fullWidth
					autoFocus
					/>
				<SegmentedControls
					active={this.state.gender}
					onClick={this.changeGender}
					options={[{value: 'm', name: _translate(locale, 'herocreation.options.selectsex.male')}, {value: 'f', name: _translate(locale, 'herocreation.options.selectsex.female')}]}
					/>
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={experienceLevels}
					hint={_translate(locale, 'herocreation.options.selectexperiencelevel')}
					fullWidth
					/>
			</Dialog>
		);
	}
}
