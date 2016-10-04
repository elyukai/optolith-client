import Avatar from '../layout/Avatar';
import HeroActions from '../../actions/HeroActions';
import React, { Component, PropTypes } from 'react';

class PaneListItem extends Component {
	
	static propTypes = {
		id: PropTypes.any.isRequired,
		name: PropTypes.string.isRequired,
		player: PropTypes.string,
		img: PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}
		
	handleClick = () => HeroActions.load(this.props.id);
	
	render() {
		return (
			<li className="pane-list-item" onClick={this.handleClick}>
				<Avatar src={this.props.img} />
				<h5 className="name">{this.props.name}{this.props.player ? ' [' + this.props.player + ']' : null}</h5>
			</li>
		);
	}
}

export default PaneListItem;
