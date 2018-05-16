import * as React from 'react';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { ListPlaceholder } from '../../components/ListPlaceholder';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { AttributeInstance, InputTextEvent, SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { CombatTechniqueWithRequirements } from '../../types/view.d';
import { translate } from '../../utils/I18n';
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
	filterText: string;
}

export interface CombatTechniquesDispatchProps {
	setSortOrder(sortOrder: string): void;
	addPoint(id: string): void;
	removePoint(id: string): void;
	setFilterText(filterText: string): void;
}

export type CombatTechniquesProps = CombatTechniquesStateProps & CombatTechniquesDispatchProps & CombatTechniquesOwnProps;

export interface CombatTechniquesState {
	infoId?: string;
}

export class CombatTechniques extends React.Component<CombatTechniquesProps, CombatTechniquesState> {
	state: CombatTechniquesState = {};

	filter = (event: InputTextEvent) => this.props.setFilterText(event.target.value);
	showInfo = (id: string) => this.setState({ infoId: id } as CombatTechniquesState);

	render() {
		const { addPoint, attributes, derivedCharacteristics, list, locale, isRemovingEnabled, removePoint, setSortOrder, sortOrder, filterText } = this.props;
		const { infoId } = this.state;

		return (
			<Page id="combattechniques">
				<Options>
					<TextField hint={translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={setSortOrder}
						array={[
							{ name: translate(locale, 'options.sortorder.alphabetically'), value: 'name' },
							{ name: translate(locale, 'options.sortorder.group'), value: 'group' },
							{ name: translate(locale, 'options.sortorder.improvementcost'), value: 'ic' }
						]}
						/>
				</Options>
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{translate(locale, 'group')}
							</ListHeaderTag>
						<ListHeaderTag className="value" hint={translate(locale, 'sr.long')}>
							{translate(locale, 'sr.short')}
						</ListHeaderTag>
						<ListHeaderTag className="ic" hint={translate(locale, 'ic.long')}>
							{translate(locale, 'ic.short')}
						</ListHeaderTag>
						<ListHeaderTag className="primary" hint={translate(locale, 'primaryattribute.long')}>
							{translate(locale, 'primaryattribute.short')}
						</ListHeaderTag>
						<ListHeaderTag className="at" hint={translate(locale, 'at.long')}>
							{translate(locale, 'at.short')}
						</ListHeaderTag>
						<ListHeaderTag className="pa" hint={translate(locale, 'pa.long')}>
							{translate(locale, 'pa.short')}
						</ListHeaderTag>
						{isRemovingEnabled && <ListHeaderTag className="btn-placeholder" />}
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<Scroll>
						<List>
							{
								list.length === 0 ? <ListPlaceholder locale={locale} type="combatTechniques" noResults /> : list.map(obj => {
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
											groupIndex={obj.gr}
											groupList={translate(locale, 'combattechniques.view.groups')}
											/>
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
