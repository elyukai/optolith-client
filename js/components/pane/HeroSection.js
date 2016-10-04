import Collapse from '../layout/Collapse';
import HeroListItem from './HeroListItem';
import HeroHeader from './HeroHeader';
import HeroesStore from '../../stores/core/HeroesStore';
import React, { Component } from 'react';

class HeroSection extends Component {

	state = {
		heroes: HeroesStore.getHeroes(),
		sortBy: HeroesStore.getSortOption(),
		collapseHeroes: false,
		collapseGroups: false
	};
	
	constructor(props) {
		super(props);
	}

	_updateHeroesStore = () => this.setState({
		heroes: HeroesStore.getHeroes(),
		sortBy: HeroesStore.getSortOption()
	});
	
	componentDidMount() {
		HeroesStore.addChangeListener(this._updateHeroesStore);
	}
	
	componentWillUnmount() {
		HeroesStore.removeChangeListener(this._updateHeroesStore);
	}

	switchCollapseHeroes = () => this.setState({ collapseHeroes: !this.state.collapseHeroes});
	switchCollapseGroups = () => this.setState({ collapseGroups: !this.state.collapseGroups});

	render() {

		const heroesListItems = this.state.heroes.length > 0 ? this.state.heroes.map( (hero) => {
			return <HeroListItem key={hero.id} id={hero.id} name={hero.name} prof={hero.prof} ap={hero.ap} active={this.props.id} img="" />;
		}) : (
			<li className="no-heroes">Keine Helden verfügbar.</li>
		);
		
		return (
			<div className="hero-section">
				<HeroHeader sortBy={this.state.sortBy}/>
				<Collapse className="heroes" title="Eigene Helden" switch={this.switchCollapseHeroes} expanded={!this.state.collapseHeroes} >
					<ul>
						{heroesListItems}
					</ul>
				</Collapse>
				<Collapse className="groups" title="Gruppen" switch={this.switchCollapseGroups} expanded={!this.state.collapseGroups} >
					<ul>
						{heroesListItems}
					</ul>
				</Collapse>
			</div>
		);
	}
}

export default HeroSection;
