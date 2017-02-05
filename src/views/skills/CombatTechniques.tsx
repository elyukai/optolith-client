import { filterAndSort } from '../../utils/ListUtils';
import { get } from '../../stores/ListStore';
import CombatTechniquesActions from '../../_actions/CombatTechniquesActions';
import CombatTechniquesStore from '../../stores/CombatTechniquesStore';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import * as React from 'react';
import Scroll from '../../components/Scroll';
import SkillListItem from './SkillListItem';
import TextField from '../../components/TextField';

interface State {
	combattechniques: CombatTechnique[];
	filterText: string;
	sortOrder: string;
	phase: number;
}

export default class CombatTechniques extends React.Component<undefined, State> {

	state = {
		combattechniques: CombatTechniquesStore.getAll(),
		filterText: '',
		sortOrder: CombatTechniquesStore.getSortOrder(),
		phase: PhaseStore.get()
	};

	_updateCombatTechniquesStore = () => this.setState({
		combattechniques: CombatTechniquesStore.getAll(),
		sortOrder: CombatTechniquesStore.getSortOrder()
	} as State);

	filter = (event: Event) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => CombatTechniquesActions.sort(option);
	addPoint = (id: string) => CombatTechniquesActions.addPoint(id);
	removePoint = (id: string) => CombatTechniquesActions.removePoint(id);

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
					<div className="list-wrapper">
						{
							list.map(obj => {
								const primary = obj.primary.map(attr => (get(attr) as Attribute).short).join('/');
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
										<div className="primary">{primary}</div>
										<div className="at">{obj.at}</div>
										<div className="pa">{obj.pa}</div>
									</SkillListItem>
								);
							})
						}
					</div>
				</Scroll>
			</div>
		);
	}
}
