import * as React from 'react';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListItemGroup } from '../../components/ListItemGroup';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { AttributeInstance, InputTextEvent, Instance, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { CombatTechniqueWithRequirements } from '../../types/view.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { SkillListItem } from './SkillListItem';

export interface CombatTechniquesOwnProps {
	locale: UIMessages;
}

export interface CombatTechniquesStateProps {
	derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
	list: CombatTechniqueWithRequirements[];
	phase: number;
	sortOrder: string;
	get(id: string): Instance | undefined;
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
		const { addPoint, get, derivedCharacteristics, list: rawlist, locale, phase, removePoint, setSortOrder, sortOrder } = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(rawlist, locale.id, filterText, sortOrder === 'ic' ? ['ic', 'name'] : sortOrder === 'group' ? ['gr', 'name'] : ['name']);

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
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{_translate(locale, 'group')}
							</ListHeaderTag>
						<ListHeaderTag className="value" hint={_translate(locale, 'sr.long')}>
							{_translate(locale, 'sr.short')}
						</ListHeaderTag>
						<ListHeaderTag className="ic" hint={_translate(locale, 'ic.long')}>
							{_translate(locale, 'ic.short')}
						</ListHeaderTag>
						<ListHeaderTag className="primary" hint={_translate(locale, 'primaryattribute.long')}>
							{_translate(locale, 'primaryattribute.short')}
						</ListHeaderTag>
						<ListHeaderTag className="at" hint={_translate(locale, 'at.long')}>
							{_translate(locale, 'at.short')}
						</ListHeaderTag>
						<ListHeaderTag className="pa" hint={_translate(locale, 'pa.long')}>
							{_translate(locale, 'pa.short')}
						</ListHeaderTag>
						{phase < 3 && <ListHeaderTag className="btn-placeholder" />}
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
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
											removePoint={removePoint.bind(null, obj.id)}
											removeDisabled={obj.value <= obj.min}
											addValues={[
												{ className: primaryClassName, value: primary },
												{ className: 'at', value: obj.at },
												{ className: 'atpa' },
												{ className: 'pa', value: obj.pa || '--' },
											]}
											get={get}
											derivedCharacteristics={derivedCharacteristics}
											>
											<ListItemGroup list={_translate(locale, 'combattechniques.view.groups')} index={obj.gr} />
										</SkillListItem>
									);
								})
							}
						</List>
					</Scroll>
				</MainContent>
			</Page>
		);
	}
}
