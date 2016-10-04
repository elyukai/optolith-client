var HeaderDropdown = require('../HeaderDropdown');
var HeroActions = require('../../../actions/HeroActions');
var React = require('react');
var TextField = require('../../layout/TextField');

class HeroesCreate extends React.Component {

	static propTypes = {
		isOpen: React.PropTypes.bool
	};

	state = {
		name: ''
	};

	constructor(props) {
		super(props);
	}
	
	_changeName = event => this.setState({ name: event.target.value });
	
	_createNewHero = event => {
		if (event.charCode === 13 && this.state.name != '') {
			HeroActions.create(this.state.heroname);
		}
	};

	render() {
		return (
			<HeaderDropdown isOpen={this.props.isOpen}>
				<TextField
					hint="Name des Helden"
					value={this.state.name}
					onChange={this._changeName}
					onKeyPress={this._createNewHero}
				/>
			</HeaderDropdown>
		);
	}
}

module.exports = HeroesCreate;
