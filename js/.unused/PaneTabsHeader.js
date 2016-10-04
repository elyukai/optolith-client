var React = require('react');
var HeroActions = require('../../../actions/HeroActions');

var PaneContentHeaderButton = require('../PaneContentHeaderButton');
var PaneContentHeaderDropdown = require('../PaneContentHeaderDropdown');

class PaneTabsHeader extends React.Component {
	
	static propTypes = {
		heroname: React.PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}
	
	shouldComponentUpdate(nextProps) {
		return nextProps.heroname !== this.props.heroname;
	}

	render() {
		
		return (
			<div className="pane-bottomheader">
				<div className="pane-bottomheader-titlebar">
					<span>{this.props.heroname}</span>
					<PaneContentHeaderButton icon="edit" func={() => { alert('FEATURE MISSING: Editor'); }} />
					<PaneContentHeaderButton icon="save" func={HeroActions.save} />
				</div>
			</div>
		);
	}
}

module.exports = PaneTabsHeader;
