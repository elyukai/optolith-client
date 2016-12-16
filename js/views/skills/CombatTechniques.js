import CombatTechniquesActions from '../../actions/CombatTechniquesActions';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import { get } from '../../stores/ListStore';
import * as ListUtils from '../../utils/ListUtils';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TextField from '../../components/TextField';

const GROUPS = ['Nahkampf', 'Fernkampf'];

export default class CombatTechniques extends Component {
	
	state = { 
		list: CombatTechniquesStore.getAll(),
		filter: CombatTechniquesStore.getFilter(),
		sortOrder: CombatTechniquesStore.getSortOrder(),
		phase: PhaseStore.get()
	};
	
	_updateCombatTechniquesStore = () => this.setState({ 
		list: CombatTechniquesStore.getAll(),
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

		let { filter, list, sortOrder } = this.state;

		list = ListUtils.filter(list, filter);
		list = ListUtils.sort(list, sortOrder);

		return (
			<div className="page" id="combattechniques">
				<div className="options">
					<TextField hint="Suchen" value={filter} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'Gruppen',
							value: 'group'
						}
					]} />
				</div>
				<Scroll>
					<table>
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
											removePoint={this.state.phase < 3 ? this.removePoint.bind(null, obj.id) : undefined}
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
