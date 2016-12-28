import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import DisAdvActions from '../../actions/DisAdvActions';
import DisAdvList from './DisAdvList';
import DisAdvStore from '../../stores/DisAdvStore';
import ProfessionStore from '../../stores/ProfessionStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import Slidein from '../../components/Slidein';
import TextField from '../../components/TextField';

export default class Advantages extends Component {
	
	state = { 
		filter: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(true),
		advDeactive: DisAdvStore.getDeactiveForView(true),
		showAddSlidein: false,
		race: RaceStore.getCurrent(),
		culture: CultureStore.getCurrent(),
		profession: ProfessionStore.getCurrent()
	};
	
	_updateDisAdvStore = () => this.setState({
		filter: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		advActive: DisAdvStore.getActiveForView(true),
		advDeactive: DisAdvStore.getDeactiveForView(true)
	});

	filter = event => DisAdvActions.filter(event.target.value);
	changeRating = () => DisAdvActions.changeRating();
	showAddSlidein = () => this.setState({ showAddSlidein: true });
	hideAddSlidein = () => this.setState({ showAddSlidein: false });
	
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
						<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
						<Checkbox checked={showRating} onClick={this.changeRating}>Wertung durch Spezies, Kultur und Profession anzeigen</Checkbox>
					</div>
					<DisAdvList list={this.state.advDeactive} type="ADV" rating={rating} showRating={this.state.showRating} />
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<DisAdvList list={this.state.advActive} type="ADV" rating={rating} showRating={showRating} active />
			</div>
		);
	}
}
