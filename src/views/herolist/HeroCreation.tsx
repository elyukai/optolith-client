import * as React from 'react';
import * as HerolistActions from '../../actions/HerolistActions';
import { Dialog } from '../../components/Dialog';
import { Dropdown } from '../../components/Dropdown';
import { TextField } from '../../components/TextField';
import { ELStore } from '../../stores/ELStore';
import { getLocale } from '../../stores/LocaleStore';
import { InputTextEvent } from '../../types/data.d';

interface Props {
	node?: HTMLDivElement;
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
			HerolistActions.createHero(name, gender, el);
		}
	}

	render() {
		const experienceLevels = Object.keys(ELStore.getAll()).map(e => {
			const { id, name, ap } = ELStore.get(e);
			return { id, name: `${name} (${ap} AP)` };
		});

		return (
			<Dialog id="herocreation" title={getLocale()['herocreation.title']} node={this.props.node} buttons={[
				{
					disabled: this.state.name === '' || !this.state.gender || !this.state.el,
					label: getLocale()['herocreation.actions.start'],
					onClick: this.create,
					primary: true,
				},
			]}>
				<TextField
					hint={getLocale()['herocreation.options.nameofhero']}
					value={this.state.name}
					onChange={this.changeName}
					fullWidth
					autoFocus
					/>
				<Dropdown
					value={this.state.gender}
					onChange={this.changeGender}
					options={[{id: 'm', name: getLocale()['herocreation.options.selectsex.male']}, {id: 'f', name: getLocale()['herocreation.options.selectsex.female']}]}
					hint={getLocale()['herocreation.options.selectsex']}
					fullWidth />
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={experienceLevels}
					hint={getLocale()['herocreation.options.selectexperiencelevel']}
					fullWidth />
			</Dialog>
		);
	}
}
