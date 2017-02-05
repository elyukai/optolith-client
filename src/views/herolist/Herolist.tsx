import { requestList, setSortOrder, setVisibilityFilter } from '../../actions/HerolistActions';
import { filterAndSort } from '../../utils/ListUtils';
import * as React from 'react';
import APStore from '../../stores/APStore';
import Aside from '../../components/Aside';
import BorderButton from '../../components/BorderButton';
import createOverlay from '../../utils/createOverlay';
import CultureStore from '../../stores/CultureStore';
import Dropdown from '../../components/Dropdown';
import ELStore from '../../stores/ELStore';
import HeroCreation from './HeroCreation';
import HerolistItem from './HerolistItem';
import HerolistStore from '../../stores/HerolistStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RaceStore from '../../stores/RaceStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

interface State {
	list: Hero[];
	filterText: string;
	view: string;
	sortOrder: string;
}

export default class Herolist extends React.Component<undefined, State> {

	state = {
		filterText: '',
		list: HerolistStore.getAll(),
		view: HerolistStore.getView(),
		sortOrder: HerolistStore.getSortOrder()
	};

	_updateHerolistStore = () => this.setState({
		list: HerolistStore.getAll(),
		view: HerolistStore.getView(),
		sortOrder: HerolistStore.getSortOrder()
	} as State);

	filter = (event: Event) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => setSortOrder(option);
	changeView = (option: string) => setVisibilityFilter(option);
	showHeroCreation = () => createOverlay(<HeroCreation />);
	refresh = () => requestList();

	componentDidMount() {
		HerolistStore.addChangeListener(this._updateHerolistStore );
	}

	componentWillUnmount() {
		HerolistStore.removeChangeListener(this._updateHerolistStore );
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
			return e as Hero & {player: undefined; };
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
							options={[['Alle Helden', 'all'], ['Eigene Helden', 'own'], ['Geteilte Helden', 'shared']]}
							fullWidth
							/>
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={[
								{
									name: 'Alphabetisch',
									value: 'name'
								},
								{
									name: 'AP',
									value: 'ap'
								}
							]}
							/>
						<BorderButton label="Aktualisieren" onClick={this.refresh} disabled />
						<BorderButton label="Erstellen" onClick={this.showHeroCreation} primary />
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
					<Aside>
						<div>
							Cillum id culpa do ex aute velit mollit velit deserunt. Laborum exercitation nulla ullamco qui dolore nulla irure Lorem est est. Velit ad duis amet incididunt ipsum. Id ea aliquip ex ullamco et proident commodo ipsum culpa. Reprehenderit nostrud eiusmod magna ullamco magna eiusmod. Deserunt pariatur elit elit ea ad reprehenderit culpa commodo laborum velit. Aute non eiusmod adipisicing eu et minim aliqua veniam proident nulla.
						</div>
					</Aside>
				</div>
			</section>
		);
	}
}
