import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Portal } from '../../components/Portal';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Scroll } from '../../components/Scroll';
import { TextField } from '../../components/TextField';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { ExperienceLevel, Hero, InputTextEvent, User } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { filterAndSortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { HeroCreation } from './HeroCreation';
import { HerolistItem } from './HerolistItem';

export interface HerolistOwnProps {
	locale: UIMessages;
}

export interface HerolistStateProps {
	currentHero: CurrentHeroInstanceState;
	currentHeroId: string | undefined;
	elList: Map<string, ExperienceLevel>;
	list: Hero[];
	users: Map<string, User>;
	visibilityFilter: string;
	sortOrder: string;
}

export interface HerolistDispatchProps {
	loadHero(id?: string): void;
	showHero(): void;
	saveHeroAsJSON(id?: string): void;
	deleteHero(id?: string): void;
	duplicateHero(id?: string): void;
	createHero(name: string, sex: 'm' | 'f', el: string): void;
	importHero(): void;
	setSortOrder(id: string): void;
	setVisibilityFilter(id: string): void;
}

export type HerolistProps = HerolistStateProps & HerolistDispatchProps & HerolistOwnProps;

export interface HerolistState {
	filterText: string;
	showHeroCreation: boolean;
}

export class Herolist extends React.Component<HerolistProps, HerolistState> {
	state = {
		filterText: '',
		showHeroCreation: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as HerolistState);
	showHeroCreation = () => this.setState(() => ({ showHeroCreation: true } as HerolistState));
	closeHeroCreation = () => this.setState(() => ({ showHeroCreation: false } as HerolistState));

	render() {
		const {
			currentHero: {
				ap,
				dependent,
				el: { all, startId },
				profile: { avatar, professionName, sex },
				rcp: { culture, profession, professionVariant, race }
			},
			currentHeroId,
			importHero,
			list: rawList,
			locale,
			setSortOrder,
			setVisibilityFilter,
			sortOrder,
			users,
			visibilityFilter,
			...other
		} = this.props;
		const { filterText } = this.state;

		const list = filterAndSortObjects(rawList.filter(e => {
			if (visibilityFilter === 'own') {
				return !e.player;
			}
			else if (visibilityFilter === 'shared') {
				return !!e.player;
			}
			return true;
		}), locale.id, filterText, sortOrder === 'ap' ? [{ key: hero => hero.ap.total, reverse: true }, 'name'] : ['name']).map(hero => (
			<HerolistItem
				{...other}
				key={hero.id}
				id={hero.id}
				name={hero.name}
				ap={hero.ap}
				avatar={hero.avatar}
				c={hero.c}
				p={hero.p}
				player={typeof hero.player === 'string' ? users.get(hero.player) : undefined}
				pv={hero.pv}
				r={hero.r}
				sex={hero.sex}
				professionName={hero.professionName}
				dependent={dependent}
				els={all}
				currentHeroId={currentHeroId}
				locale={locale}
				/>
		));

		return (
			<section id="herolist">
				<Page>
					<Options>
						<TextField
							hint={_translate(locale, 'options.filtertext')}
							value={filterText}
							onChange={this.filter}
							fullWidth
							/>
						<Dropdown
							value={visibilityFilter}
							onChange={setVisibilityFilter}
							options={[
								{ id: 'all', name: _translate(locale, 'heroes.options.filter.all') },
								{ id: 'own', name: _translate(locale, 'heroes.options.filter.own') },
								{ id: 'shared', name: _translate(locale, 'heroes.options.filter.shared') },
							]}
							fullWidth
							/>
						<RadioButtonGroup
							active={sortOrder}
							onClick={setSortOrder}
							array={[
								{
									name: _translate(locale, 'options.sortorder.alphabetically'),
									value: 'name',
								},
								{
									name: _translate(locale, 'options.sortorder.ap'),
									value: 'ap',
								},
							]}
							/>
						<BorderButton label={_translate(locale, 'heroes.actions.create')} onClick={this.showHeroCreation} primary />
						<BorderButton label={_translate(locale, 'heroes.actions.import')} onClick={importHero} />
					</Options>
					<Scroll>
						<List>
							{
								currentHeroId === undefined && startId !== undefined && (
									<HerolistItem
										{...other}
										avatar={avatar}
										name={_translate(locale, 'heroes.view.unsavedhero.title')}
										ap={ap}
										r={race}
										c={culture}
										p={profession}
										pv={professionVariant}
										sex={sex}
										professionName={professionName}
										dependent={dependent}
										els={all}
										locale={locale}
										/>
								)
							}
							{list}
						</List>
					</Scroll>
				</Page>
				<HeroCreation
					{...this.props}
					close={this.closeHeroCreation}
					isOpened={this.state.showHeroCreation}
					/>
			</section>
		);
	}
}
