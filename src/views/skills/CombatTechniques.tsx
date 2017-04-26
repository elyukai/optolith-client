import * as React from 'react';
import * as CombatTechniquesActions from '../../actions/CombatTechniquesActions';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CombatTechniquesStore } from '../../stores/CombatTechniquesStore';
import { get } from '../../stores/ListStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { AttributeInstance, CombatTechniqueInstance, InputTextEvent } from '../../types/data.d';
import { getAt, getPa, isDecreasable, isIncreasable } from '../../utils/CombatTechniqueUtils';
import { filterAndSort } from '../../utils/ListUtils';
import { SkillListItem } from './SkillListItem';

interface State {
	combattechniques: CombatTechniqueInstance[];
	filterText: string;
	phase: number;
	sortOrder: string;
}

export class CombatTechniques extends React.Component<undefined, State> {
	state = {
		combattechniques: CombatTechniquesStore.getAll(),
		filterText: '',
		phase: PhaseStore.get(),
		sortOrder: CombatTechniquesStore.getSortOrder(),
	};

	_updateCombatTechniquesStore = () => {
		this.setState({
			combattechniques: CombatTechniquesStore.getAll(),
			sortOrder: CombatTechniquesStore.getSortOrder(),
		} as State);
	}

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => CombatTechniquesActions.setSortOrder(option);
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
			<Page id="combattechniques">
				<Options>
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Nach Gruppe', value: 'group' },
							{ name: 'Nach Steigerungsfaktor', value: 'ic' },
						]}
						/>
				</Options>
				<Scroll>
					<List>
						{
							list.map(obj => {
								const primary = obj.primary.map(attr => (get(attr) as AttributeInstance).short).join('/');
								const primaryClassName = `primary ${obj.primary.length > 1 ? 'ATTR_6_8' : obj.primary[0]}`;
								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										name={obj.name}
										sr={obj.value}
										ic={obj.ic}
										checkDisabled
										addPoint={this.addPoint.bind(null, obj.id)}
										addDisabled={!isIncreasable(obj)}
										removePoint={phase < 3 ? this.removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(obj)}
										addValues={[
											{ className: primaryClassName, value: primary },
											{ className: 'at', value: getAt(obj) },
											{ className: 'atpa' },
											{ className: 'pa', value: getPa(obj) },
										]}
										>
										<ListItemGroup list={GROUPS} index={obj.gr} />
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
			</Page>
		);
	}
}
