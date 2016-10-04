var classNames = require('classnames');
var React = require('react');

class PaneHint extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		
		const className = classNames('pane-hint', this.props.className);
		
		const TextElement = this.props.subLabel ? (
			<div className="pane-hint-name pane-hint-name-ext" onClick={this.props.onClickText}>
				<span className="pane-hint-name-main">{this.props.label}</span>
				<span className="pane-hint-name-sub">{this.props.subLabel}</span>
			</div>
		) : (
			<div className="pane-hint-name" onClick={this.props.onClickText}>
				{this.props.label}
			</div>
		);
		
		const IconElement = this.props.subLabel ? (
			<div className="pane-hint-icon" onClick={this.props.onClickIcon}>{this.props.icon}</div>
		) : null;
		
		return (
			<div className={className} onClick={this.props.onClick}>
				{TextElement}
				{IconElement}
			</div>
		);
	}
}

PaneHint.propTypes = {
	label: React.PropTypes.string.isRequired,
	subLabel: React.PropTypes.string.isRequired,
	icon: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func,
	onClickText: React.PropTypes.func,
	onClickIcon: React.PropTypes.func
};