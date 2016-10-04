var React = require('react');
var PaneActions = require('../../../actions/PaneActions');

var Collapse = require('../../layout/Collapse');
var PaneHeroesItem = require('./PaneHeroesItem');
var PaneTabsItem = require('../tabs/PaneTabsItem');

class PaneHeroesContent extends React.Component {
	
	static propTypes = {
		tab: React.PropTypes.string.isRequired,
		own: React.PropTypes.array.isRequired,
		mastered: React.PropTypes.array.isRequired,
		other: React.PropTypes.array.isRequired,
		collapse: React.PropTypes.array.isRequired,
		heroid: React.PropTypes.any.isRequired
	};

	constructor(props) {
		super(props);
	}
	
	handleCollapse = (id) => PaneActions.handleCollapse(id);

	render() {

		const heroListItems = this.props.own.length > 0 ? this.props.own.map( (hero) => {
			return <PaneHeroesItem key={hero.id} id={hero.id} name={hero.name} prof={hero.prof} ap={hero.ap} active={this.props.heroid} img="" />;
		}) : (
			<div className="no-heroes">Keine Helden verfügbar.</div>
		);

		const ownHeroes = this.props.own.length > 0 ? this.props.own.map( (hero) => {
			return <PaneHeroesItem key={hero.id} id={hero.id} name={hero.name} prof={hero.prof} ap={hero.ap} active={this.props.heroid} img="" />;
		}) : (
			<div className="no-heroes">Keine Helden in dieser Kategorie.</div>
		);

		return (
			<div className="pane-bottomcontent">
				<Collapse title="Eigene"
					switch={this.handleCollapse.bind(null, 0)}
					expanded={this.props.collapse[0]}
					height={this.props.own.length > 0 ? this.props.own.length * 48 + 44 : 80}
				>{ownHeroes}</Collapse>
				<Collapse title="Gemeisterte"
					switch={this.handleCollapse.bind(null, 1)}
					expanded={this.props.collapse[1]}
					height={this.props.mastered.length > 0 ? this.props.mastered.length * 48 + 116 : 162}
				>
					<PaneTabsItem isOpen={this.props.tab} tag="groups" label="Gruppen" />
					<PaneTabsItem isOpen={this.props.tab} tag="ingame" label="InGame-Verwaltung" />
					{
						this.props.mastered.length > 0 ? this.props.mastered.map( (hero) => {
							return <PaneHeroesItem key={hero.id} id={hero.id} name={hero.name} player={hero.player} prof={hero.prof} ap={hero.ap} active={this.props.heroid} img="" />;
						}) : (
							<div className="no-heroes">Keine Helden in dieser Kategorie.</div>
						)
					}
				</Collapse>
				<Collapse title="Andere"
					id="other"
					switch={this.handleCollapse.bind(null, 2)}
					expanded={this.props.collapse[2]}
					height={this.props.other.length > 0 ? this.props.other.length * 48 + 44 : 80}
				>
					{
						this.props.other.length > 0 ? this.props.other.map( (hero) => {
							return <PaneHeroesItem key={hero.id} id={hero.id} name={hero.name} player={hero.player} prof={hero.prof} ap={hero.ap} active={this.props.heroid} img="" />;
						}) : (
							<div className="no-heroes">Keine Helden in dieser Kategorie.</div>
						)
					}
				</Collapse>
			</div>
		);
	}
}

module.exports = PaneHeroesContent;
