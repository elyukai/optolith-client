import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import { Deactive } from './DisAdvAddListItem';
import { Active } from './DisAdvRemoveListItem';
import { RaceInstance } from '../../utils/data/Race';
import { CultureInstance } from '../../utils/data/Culture';
import { ProfessionInstance } from '../../utils/data/Profession';
import DisAdvActions from '../../actions/DisAdvActions';
import DisAdvList from './DisAdvList';
import DisAdvStore from '../../stores/DisAdvStore';
import ProfessionStore from '../../stores/ProfessionStore';
import RaceStore from '../../stores/RaceStore';
import * as React from 'react';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';

interface State {
	filterText: string;
	showRating: boolean;
	advActive: Active[];
	advDeactive: Deactive[];
	showAddSlidein: boolean;
	race: RaceInstance;
	culture: CultureInstance;
	profession: ProfessionInstance;
}

export default class Advantages extends React.Component<any, State> {
	
	state = { 
		filterText: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(true),
		advDeactive: DisAdvStore.getDeactiveForView(true),
		showAddSlidein: false,
		race: RaceStore.getCurrent(),
		culture: CultureStore.getCurrent(),
		profession: ProfessionStore.getCurrent()
	};
	
	_updateDisAdvStore = () => this.setState({
		filterText: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(true),
		advDeactive: DisAdvStore.getDeactiveForView(true)
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
		let { culture, profession, race, showRating } = this.state;

		profession = profession || {};

		const IMP = 'imp';
		const TYP = 'typ';
		const UNTYP = 'untyp';

		if (showRating) {
			race.typ_adv.forEach(e => { rating[e] = TYP; });
			race.untyp_adv.forEach(e => { rating[e] = UNTYP; });
			culture.typ_adv.forEach(e => { rating[e] = TYP; });
			culture.untyp_adv.forEach(e => { rating[e] = UNTYP; });
			if (profession.hasOwnProperty('typ_adv'))
				profession.typ_adv.forEach(e => { rating[e] = TYP; });
			if (profession.hasOwnProperty('untyp_adv'))
				profession.untyp_adv.forEach(e => { rating[e] = UNTYP; });
			race.imp_adv.forEach(e => { rating[e[0]] = IMP; });
		}

		return (
			<div className="page" id="advantages">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
						<Checkbox checked={showRating} onClick={this.changeRating}>Wertung durch Spezies, Kultur und Profession anzeigen</Checkbox>
					</div>
					<DisAdvList list={this.state.advDeactive} type="ADV" rating={rating} showRating={this.state.showRating} />
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<DisAdvList list={this.state.advActive} type="ADV" rating={rating} showRating={showRating} active />
			</div>
		);
	}
}
