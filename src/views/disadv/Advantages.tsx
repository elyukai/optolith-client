import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { AdventurePointsState } from '../../reducers/adventurePoints';
import { ActivateArgs, ActiveViewObject, AdvantageInstance, DeactivateArgs, DeactiveViewObject, InputTextEvent, Instance, ToListById } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { ActiveList } from './ActiveList';
import { DeactiveList } from './DeactiveList';

export interface AdvantagesOwnProps {
	locale: UIMessages;
}

export interface AdvantagesStateProps {
	activeList: ActiveViewObject[];
	ap: AdventurePointsState;
	deactiveList: DeactiveViewObject[];
	enableActiveItemHints: boolean;
	list: AdvantageInstance[];
	magicalMax: number;
	rating: ToListById<string>;
	showRating: boolean;
	isRemovingEnabled: boolean;
	get(id: string): Instance | undefined;
}

export interface AdvantagesDispatchProps {
	switchActiveItemHints(): void;
	switchRatingVisibility(): void;
	addToList(args: ActivateArgs): void;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number): void;
}

export type AdvantagesProps = AdvantagesStateProps & AdvantagesDispatchProps & AdvantagesOwnProps;

export interface AdvantagesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
	currentId?: string;
	currentSlideinId?: string;
}

export class Advantages extends React.Component<AdvantagesProps, AdvantagesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as AdvantagesState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as AdvantagesState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as AdvantagesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as AdvantagesState);
	showInfo = (id: string) => this.setState({ currentId: id } as AdvantagesState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as AdvantagesState);

	render() {
		const { activeList, addToList, ap, deactiveList, enableActiveItemHints, get, magicalMax, locale, rating, showRating, switchActiveItemHints, switchRatingVisibility } = this.props;
		const { filterText, filterTextSlidein } = this.state;

		return (
			<Page id="advantages">
				<Slidein isOpened={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<Checkbox checked={showRating} onClick={switchRatingVisibility}>{_translate(locale, 'advantages.options.common')}</Checkbox>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
						<p>
							{_translate(locale, 'titlebar.adventurepoints.advantages', ap.adv[0], 80)}<br/>
							{ap.adv[1] > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesmagic', ap.adv[1], magicalMax)}
							{ap.adv[1] > 0 && ap.adv[2] > 0 && <br/>}
							{ap.adv[2] > 0 && _translate(locale, 'titlebar.adventurepoints.advantagesblessed', ap.adv[2], 50)}
						</p>
						{showRating && <RecommendedReference locale={locale} />}
					</Options>
					<MainContent>
						<ListHeader>
							<ListHeaderTag className="name">
								{_translate(locale, 'name')}
							</ListHeaderTag>
							<ListHeaderTag className="cost" hint={_translate(locale, 'aptext')}>
								{_translate(locale, 'apshort')}
							</ListHeaderTag>
							<ListHeaderTag className="btn-placeholder" />
							<ListHeaderTag className="btn-placeholder" />
						</ListHeader>
						<DeactiveList
							activeList={enableActiveItemHints ? activeList : undefined}
							filterText={filterTextSlidein}
							list={deactiveList}
							locale={locale}
							rating={rating}
							showRating={showRating}
							get={get}
							addToList={addToList}
							selectForInfo={this.showSlideinInfo}
							/>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Checkbox checked={showRating} onClick={switchRatingVisibility}>{_translate(locale, 'advantages.options.common')}</Checkbox>
					<BorderButton label={_translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
					{showRating && <RecommendedReference locale={locale} />}
				</Options>
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="cost" hint={_translate(locale, 'aptext')}>
							{_translate(locale, 'apshort')}
						</ListHeaderTag>
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<ActiveList
						{...this.props}
						filterText={filterText}
						list={activeList}
						selectForInfo={this.showInfo}
						/>
				</MainContent>
				<WikiInfoContainer {...this.props} {...this.state} />
			</Page>
		);
	}
}
