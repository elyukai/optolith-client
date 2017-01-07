import APStore from '../../stores/APStore';
import BorderButton from '../../components/BorderButton';
import createOverlay from '../../utils/createOverlay';
import Dropdown from '../../components/Dropdown';
import ELStore from '../../stores/ELStore';
import HeroCreation from './HeroCreation';
import HerolistActions from '../../_actions/HerolistActions';
import HerolistItem from './HerolistItem';
import HerolistStore from '../../stores/HerolistStore';
import ProfileStore from '../../stores/ProfileStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

interface State {
	list: Object[];
	filter: string;
	view: string;
	sortOrder: string;
}

export default class Herolist extends Component<any, State> {

	state = {
		list: HerolistStore.getAllForView(),
		filter: HerolistStore.getFilter(),
		view: HerolistStore.getView(),
		sortOrder: HerolistStore.getSortOrder()
	};

	_updateHerolistStore = () => this.setState({
		list: HerolistStore.getAllForView(),
		filter: HerolistStore.getFilter(),
		view: HerolistStore.getView(),
		sortOrder: HerolistStore.getSortOrder()
	});

	filter = event => HerolistActions.filter(event.target.value);
	sort = option => HerolistActions.sort(option);
	changeView = option => HerolistActions.changeView(option);
	showHeroCreation = () => createOverlay(<HeroCreation />);
	refresh = () => HerolistActions.refresh();

	componentDidMount() {
		HerolistStore.addChangeListener(this._updateHerolistStore );
	}

	componentWillUnmount() {
		HerolistStore.removeChangeListener(this._updateHerolistStore );
	}

	render() {

		const { filter, list, sortOrder, view } = this.state;

		return (
			<section id="herolist">
				<div className="page">
					<div className="options">
						<TextField
							hint="Suchen"
							value={filter}
							onChange={this.filter}
							fullWidth
							/>
						<Dropdown
							value={view}
							onChange={this.changeView}
							options={[['Alle Helden', 'all'], ['Eigene Helden', 'own'], ['Geteilte Helden', 'shared']]}
							fullWidth
							/>
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
						<BorderButton label="Aktualisieren" onClick={this.refresh} disabled />
						<BorderButton label="Erstellen" onClick={this.showHeroCreation} primary />
					</div>
					<Scroll className="list">
						<ul>
							{
								ProfileStore.getID() === null && ELStore.getStartID() !== 'EL_0' ? (
									<HerolistItem
										id={null}
										avatar={ProfileStore.getAvatar()}
										name="Ungespeicherter Held"
										ap={{ total: APStore.getTotal() }}
										/>
								) : null
							}
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
