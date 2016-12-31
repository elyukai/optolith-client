import { CombatTechniqueInstance } from '../../utils/data/CombatTechnique';
import { filterAndSort } from '../../utils/ListUtils';
import { get } from '../../stores/ListStore';
import CombatTechniquesActions from '../../actions/CombatTechniquesActions';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TextField from '../../components/TextField';

interface State {
	combattechniques: CombatTechniqueInstance[];
	filterText: string;
	sortOrder: string;
	phase: number;
}

export default class CombatTechniques extends Component<any, State> {
	
	state = { 
		combattechniques: CombatTechniquesStore.getAll(),
		filterText: CombatTechniquesStore.getFilter(),
		sortOrder: CombatTechniquesStore.getSortOrder(),
		phase: PhaseStore.get()
	};
	
	_updateCombatTechniquesStore = () => this.setState({ 
		combattechniques: CombatTechniquesStore.getAll(),
		filterText: CombatTechniquesStore.getFilter(),
		sortOrder: CombatTechniquesStore.getSortOrder()
	} as State);

	filter = event => this.setState({ filterText: event.target.value } as State);
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

		const GROUPS = ['Nahkampf', 'Fernkampf'];

		const { combattechniques, filterText, phase, sortOrder } = this.state;

		const list = filterAndSort(combattechniques, filterText, sortOrder);

		return (
			<div className="page" id="combattechniques">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={sortOrder} onClick={this.sort} array={[
						{ name: 'Alphabetisch', value: 'name' },
						{ name: 'Nach Gruppe', value: 'group' },
						{ name: 'Nach Steigerungsfaktor', value: 'ic' }
					]} />
				</div>
				<Scroll>
					<table className="list">
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Kampftechnik</td>
								<td className="value">Ktw.</td>
								<td className="primary">Leiteig.</td>
								<td className="at">AT/FK</td>
								<td className="pa">PA</td>
								<td className="ic">Sf.</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{
								list.map(obj => {
									const primary = obj.primary.map(attr => get(attr).short).join('/');
									return (
										<SkillListItem
											key={obj.id}
											group={GROUPS[obj.gr - 1]}
											name={obj.name}
											sr={obj.value}
											ic={obj.ic}
											checkDisabled
											addPoint={this.addPoint.bind(null, obj.id)}
											addDisabled={!obj.isIncreasable}
											removePoint={phase < 3 ? this.removePoint.bind(null, obj.id) : undefined}
											removeDisabled={!obj.isDecreasable}
											>
											<td className="leit">{primary}</td>
											<td className="at">{obj.at}</td>
											<td className="pa">{obj.pa}</td>
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
