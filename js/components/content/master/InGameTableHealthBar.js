import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class InGameTableHealthBar extends Component {
	
	static propTypes = {
		current: PropTypes.number.isRequired,
		max: PropTypes.number.isRequired
	};

	constructor(props) {
		super(props);
	}
	
	render() {
		
		const className = classNames( 'bar', `bar-${this.props.type}`, this.props.current > 0 && 'active', this.props.type == 'le' && this.props.max <= 0 && 'no-le');
		
		return (
			<div className={className}>
				<div className="bar-inner">
					<div className="bar-fg" style={{width: (1 - this.props.current / this.props.max) * 100 + '%'}}></div>
					<div className="bar-bg"></div>
				</div>
			</div>
		);
	}
}

export default InGameTableHealthBar;
