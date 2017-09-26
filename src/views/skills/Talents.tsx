import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { InputTextEvent, Instance, SecondaryAttribute, TalentInstance, ToListById } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/TalentUtils';
import { SkillListItem } from './SkillListItem';

export interface TalentsOwnProps {
	locale: UIMessages;
}

export interface TalentsStateProps {
	currentHero: CurrentHeroInstanceState;
	derivedCharacteristics: Map<DCIds, SecondaryAttribute>;
	list: TalentInstance[];
	phase: number;
	sortOrder: string;
	ratingVisibility: boolean;
	talentRating: ToListById<string>;
	get(id: string): Instance | undefined;
}

export interface TalentsDispatchProps {
	setSortOrder(sortOrder: string): void;
	switchRatingVisibility(): void;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export type TalentsProps = TalentsStateProps & TalentsDispatchProps & TalentsOwnProps;

export interface TalentsState {
	filterText: string;
	infoId?: string;
}

export class Talents extends React.Component<TalentsProps, TalentsState> {
	state: TalentsState = {
		filterText: ''
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as TalentsState);
	showInfo = (id: string) => this.setState({ infoId: id } as TalentsState);

	render() {
		const { addPoint, currentHero, get, derivedCharacteristics, locale, phase, ratingVisibility, removePoint, setSortOrder, sortOrder, switchRatingVisibility, talentRating, list: rawlist } = this.props;
		const { filterText, infoId } = this.state;

		const list = filterAndSortObjects(rawlist, locale.id, filterText, sortOrder === 'ic' ? ['ic', 'name'] : sortOrder === 'group' ? ['gr', 'name'] : ['name']);

		return (
			<Page id="talents">
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
					<Checkbox checked={ratingVisibility} onClick={switchRatingVisibility}>{_translate(locale, 'skills.options.commoninculture')}</Checkbox>
					{ratingVisibility && <RecommendedReference locale={locale} />}
				</Options>
				<Scroll>
					<List>
						{
							list.map((obj, index, array) => {
								const prevObj = array[index - 1];
								return (
									<SkillListItem
										key={obj.id}
										id={obj.id}
										typ={ratingVisibility && isTyp(talentRating, obj)}
										untyp={ratingVisibility && isUntyp(talentRating, obj)}
										name={obj.name}
										sr={obj.value}
										check={obj.check}
										ic={obj.ic}
										addPoint={addPoint.bind(null, obj.id)}
										addDisabled={!isIncreasable(currentHero, obj)}
										removePoint={phase < 3 ? removePoint.bind(null, obj.id) : undefined}
										removeDisabled={!isDecreasable(currentHero, obj)}
										insertTopMargin={sortOrder === 'group' && prevObj && prevObj.gr !== obj.gr}
										selectForInfo={this.showInfo}
										get={get}
										derivedCharacteristics={derivedCharacteristics}
										>
										<ListItemGroup list={_translate(locale, 'skills.view.groups')} index={obj.gr} />
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
				<WikiInfoContainer {...this.props} currentId={infoId}/>
			</Page>
		);
	}
}
