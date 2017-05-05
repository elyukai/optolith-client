import * as React from 'react';
import * as ConfigActions from '../../actions/ConfigActions';
import * as DisAdvActions from '../../actions/DisAdvActions';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RecommendedReference } from '../../components/RecommendedReference';
import { Slidein } from '../../components/Slidein';
import { TextField } from '../../components/TextField';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import { APStore } from '../../stores/APStore';
import { ConfigStore } from '../../stores/ConfigStore';
import { CultureStore } from '../../stores/CultureStore';
import { DisAdvStore } from '../../stores/DisAdvStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { RaceStore } from '../../stores/RaceStore';
import { ActiveViewObject, CultureInstance, DeactiveViewObject, InputTextEvent, ProfessionInstance, RaceInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { ActiveList } from './ActiveList';
import { DeactiveList } from './DeactiveList';

interface State {
	filterText: string;
	filterTextSlidein: string;
	showRating: boolean;
	enableActiveItemHints: boolean;
	activeList: ActiveViewObject[];
	list: DeactiveViewObject[];
	showAddSlidein: boolean;
	race: RaceInstance;
	culture: CultureInstance;
	profession: ProfessionInstance;
	ap: {
		adv: [number, number, number];
		disadv: [number, number, number];
	};
}

export class Advantages extends React.Component<{}, State> {
	state = {
		activeList: ActivatableStore.getActiveForView(Categories.ADVANTAGES),
		list: ActivatableStore.getDeactiveForView(Categories.ADVANTAGES),
		culture: CultureStore.getCurrent()!,
		filterText: '',
		filterTextSlidein: '',
		profession: ProfessionStore.getCurrent()!,
		race: RaceStore.getCurrent()!,
		showAddSlidein: false,
		showRating: DisAdvStore.getRating(),
		enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility(),
		ap: APStore.getForDisAdv()
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	changeRating = () => DisAdvActions.switchRatingVisibility();
	switchActiveItemHints = () => ConfigActions.switchEnableActiveItemHints();
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as State);

	componentDidMount() {
		ConfigStore.addChangeListener(this.updateConfigStore);
		DisAdvStore.addChangeListener(this.updateDisAdvStore);
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.updateConfigStore);
		DisAdvStore.removeChangeListener(this.updateDisAdvStore);
	}

	render() {
		const rating: { [id: string]: 'IMP' | 'TYP' | 'UNTYP'} = {};
		const { ap, activeList, list, culture, enableActiveItemHints, filterText, filterTextSlidein, profession, race, showRating } = this.state;

		const IMP = 'IMP';
		const TYP = 'TYP';
		const UNTYP = 'UNTYP';

		if (showRating) {
			race.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			race.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			culture.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			culture.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			profession.typicalAdvantages.forEach(e => { rating[e] = TYP; });
			profession.untypicalAdvantages.forEach(e => { rating[e] = UNTYP; });
			race.importantAdvantages.forEach(e => { rating[e[0]] = IMP; });
		}

		return (
			<Page id="advantages">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={translate('options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<Checkbox checked={showRating} onClick={this.changeRating}>{translate('advantages.options.common')}</Checkbox>
						<Checkbox checked={enableActiveItemHints} onClick={this.switchActiveItemHints}>{translate('options.showactivated')}</Checkbox>
						<p>
							{ap.adv[0]} / 80 {translate('titlebar.adventurepoints.advantages')}<br/>
							{ap.adv[1] > 0 && `${translate('titlebar.adventurepoints.subprefix')} ${ap.adv[1]} / 50 ${translate('titlebar.adventurepoints.advantagesmagic')}`}
							{ap.adv[2] > 0 && `${translate('titlebar.adventurepoints.subprefix')} ${ap.adv[2]} / 50 ${translate('titlebar.adventurepoints.advantagesblessed')}`}
						</p>
						{showRating && <RecommendedReference/>}
					</Options>
					<DeactiveList
						activeList={enableActiveItemHints ? activeList : undefined}
						filterText={filterTextSlidein}
						list={list}
						rating={rating}
						showRating={showRating}
						/>
				</Slidein>
				<Options>
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<BorderButton label={translate('actions.addtolist')} onClick={this.showAddSlidein} />
					{showRating && <RecommendedReference/>}
				</Options>
				<ActiveList
					filterText={filterText}
					list={activeList}
					rating={rating}
					showRating={showRating}
					/>
			</Page>
		);
	}

	private updateDisAdvStore = () => {
		this.setState({
			ap: APStore.getForDisAdv(),
			activeList: ActivatableStore.getActiveForView(Categories.ADVANTAGES),
			list: ActivatableStore.getDeactiveForView(Categories.ADVANTAGES),
			showRating: DisAdvStore.getRating(),
		} as State);
	}

	private updateConfigStore = () => {
		this.setState({
			enableActiveItemHints: ConfigStore.getActiveItemHintsVisibility()
		} as State);
	}
}
