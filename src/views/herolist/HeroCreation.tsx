import * as React from 'react';
import { Dialog } from '../../components/Dialog';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { ExperienceLevel, InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

interface Props {
	node?: HTMLDivElement;
	locale: UIMessages | undefined;
	elList: ExperienceLevel[];
	createHero: (name: string, sex: 'm' | 'f', el: string) => void;
}

interface State {
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

	render() {
		const { elList, locale } = this.props;
		const experienceLevels = elList.map(e => {
			const { id, name, ap } = e;
			return { id, name: `${name} (${ap} AP)` };
		});

		return (
			<Dialog id="herocreation" title={_translate(locale, 'herocreation.title')} node={this.props.node} buttons={[
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
				<Dropdown
					value={this.state.gender}
					onChange={this.changeGender}
					options={[{id: 'm', name: _translate(locale, 'herocreation.options.selectsex.male')}, {id: 'f', name: _translate(locale, 'herocreation.options.selectsex.female')}]}
					hint={_translate(locale, 'herocreation.options.selectsex')}
					fullWidth />
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={experienceLevels}
					hint={_translate(locale, 'herocreation.options.selectexperiencelevel')}
					fullWidth />
			</Dialog>
		);
	}
}
