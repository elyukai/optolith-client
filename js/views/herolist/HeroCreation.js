import Dialog from '../../components/Dialog';
import Dropdown from '../../components/Dropdown';
import HerolistActions from '../../actions/HerolistActions';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

class HeroCreation extends Component {

	static props = { 
		node: PropTypes.node
	};

	state = { 
		name: '',
		gender: '',
		el: 'EL_0'
	};
	
	changeName = event => this.setState({ name: event.target.value });
	changeGender = gender => this.setState({ gender });
	changeEL = el => this.setState({ el });
	create = () => HerolistActions.createNewHero(this.state);
	
	render() {

		return (
			<Dialog id="herocreation" title="Heldenerstellung" node={this.props.node} buttons={[
				{
					label: 'Starten',
					onClick: this.create,
					primary: true,
					disabled: this.state.name === '' || this.state.gender === '' || this.state.el === 'EL_0'
				}
			]}>
				<TextField hint="Name des Helden" value={this.state.name} onChange={this.changeName} fullWidth />
				<Dropdown
					value={this.state.gender}
					onChange={this.changeGender}
					options={[['männlich', 'm'], ['weiblich', 'f']]}
					hint="Geschlecht auswählen"
					fullWidth />
				<Dropdown
					value={this.state.el}
					onChange={this.changeEL}
					options={[
						['Unerfahren (900 AP)', 'EL_1'],
						['Durchschnittlich (1000 AP)', 'EL_2'],
						['Erfahren (1100 AP)', 'EL_3'],
						['Kompetent (1200 AP)', 'EL_4'],
						['Meisterlich (1400 AP)', 'EL_5'],
						['Brilliant (1700 AP)', 'EL_6'],
						['Legendär (2100 AP)', 'EL_7']
					]}
					hint="Erfahrungsgrad auswählen"
					fullWidth />
			</Dialog>
		);
	}
}

export default HeroCreation;
