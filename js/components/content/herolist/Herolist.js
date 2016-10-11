import BorderButton from '../../layout/BorderButton';
import CultureStore from '../../../stores/rcp/CultureStore';
import HerolistActions from '../../../actions/HerolistActions';
import HerolistItem from './HerolistItem';
import HerolistStore from '../../../stores/core/HerolistStore';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import TextField from '../../layout/TextField';

class Herolist extends Component {

	state = {
		list: HerolistStore.getAllForView(),
		filter: HerolistStore.getFilter(),
		sortOrder: HerolistStore.getSortOrder()
	};

	constructor(props) {
		super(props);
	}
	
	_updateHerolistStore = () => this.setState({ 
		list: HerolistStore.getAllForView(),
		filter: HerolistStore.getFilter(),
		sortOrder: HerolistStore.getSortOrder()
	});

	filter = event => HerolistActions.filter(event.target.value);
	sort = option => HerolistActions.sort(option);
	showHeroCreation = () => HerolistActions.showHeroCreation();
	
	componentDidMount() {
		HerolistStore.addChangeListener(this._updateHerolistStore );
	}
	
	componentWillUnmount() {
		HerolistStore.removeChangeListener(this._updateHerolistStore );
	}

	render() {

		const { filter, list, sortOrder } = this.state;

		return (
			<section id="herolist">
				<div className="page">
					<div className="options">
						<TextField hint="Suchen" value={filter} onChange={this.filter} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={[
								{
									name: 'Alphabetisch',
									value: 'name'
								},
								{
									name: 'AP',
									value: 'ap'
								}
							]}
							/>
						<BorderButton label="Erstellen" onClick={this.showHeroCreation} />
					</div>
					<Scroll className="list">
						<ul>
							{
								list.map(hero => <HerolistItem key={hero.id} {...hero} />)
							}
						</ul>
					</Scroll>
				</div>
			</section>
		);
	}
}

export default Herolist;
