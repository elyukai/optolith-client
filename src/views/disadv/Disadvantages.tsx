import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import { AdventurePointsState } from '../../reducers/adventurePoints';
import { ActivateArgs, ActiveViewObject, DeactivateArgs, DeactiveViewObject, InputTextEvent, Instance, ToListById } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { ActiveList } from './ActiveList';
import { DeactiveList } from './DeactiveList';

export interface DisadvantagesOwnProps {
	locale: UIMessages;
}

export interface DisadvantagesStateProps {
	activeList: ActiveViewObject[];
	ap: AdventurePointsState;
	deactiveList: DeactiveViewObject[];
	enableActiveItemHints: boolean;
	magicalMax: number;
	rating: ToListById<string>;
	showRating: boolean;
	get(id: string): Instance | undefined;
}

export interface DisadvantagesDispatchProps {
	switchActiveItemHints(): void;
	switchRatingVisibility(): void;
	addToList(args: ActivateArgs): void;
	removeFromList(args: DeactivateArgs): void;
	setTier(id: string, index: number, tier: number, cost: number): void;
}

export type DisadvantagesProps = DisadvantagesStateProps & DisadvantagesDispatchProps & DisadvantagesOwnProps;

export interface DisadvantagesState {
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
}

export class Disadvantages extends React.Component<DisadvantagesProps, DisadvantagesState> {
	state = {
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as DisadvantagesState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as DisadvantagesState);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as DisadvantagesState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as DisadvantagesState);

	render() {
		const { activeList, addToList, ap, deactiveList, enableActiveItemHints, get, magicalMax, locale, rating, removeFromList, setTier, showRating, switchActiveItemHints, switchRatingVisibility } = this.props;
		const { filterText, filterTextSlidein } = this.state;

		return (
			<Page id="advantages">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<Checkbox checked={showRating} onClick={switchRatingVisibility}>{_translate(locale, 'disadvantages.options.common')}</Checkbox>
						<Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>{_translate(locale, 'options.showactivated')}</Checkbox>
						<p>
							{_translate(locale, 'titlebar.adventurepoints.disadvantages', ap.disadv[0], 80)}<br/>
							{ap.disadv[1] > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesmagic', ap.disadv[1], magicalMax)}
							{ap.disadv[1] > 0 && ap.disadv[2] > 0 && <br/>}
							{ap.disadv[2] > 0 && _translate(locale, 'titlebar.adventurepoints.disadvantagesblessed', ap.disadv[2], 50)}
						</p>
						{showRating && <RecommendedReference/>}
					</Options>
					<DeactiveList
						activeList={enableActiveItemHints ? activeList : undefined}
						filterText={filterTextSlidein}
						list={deactiveList}
						locale={locale}
						rating={rating}
						showRating={showRating}
						get={get}
						addToList={addToList}
						/>
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<Checkbox checked={showRating} onClick={switchRatingVisibility}>{_translate(locale, 'disadvantages.options.common')}</Checkbox>
					<BorderButton label={_translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
					{showRating && <RecommendedReference/>}
				</Options>
				<ActiveList
					filterText={filterText}
					list={activeList}
					rating={rating}
					showRating={showRating}
					removeFromList={removeFromList}
					setTier={setTier}
					/>
			</Page>
		);
	}
}
