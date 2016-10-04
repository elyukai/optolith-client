import HeaderButton from './HeaderButton';
import HeaderDropdown from './HeaderDropdown';
import HeroActions from '../../actions/HeroActions';
import HeroesActions from '../../actions/HeroesActions';
import RadioButtonGroup from '../layout/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import TextField from '../layout/TextField';
import classNames from 'classnames';

var sortOptions = [
	{
		name: 'Alphabetisch sortieren',
		value: 'name'
	},
	{
		name: 'Nach AP sortieren',
		value: 'ap'
	}
];

class HeroSectionHeader extends Component {
	
	static propTypes = {
		sortBy: PropTypes.string.isRequired
	};

	state = {
		openHeader: false
	};

	constructor(props) {
		super(props);
	}
	
	showHeroCreation = () => HeroesActions.showHeroCreation();
	openHeader = () => this.setState({ openHeader: !this.state.openHeader });
	refresh = () => HeroesActions.refresh();
	sort = option => HeroesActions.sort(option);

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.openHeader !== this.state.openHeader || nextProps.sortBy !== this.props.sortBy;
	}

	render() {
		
		const className = classNames('header-bar', { 'dropdown-active': this.state.openHeader });
		
		return (
			<div className="hero-header">
				<div className={className}>
					<span>Heldenliste</span>
					<HeaderButton icon="add" func={this.showHeroCreation} />
				</div>
				<HeaderDropdown className="sort-options" isOpen={this.state.openHeader}>
					<RadioButtonGroup active={this.props.sortBy} onClick={this.sort} array={sortOptions} />
				</HeaderDropdown>
			</div>
		);
	}
}
					// <HeaderButton icon="list" func={this.openHeader} isOpen={this.state.openHeader} />
					// <HeaderButton icon="refresh" func={this.refresh} />

export default HeroSectionHeader;
