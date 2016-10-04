import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Collapse extends Component {

	static propTypes = {
		className: PropTypes.any,
		expanded: PropTypes.bool.isRequired,
		height: PropTypes.any,
		switch: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired
	};

	static defaultProps = {
		height: 'auto'
	};

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('collapse', this.props.expanded && 'expanded', this.props.className);

		const style = this.props.expanded ? { height: this.props.height } : null;

		return (
			<div className={className} style={style}>
				<div className="collapse-header" onClick={this.props.switch}>
					{this.props.title}
				</div>
				<div className="collapse-content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Collapse;
