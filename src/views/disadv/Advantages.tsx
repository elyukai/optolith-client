import * as Categories from '../../constants/Categories';
import * as React from 'react';
import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import DisAdvActions from '../../_actions/DisAdvActions';
import DisAdvList from './DisAdvList';
import DisAdvStore from '../../stores/DisAdvStore';
import ProfessionStore from '../../stores/ProfessionStore';
import RaceStore from '../../stores/RaceStore';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';

interface State {
	filterText: string;
	showRating: boolean;
	advActive: {
		id: string;
		active: ActiveObject;
		index: number;
	}[];
	advDeactive: (Advantage | Disadvantage)[];
	showAddSlidein: boolean;
	race: Race;
	culture: Culture;
	profession: Profession;
}

export default class Advantages extends React.Component<any, State> {

	state = {
		filterText: '',
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(Categories.ADVANTAGES),
		advDeactive: DisAdvStore.getDeactiveForView(Categories.ADVANTAGES),
		showAddSlidein: false,
		race: RaceStore.getCurrent(),
		culture: CultureStore.getCurrent(),
		profession: ProfessionStore.getCurrent()
	};

	_updateDisAdvStore = () => this.setState({
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(Categories.ADVANTAGES),
		advDeactive: DisAdvStore.getDeactiveForView(Categories.ADVANTAGES)
	} as State);

	filter = (event: Event) => DisAdvActions.filter(event.target.value);
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

		const rating: { [id: string]: 'IMP' | 'TYP' | 'UNTYP'} = {};
		let { culture, profession, race, showRating } = this.state;

		profession = profession || {};

		const IMP = 'IMP';
		const TYP = 'TYP';
		const UNTYP = 'UNTYP';

		if (showRating) {
			race.typ_adv.forEach(e => { rating[e] = TYP; });
			race.untyp_adv.forEach(e => { rating[e] = UNTYP; });
			culture.typAdv.forEach(e => { rating[e] = TYP; });
			culture.untypAdv.forEach(e => { rating[e] = UNTYP; });
			profession.typ_adv.forEach(e => { rating[e] = TYP; });
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
