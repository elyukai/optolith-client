var HeaderDropdown = require('../HeaderDropdown');
var HeroesActions = require('../../../actions/HeroesActions');
var React = require('react');
var RadioButtonGroup = require('../../layout/RadioButtonGroup');

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

class SortHeroes extends React.Component {

	static propTypes = {
		isOpen: React.PropTypes.bool
	};

	constructor(props) {
		super(props);
	}
	
	sort = option => HeroesActions.sort(option);

	render() {
		return (
			<HeaderDropdown isOpen={this.props.isOpen}>
				<RadioButtonGroup active={this.props.sortBy} onClick={this.sort} array={sortOptions} />
			</HeaderDropdown>
		);
	}
}

module.exports = SortHeroes;
