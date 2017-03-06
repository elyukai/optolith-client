import * as React from 'react';
import * as DisAdvActions from '../../actions/DisAdvActions';
import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ProfessionStore from '../../stores/ProfessionStore';
import RaceStore from '../../stores/RaceStore';
import DisAdvList from './DisAdvList';

interface State {
	filterText: string;
	showRating: boolean;
	advActive: ActiveViewObject[];
	advDeactive: AdvantageInstance[];
	showAddSlidein: boolean;
	race: RaceInstance;
	culture: CultureInstance;
	profession: ProfessionInstance;
}

export default class Advantages extends React.Component<undefined, State> {
	state = {
		advActive: ActivatableStore.getActiveForView(Categories.ADVANTAGES),
		advDeactive: ActivatableStore.getDeactiveForView(Categories.ADVANTAGES),
		culture: CultureStore.getCurrent()!,
		filterText: '',
		profession: ProfessionStore.getCurrent()!,
		race: RaceStore.getCurrent()!,
		showAddSlidein: false,
		showRating: DisAdvStore.getRating(),
	};

	_updateDisAdvStore = () => this.setState({
		advActive: ActivatableStore.getActiveForView(Categories.ADVANTAGES),
		advDeactive: ActivatableStore.getDeactiveForView(Categories.ADVANTAGES),
		showRating: DisAdvStore.getRating(),
	} as State)

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	changeRating = () => DisAdvActions.switchRatingVisibility();
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
		const { culture, profession, race, showRating } = this.state;

		const IMP = 'IMP';
		const TYP = 'TYP';
		const UNTYP = 'UNTYP';

		if (showRating) {
			race.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			race.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			culture.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			culture.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			profession.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			profession.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			race.importantAdvantages.forEach(e => { rating[e[0]] = IMP; });
		}

		return (
			<div className="page" id="advantages">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
						<Checkbox checked={showRating} onClick={this.changeRating}>Wertung durch Spezies, Kultur und Profession anzeigen</Checkbox>
					</div>
					<DisAdvList list={this.state.advDeactive} type="ADV" rating={rating} showRating={this.state.showRating} phase={2} />
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filterText} onChange={this.filter} fullWidth />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<DisAdvList list={this.state.advActive} type="ADV" rating={rating} showRating={showRating} active phase={2} />
			</div>
		);
	}
}
