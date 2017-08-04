import * as React from 'react';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { AttributeInstance, InputTextEvent, Instance, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { CombatTechniqueWithRequirements } from '../../types/view.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { SkillListItem } from './SkillListItem';

export interface CombatTechniquesOwnProps {
	locale: UIMessages;
}

export interface CombatTechniquesStateProps {
	list: CombatTechniqueWithRequirements[];
	phase: number;
	sortOrder: string;
	get(id: string): Instance | undefined;
	getDerivedCharacteristic(id: DCIds): SecondaryAttribute;
}

export interface CombatTechniquesDispatchProps {
	setSortOrder(sortOrder: string): void;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export type CombatTechniquesProps = CombatTechniquesStateProps & CombatTechniquesDispatchProps & CombatTechniquesOwnProps;

export interface CombatTechniquesState {
	filterText: string;
}

export class CombatTechniques extends React.Component<CombatTechniquesProps, CombatTechniquesState> {
	state = {
		filterText: ''
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as CombatTechniquesState);

	render() {
		const { addPoint, get, getDerivedCharacteristic, list: rawlist, locale, phase, removePoint, setSortOrder, sortOrder } = this.props;
		const { filterText } = this.state;

		const list = filterAndSort(rawlist, filterText, sortOrder);

		return (
			<Page id="combattechniques">
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={setSortOrder}
						array={[
							{ name: _translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
							{ name: _translate(locale, 'options.sortorder.group'), value: 'group' },
							{ name: _translate(locale, 'options.sortorder.improvementcost'), value: 'ic' }
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
										addPoint={addPoint.bind(null, obj.id)}
										addDisabled={obj.value >= obj.max}
										removePoint={phase < 3 ? removePoint.bind(null, obj.id) : undefined}
										removeDisabled={obj.value <= obj.min}
										addValues={[
											{ className: primaryClassName, value: primary },
											{ className: 'at', value: obj.at },
											{ className: 'atpa' },
											{ className: 'pa', value: obj.pa || '-' },
										]}
										get={get}
										getDerivedCharacteristic={getDerivedCharacteristic}
										>
										<ListItemGroup list={_translate(locale, 'combattechniques.view.groups')} index={obj.gr} />
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
