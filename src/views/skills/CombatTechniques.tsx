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
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { AttributeInstance, InputTextEvent, SecondaryAttribute } from '../../types/data.d';
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
	attributes: Map<string, AttributeInstance>;
	derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
	list: CombatTechniqueWithRequirements[];
	isRemovingEnabled: boolean;
	sortOrder: string;
}

export interface CombatTechniquesDispatchProps {
	setSortOrder(sortOrder: string): void;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export type CombatTechniquesProps = CombatTechniquesStateProps & CombatTechniquesDispatchProps & CombatTechniquesOwnProps;

export interface CombatTechniquesState {
	filterText: string;
	infoId?: string;
}

export class CombatTechniques extends React.Component<CombatTechniquesProps, CombatTechniquesState> {
	state = {
		filterText: '',
		infoId: undefined
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as CombatTechniquesState);
	showInfo = (id: string) => this.setState({ infoId: id } as CombatTechniquesState);

	render() {
		const { addPoint, attributes, derivedCharacteristics, list: rawlist, locale, isRemovingEnabled, removePoint, setSortOrder, sortOrder } = this.props;
		const { filterText, infoId } = this.state;

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
						{isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<Scroll>
						<List>
							{
								list.map(obj => {
									const primary = obj.primary.map(attr => attributes.get(attr)!.short).join('/');
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
											removePoint={isRemovingEnabled ? removePoint.bind(null, obj.id) : undefined}
											removeDisabled={obj.value <= obj.min}
											addValues={[
												{ className: primaryClassName, value: primary },
												{ className: 'at', value: obj.at },
												{ className: 'atpa' },
												{ className: 'pa', value: obj.pa || '--' },
											]}
											attributes={attributes}
											derivedCharacteristics={derivedCharacteristics}
											selectForInfo={this.showInfo}
											>
											<ListItemGroup list={_translate(locale, 'combattechniques.view.groups')} index={obj.gr} />
										</SkillListItem>
									);
								})
							}
						</List>
					</Scroll>
				</MainContent>
				<WikiInfoContainer {...this.props} currentId={infoId}/>
			</Page>
		);
	}
}
