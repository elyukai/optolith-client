import BorderButton from '../../layout/BorderButton';
import CultureStore from '../../../stores/rcp/CultureStore';
import HerolistActions from '../../../actions/HerolistActions';
import HerolistItem from './HerolistItem';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import TextField from '../../layout/TextField';

class Herolist extends Component {

	state = {
		list: [
			{
				id: 'H_2',
				ap: 1460,
				apUsed: 1459,
				avatar: 'images/portrait.png',
				culture: 'C_7',
				name: 'Shimo ibn Rashdul',
				profession: 'P_24',
				professionVariant: null,
				race: 'R_5'
			},
			{
				id: 'H_1',
				ap: 1160,
				apUsed: 936,
				avatar: 'images/portrait2.png',
				culture: 'C_8',
				name: 'Yendan Keres',
				profession: 'P_16',
				professionVariant: 'PV_52',
				race: 'R_1'
			}
		]
	};

	constructor(props) {
		super(props);
	}

	filter = event => HerolistActions.filter(event.target.value);
	sort = option => HerolistActions.sort(option);
	showHeroCreation = () => HerolistActions.showHeroCreation();

	render() {
		return (
			<section id="herolist">
				<div className="page">
					<div className="options">
						<TextField hint="Suchen" value={''} onChange={this.filter} fullWidth disabled />
						<RadioButtonGroup active={'name'} onClick={this.sort} array={[
							{
								name: 'Alphabetisch',
								value: 'name'
							},
							{
								name: 'AP',
								value: 'ap'
							}
						]} disabled/>
						<BorderButton label="Erstellen" onClick={this.showHeroCreation} />
					</div>
					<Scroll className="list">
						<ul>
							{
								this.state.list.map(hero => <HerolistItem key={hero.id} {...hero} />)
							}
						</ul>
					</Scroll>
				</div>
			</section>
		);
	}
}

export default Herolist;
