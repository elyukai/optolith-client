var React = require('react');
var PaneActions = require('../../../actions/PaneActions');

var PaneTabsItem = require('./PaneTabsItem');

class PaneTabsContent extends React.Component {
	
	static propTypes = {
		tab: React.PropTypes.string.isRequired,
		phase: React.PropTypes.number.isRequired
	};
	
	constructor(props) {
		super(props);
	}
	
	shouldComponentUpdate(nextProps) {
		return nextProps.tab !== this.props.tab || nextProps.phase !== this.props.phase;
	}

	render() {
		
		const TABS = ['Basis', 'Rasse, Kultur & Profession', 'Aussehen & Hintergrund', 'Eigenschaften', 'Vor- & Nachteile', 'Sonderfertigkeiten', 'Talente', 'Zauber', 'Liturgien', 'Ausrüstung', 'Inventar', 'Charakterbogen'];
		
		const TAGS = ['charbase', 'rcp', 'details', 'attributes', 'disadv', 'specialabilities', 'skills', 'spells', 'liturgies', 'equipment', 'inventory', 'sheets'];
		
		const PHASES = [
			[true, false, false, false, false, false, false, false, false, false, false, false],
			[false, true, false, false, false, false, false, false, false, false, false, false],
			[false, false, true, false, false, false, false, false, false, false, false, false],
			[false, false, false, true, true, true, true, true, true, false, false, false],
			[true, true, false, true, true, true, true, true, true, true, true, true]
		];
		
		return (
			<div className="pane-bottomcontent">
				<PaneHint label="Zurück" subLabel="zur Heldenliste" icon="&#xE241;" onClick={PaneActions.showHeroList} className="orange" />
				{TABS.map((tabname, index) => (
					<PaneTabsItem
						isOpen={this.props.tab}
						tag={TAGS[index]}
						label={tabname}
						key={'maintab-' + TAGS[index]}
						disabled={!PHASES[this.props.phase][index]}
					/>
				))}
			</div>
		);
	}
}

module.exports = PaneTabsContent;
