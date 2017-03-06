import * as React from 'react';
import { insertHero, requestList, setSortOrder, setVisibilityFilter } from '../../actions/HerolistActions';
import BorderButton from '../../components/BorderButton';
import Dropdown from '../../components/Dropdown';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import APStore from '../../stores/APStore';
import CultureStore from '../../stores/CultureStore';
import ELStore from '../../stores/ELStore';
import HerolistStore from '../../stores/HerolistStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RaceStore from '../../stores/RaceStore';
import createOverlay from '../../utils/createOverlay';
import { filterAndSort } from '../../utils/ListUtils';
import HeroCreation from './HeroCreation';
import HerolistItem from './HerolistItem';

interface State {
	list: Hero[];
	filterText: string;
	view: string;
	sortOrder: string;
	file: File | undefined;
}

export default class Herolist extends React.Component<undefined, State> {

	state = {
		file: undefined,
		filterText: '',
		list: HerolistStore.getAll(),
		sortOrder: HerolistStore.getSortOrder(),
		view: HerolistStore.getView(),
	};

	_updateHerolistStore = () => this.setState({
		list: HerolistStore.getAll(),
		sortOrder: HerolistStore.getSortOrder(),
		view: HerolistStore.getView(),
	} as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => setSortOrder(option);
	changeView = (option: string) => setVisibilityFilter(option);
	showHeroCreation = () => createOverlay(<HeroCreation />);
	refresh = () => requestList();
	changeFile = (event: InputTextEvent) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = e => {
				insertHero(e.target.result);
			};
			reader.readAsText(file);
		}
	};

	componentDidMount() {
		HerolistStore.addChangeListener(this._updateHerolistStore);
	}

	componentWillUnmount() {
		HerolistStore.removeChangeListener(this._updateHerolistStore);
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
		}).map(hero => <HerolistItem key={hero.id} {...hero} />);

		return (
			<section id="herolist">
				<div className="page">
					<div className="options">
						<TextField
							hint="Suchen"
							value={filterText}
							onChange={this.filter}
							fullWidth
							/>
						<Dropdown
							value={view}
							onChange={this.changeView}
							options={[
								{ id: 'all', name: 'Alle Helden' },
								{ id: 'own', name: 'Eigene Helden' },
								{ id: 'shared', name: 'Geteilte Helden' },
							]}
							fullWidth
							/>
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={[
								{
									name: 'Alphabetisch',
									value: 'name',
								},
								{
									name: 'AP',
									value: 'ap',
								},
							]}
							/>
						<BorderButton label="Aktualisieren" onClick={this.refresh} disabled />
						<BorderButton label="Erstellen" onClick={this.showHeroCreation} primary />
						<TextField
							onChange={this.changeFile}
							fullWidth
							type="file"
							/>
					</div>
					<Scroll className="list">
						<ul>
							{
								ProfileStore.getID() === null && ELStore.getStartID() !== 'EL_0' ? (
									<HerolistItem
										id={null}
										avatar={ProfileStore.getAvatar()}
										name="Ungespeicherter Held"
										ap={{ total: APStore.getTotal() }}
										r={RaceStore.getCurrentID()}
										c={CultureStore.getCurrentID()}
										p={ProfessionStore.getCurrentId()}
										pv={ProfessionVariantStore.getCurrentID()}
										sex={ProfileStore.getSex()}
										/>
								) : null
							}
							{list}
						</ul>
					</Scroll>
				</div>
			</section>
		);
	}
}
