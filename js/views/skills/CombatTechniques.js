import BorderButton from '../../components/BorderButton';
import CombatTechniquesActions from '../../actions/CombatTechniquesActions';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TextField from '../../components/TextField';

class CombatTechniques extends Component {
	
	state = { 
		combattech: CombatTechniquesStore.getAllForView(),
		filter: CombatTechniquesStore.getFilter(),
		sortOrder: CombatTechniquesStore.getSortOrder(),
		phase: PhaseStore.get()
	};
	
	_updateCombatTechniquesStore = () => this.setState({ 
		combattech: CombatTechniquesStore.getAllForView(),
		filter: CombatTechniquesStore.getFilter(),
		sortOrder: CombatTechniquesStore.getSortOrder()
	});

	filter = event => this.setState({ filterBy: event.target.value });
	sort = option => CombatTechniquesActions.sort(option);
	addPoint = id => CombatTechniquesActions.addPoint(id);
	removePoint = id => CombatTechniquesActions.removePoint(id);
	
	componentDidMount() {
		CombatTechniquesStore.addChangeListener(this._updateCombatTechniquesStore );
	}
	
	componentWillUnmount() {
		CombatTechniquesStore.removeChangeListener(this._updateCombatTechniquesStore );
	}

	render() {

		const ATTR = {
			ATTR_5: 'FF',
			ATTR_6: 'GE',
			ATTR_7: 'KO',
			ATTR_8: 'KK'
		};
		const GR = ['Nahkampf', 'Fernkampf'];

		return (
			<div className="page" id="combattechniques">
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
				</div>
				<Scroll className="list">
					<table>
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Kampftechnik</td>
								<td className="fw">Ktw.</td>
								<td className="leit">Leiteig.</td>
								<td className="at">AT/FK</td>
								<td className="pa">PA</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								this.state.combattech.map(ct => {
									const primary = ct.primary.map(attr => ATTR[attr]).join('/');
									return (
										<SkillListItem
											key={ct.id}
											group={GR[ct.gr - 1]}
											name={ct.name}
											sr={ct.value}
											ic={ct.ic}
											checkDisabled
											addPoint={this.addPoint.bind(null, ct.id)}
											addDisabled={!ct.isIncreasable}
											removePoint={this.state.phase < 3 ? this.removePoint.bind(null, ct.id) : undefined}
											removeDisabled={!ct.isDecreasable}
											>
											<td className="leit">{primary}</td>
											<td className="at">{ct.at}</td>
											<td className="pa">{ct.pa}</td>
										</SkillListItem>
									);
								})
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}

export default CombatTechniques;
