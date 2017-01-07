import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import { Deactive } from './DisAdvAddListItem';
import { Active } from './DisAdvRemoveListItem';
import { RaceInstance } from '../../utils/data/Race';
import { CultureInstance } from '../../utils/data/Culture';
import { ProfessionInstance } from '../../utils/data/Profession';
import DisAdvActions from '../../_actions/DisAdvActions';
import DisAdvList from './DisAdvList';
import DisAdvStore from '../../stores/DisAdvStore';
import ProfessionStore from '../../stores/ProfessionStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';

interface State {
	filterText: string;
	showRating: boolean;
	disadvActive: Active[];
	disadvDeactive: Deactive[];
	showAddSlidein: boolean;
	race: RaceInstance;
	culture: CultureInstance;
	profession: ProfessionInstance;
}

export default class Disadvantages extends Component<any, State> {

	state = {
		filterText: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		disadvActive: DisAdvStore.getActiveForView(false),
		disadvDeactive: DisAdvStore.getDeactiveForView(false),
		showAddSlidein: false,
		race: RaceStore.getCurrent(),
		culture: CultureStore.getCurrent(),
		profession: ProfessionStore.getCurrent()
	};

	_updateDisAdvStore = () => this.setState({
		filterText: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		disadvActive: DisAdvStore.getActiveForView(false),
		disadvDeactive: DisAdvStore.getDeactiveForView(false)
	} as State);

	filter = event => DisAdvActions.filter(event.target.value);
	changeRating = () => DisAdvActions.changeRating();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	componentDidMount() {
		DisAdvStore.addChangeListener(this._updateDisAdvStore );
	}

	componentWillUnmount() {
		DisAdvStore.removeChangeListener(this._updateDisAdvStore );
	}

	render() {

		const rating = {};
		let { race, culture, profession } = this.state;

		profession = profession || {};

		const IMP = 'imp';
		const TYP = 'typ';
		const UNTYP = 'untyp';

		race.typ_dadv.forEach(e => { rating[e] = TYP; });
		race.untyp_dadv.forEach(e => { rating[e] = UNTYP; });
		culture.typ_dadv.forEach(e => { rating[e] = TYP; });
		culture.untyp_dadv.forEach(e => { rating[e] = UNTYP; });
		if (profession.hasOwnProperty('typ_dadv'))
			profession.typ_dadv.forEach(e => { rating[e] = TYP; });
		if (profession.hasOwnProperty('untyp_dadv'))
			profession.untyp_dadv.forEach(e => { rating[e] = UNTYP; });
		race.imp_dadv.forEach(e => { rating[e[0]] = IMP; });

		return (
			<div className="page" id="advantages">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
						<Checkbox checked={this.state.showRating} onClick={this.changeRating}>Wertung durch Spezies, Kultur und Profession anzeigen</Checkbox>
					</div>
					<DisAdvList list={this.state.disadvDeactive} type="DISADV" rating={rating} showRating={this.state.showRating} />
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<DisAdvList list={this.state.disadvActive} type="DISADV" rating={rating} showRating={this.state.showRating} active />
			</div>
		);
	}
}
