var HeroActions = require('../../../actions/HeroActions');
var React = require('react');
var classNames = require('classnames');

class PaneHeroesItem extends React.Component {
	
	static propTypes = {
		id: React.PropTypes.any.isRequired,
		name: React.PropTypes.string.isRequired,
		player: React.PropTypes.string,
		prof: React.PropTypes.string,
		ap: React.PropTypes.any,
		img: React.PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}
		
	handleClick = () => HeroActions.load(this.props.id);
	
	render() {
		
		const className = classNames( 'pane-heroes-item', this.props.id === this.props.active && 'active' );
		
		return (
			<div className={className} onClick={this.handleClick}>
				<div className="avatar">
					<div className="avatar-inner">
						<img src={this.props.img} alt="" />
					</div>
				</div>
				<div className="main">
					<span className="name">{this.props.name}{this.props.player ? ' [' + this.props.player + ']' : null}</span>
					<div className="add">
						<span className="prof">Testprofession</span>
						<span className="ap">1234 AP</span>
					</div>
				</div>
			</div>
		);
						// <span className="prof">{this.props.prof}</span>
						// <span className="ap">{this.props.ap}</span>
	}
}

module.exports = PaneHeroesItem;
