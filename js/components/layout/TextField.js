import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

class TextField extends Component {

	static propTypes = {
		className: PropTypes.any,
		disabled: PropTypes.bool,
		labelText: PropTypes.any,
		multiLine: PropTypes.bool,
		type: PropTypes.string,
		value: PropTypes.any.isRequired,
		onChange: PropTypes.func,
		onKeyDown: PropTypes.func,
		autoFocus: PropTypes.bool,
		countCurrent: PropTypes.any,
		countMax: PropTypes.any
	};

	static defaultProps = {
		multiLine: false,
		type: 'text'
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.autoFocus) ReactDOM.findDOMNode(this.refs.inputElement).focus();
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.className !== this.props.className || nextProps.value !== this.props.value || nextProps.disabled !== this.props.disabled || nextProps.countCurrent !== this.props.countCurrent;
	}

	render() {

		const className = classNames('textfield', this.props.fullWidth && 'fullWidth', this.props.disabled && 'disabled', this.props.className);

		const hintElementClassName = classNames('textfield-hint', this.props.value !== '' && 'hide');

		const hintElement = this.props.hint && (
			<div className={hintElementClassName}>{this.props.hint}</div>
		);

		const labelTextElement = this.props.labelText && (
			<label>{this.props.labelText}</label>
		);

		// const inputElement = this.props.multiLine ? (
		// 	<TextareaAutosize
		// 		defaultValue={this.props.value}
		// 		onChange={this.props.onChange}
		// 		onKeyPress={this.props.onKeyPress}
		// 	/>
		// ) : (
		const inputElement = (
			<input
				type={this.props.type}
				value={this.props.value}
				onChange={this.props.onChange}
				onKeyPress={this.props.onKeyPress}
				ref='inputElement'
			/>
		);

		const counterTextElement = this.props.countMax && (
			<div>{this.props.countCurrent} / {this.props.countMax}</div>
		);

		return (
			<div className={className}>
				{hintElement}
				{labelTextElement}
				{inputElement}
				{counterTextElement}
			</div>
		);
	}
}

export default TextField;
