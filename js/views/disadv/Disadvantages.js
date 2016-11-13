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

class Disadvantages extends Component {
	
	state = { 
		filter: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		disadvActive: DisAdvStore.getActiveForView(false),
		disadvDeactive: DisAdvStore.getDeactiveForView(false),
		showAddSlidein: false,
		race: RaceStore.getCurrent(),
		culture: CultureStore.getCurrent(),
		profession: ProfessionStore.getCurrent()
	};
	
	_updateDisAdvStore = () => this.setState({
		filter: DisAdvStore.getFilter(),
		showRating: DisAdvStore.getRating(),
		disadvActive: DisAdvStore.getActiveForView(false),
		disadvDeactive: DisAdvStore.getDeactiveForView(false)
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
						<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
						<Checkbox checked={this.state.showRating} onClick={this.changeRating}>Wertung durch Spezies, Kultur und Profession anzeigen</Checkbox>
					</div>
					<DisAdvList list={this.state.disadvDeactive} type="DISADV" rating={rating} showRating={this.state.showRating} />
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<DisAdvList list={this.state.disadvActive} type="DISADV" rating={rating} showRating={this.state.showRating} active />
			</div>
		);
	}
}

export default Disadvantages;
