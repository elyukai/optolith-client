import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import CultureStore from '../../stores/CultureStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TalentsActions from '../../actions/TalentsActions';
import TalentsStore from '../../stores/TalentsStore';
import TextField from '../../components/TextField';

class Talents extends Component {
	
	state = { 
		list: TalentsStore.getAllForView(),
		filter: TalentsStore.getFilter(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.getTalentRating(),
		currentCulture: CultureStore.getCurrent(),
		phase: PhaseStore.get()
	};
	
	_updateTalentsStore = () => this.setState({
		list: TalentsStore.getAllForView(),
		filter: TalentsStore.getFilter(),
		sortOrder: TalentsStore.getSortOrder(),
		talentRating: TalentsStore.getTalentRating()
	});

	filter = event => TalentsActions.filter(event.target.value);
	sort = option => TalentsActions.sort(option);
	changeTalentRating = () => TalentsActions.changeTalentRating();
	addPoint = id => TalentsActions.addPoint(id);
	removePoint = id => TalentsActions.removePoint(id);
	
	componentDidMount() {
		TalentsStore.addChangeListener(this._updateTalentsStore );
	}
	
	componentWillUnmount() {
		TalentsStore.removeChangeListener(this._updateTalentsStore );
	}

	render() {

		const GR = ['Körper', 'Gesellschaft', 'Natur', 'Wissen', 'Handwerk'];

		var culture = this.state.currentCulture || { typ_talents: [], untyp_talents: [] };
		var typ_talents = culture.typ_talents;
		var untyp_talents = culture.untyp_talents;

		return (
			<div className="page" id="talents">
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'Gruppen',
							value: 'groups'
						}
					]} />
					<Checkbox checked={this.state.talentRating} onClick={this.changeTalentRating}>Wertung durch Kultur anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<table>
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Talent</td>
								<td className="fw">Fw</td>
								<td className="check">Probe</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								this.state.list.map(talent => (
									<SkillListItem
										key={talent.id}
										typ={this.state.talentRating && talent.isTyp}
										untyp={this.state.talentRating && talent.isUntyp}
										group={GR[talent.gr - 1]}
										name={talent.name}
										sr={talent.value}
										check={talent.check}
										ic={talent.ic}
										addPoint={this.addPoint.bind(null, talent.id)}
										addDisabled={!talent.isIncreasable}
										removePoint={this.state.phase < 3 ? this.removePoint.bind(null, talent.id) : undefined}
										removeDisabled={!talent.isDecreasable} />
								))
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}

export default Talents;
