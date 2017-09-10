import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Checkbox } from '../../components/Checkbox';
import { List } from '../../components/List';
import { ListItemGroup } from '../../components/ListItemGroup';
import { Markdown } from '../../components/Markdown';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { AttributeInstance, InputTextEvent, Instance, SecondaryAttribute, TalentInstance, ToListById } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { DCIds } from '../../utils/derivedCharacteristics';
import { filterAndSort } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { isDecreasable, isIncreasable, isTyp, isUntyp } from '../../utils/TalentUtils';
import { SkillListItem } from './SkillListItem';

export interface TalentsOwnProps {
	locale: UIMessages;
}

export interface TalentsStateProps {
	currentHero: CurrentHeroInstanceState;
	list: TalentInstance[];
	phase: number;
	sortOrder: string;
	ratingVisibility: boolean;
	talentRating: ToListById<string>;
	get(id: string): Instance | undefined;
	getDerivedCharacteristic(id: DCIds): SecondaryAttribute;
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
		const { addPoint, currentHero, get, getDerivedCharacteristic, locale, phase, ratingVisibility, removePoint, setSortOrder, sortOrder, switchRatingVisibility, talentRating, list: rawlist } = this.props;
		const { filterText, infoId } = this.state;

		const info = infoId && get(infoId) as TalentInstance;

		const list = filterAndSort(rawlist, filterText, sortOrder);

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
					{ratingVisibility && <RecommendedReference/>}
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
										getDerivedCharacteristic={getDerivedCharacteristic}
										>
										<ListItemGroup list={_translate(locale, 'skills.view.groups')} index={obj.gr} />
									</SkillListItem>
								);
							})
						}
					</List>
				</Scroll>
				<Aside>
					{info ? (() => {
						return (
							<Scroll>
								<div className="info skill-info">
									<div className="skill-header info-header">
										<p className="title">{info.name}</p>
										<p className="sr">{info.value}</p>
									</div>
									<p>
										<span>{_translate(locale, 'info.check')}</span>
										<span>{info.check.map(e => (get(e) as AttributeInstance).short).join('/')}</span>
									</p>
									<p>
										<span>{_translate(locale, 'info.applications')}</span>
										<span>{info.applications && info.applications.map(e => e.name).sort().join(', ')}{info
											.applications && info.applicationsInput && ', '}{info.applicationsInput}</span>
									</p>
									<p>
										<span>{_translate(locale, 'info.encumbrance')}</span>
										<span>{info.encumbrance === 'true' ? _translate(locale, 'charactersheet.gamestats.skills.enc.yes') : info.encumbrance === 'false' ? _translate(locale, 'charactersheet.gamestats.skills.enc.no') : _translate(locale, 'charactersheet.gamestats.skills.enc.maybe')}</span>
									</p>
									{info.tools && <Markdown source={`**${_translate(locale, 'info.tools')}:** ${info.tools}`} />}
									{info.quality && <Markdown source={`**${_translate(locale, 'info.quality')}:** ${info.quality}`} />}
									{info.failed && <Markdown source={`**${_translate(locale, 'info.failedcheck')}:** ${info.failed}`} />}
									{info.critical && <Markdown source={`**${_translate(locale, 'info.criticalsuccess')}:** ${info.critical}`} />}
									{info.botch && <Markdown source={`**${_translate(locale, 'info.botch')}:** ${info.botch}`} />}
									<p>
										<span>{_translate(locale, 'info.improvementcost')}</span>
										<span>{getICName(info.ic)}</span>
									</p>
								</div>
							</Scroll>
						);
					})() : (
						<div className="info-placeholder">
							&#xE88F;
						</div>
					)}
				</Aside>
			</Page>
		);
	}
}
