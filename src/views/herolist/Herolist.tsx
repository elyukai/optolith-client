import { remote } from 'electron';
import * as React from 'react';
import * as HerolistActions from '../../actions/HerolistActions';
import { setSection } from '../../actions/LocationActions';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { APStore } from '../../stores/APStore';
import { CultureStore } from '../../stores/CultureStore';
import { ELStore } from '../../stores/ELStore';
import { HerolistStore } from '../../stores/HerolistStore';
import { HistoryStore } from '../../stores/HistoryStore';
import { ProfessionStore } from '../../stores/ProfessionStore';
import { ProfessionVariantStore } from '../../stores/ProfessionVariantStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { RaceStore } from '../../stores/RaceStore';
import { Hero, InputTextEvent } from '../../types/data.d';
import { confirm } from '../../utils/confirm';
import { createOverlay } from '../../utils/createOverlay';
import { importHero } from '../../utils/FileAPIUtils';
import { translate } from '../../utils/I18n';
import { filterAndSort } from '../../utils/ListUtils';
import { HeroCreation } from './HeroCreation';
import { HerolistItem } from './HerolistItem';

interface State {
	list: Hero[];
	filterText: string;
	view: string;
	sortOrder: string;
	file: File | undefined;
}

export class Herolist extends React.Component<{}, State> {

	state = {
		file: undefined,
		filterText: '',
		list: HerolistStore.getAll(),
		sortOrder: HerolistStore.getSortOrder(),
		view: HerolistStore.getView(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => HerolistActions.setSortOrder(option);
	changeView = (option: string) => HerolistActions.setVisibilityFilter(option);
	showHeroCreation = () => {
		const safeToLoad = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
		if (safeToLoad) {
			createOverlay(<HeroCreation />);
		}
		else {
			confirm(translate('heroes.warnings.unsavedactions.title'), translate('heroes.warnings.unsavedactions.text'), true).then(result => {
				if (result === true) {
					createOverlay(<HeroCreation />);
				}
				else {
					setSection('hero');
				}
			});
		}
	}
	importHero = () => {
		remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
			filters: [{ name: 'JSON', extensions: ['json'] }]
		}, fileNames => {
			const fileName = fileNames[0];
			const splitted = fileName.split('.');
			if (splitted[splitted.length - 1] === 'json') {
				importHero(fileName);
			}
		});
	}

	componentDidMount() {
		HerolistStore.addChangeListener(this.updateHerolistStore);
	}

	componentWillUnmount() {
		HerolistStore.removeChangeListener(this.updateHerolistStore);
	}

	render() {

		const { filterText, list: rawList, sortOrder, view } = this.state;

		const list = filterAndSort(rawList, filterText, sortOrder).filter(e => {
			if (view === 'own') {
				return !e.player;
			}
			else if (view === 'shared') {
				return !!e.player;
			}
			return true;
		}).map(e => {
			if (typeof e.player === 'string') {
				return { ...e, player: HerolistStore.getUser(e.player) };
			}
			return e as Hero & { player: undefined; };
		}).map(hero => (
			<HerolistItem
				key={hero.id}
				id={hero.id}
				name={hero.name}
				ap={{
					total: hero.ap.total
				}}
				avatar={hero.avatar}
				c={hero.c}
				p={hero.p}
				player={hero.player}
				pv={hero.pv}
				r={hero.r}
				sex={hero.sex}
				/>
		));

		return (
			<section id="herolist">
				<Page>
					<Options>
						<TextField
							hint={translate('options.filtertext')}
							value={filterText}
							onChange={this.filter}
							fullWidth
							/>
						<Dropdown
							value={view}
							onChange={this.changeView}
							options={[
								{ id: 'all', name: translate('heroes.options.filter.all') },
								{ id: 'own', name: translate('heroes.options.filter.own') },
								{ id: 'shared', name: translate('heroes.options.filter.shared') },
							]}
							fullWidth
							/>
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={[
								{
									name: translate('options.sortorder.alphabetically'),
									value: 'name',
								},
								{
									name: translate('options.sortorder.ap'),
									value: 'ap',
								},
							]}
							/>
						<BorderButton label={translate('heroes.actions.create')} onClick={this.showHeroCreation} primary />
						<BorderButton label={translate('heroes.actions.import')} onClick={this.importHero} />
					</Options>
					<Scroll>
						<List>
							{
								HerolistStore.getCurrentId() === undefined && ELStore.getStartID() !== 'EL_0' && (
									<HerolistItem
										avatar={ProfileStore.getAvatar()}
										name={translate('heroes.view.unsavedhero.title')}
										ap={{ total: APStore.getTotal() }}
										r={RaceStore.getCurrentID()}
										c={CultureStore.getCurrentID()}
										p={ProfessionStore.getCurrentId()}
										pv={ProfessionVariantStore.getCurrentID()}
										sex={ProfileStore.getSex()}
										/>
								)
							}
							{list}
						</List>
					</Scroll>
				</Page>
			</section>
		);
	}

	private updateHerolistStore = () => {
		this.setState({
			list: HerolistStore.getAll(),
			sortOrder: HerolistStore.getSortOrder(),
			view: HerolistStore.getView(),
		} as State);
	}
}
