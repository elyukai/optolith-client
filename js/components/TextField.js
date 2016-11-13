import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

class TextField extends Component {

	static propTypes = {
		autoFocus: PropTypes.bool,
		className: PropTypes.any,
		countCurrent: PropTypes.any,
		countMax: PropTypes.any,
		disabled: PropTypes.bool,
		hint: PropTypes.string,
		labelText: PropTypes.any,
		multiLine: PropTypes.bool,
		onChange: PropTypes.func,
		onKeyDown: PropTypes.func,
		type: PropTypes.string,
		value: PropTypes.any
	};

	static defaultProps = {
		multiLine: false,
		type: 'text'
	};

	componentDidMount() {
		if (this.props.autoFocus) ReactDOM.findDOMNode(this.refs.inputElement).focus();
	}

	// shouldComponentUpdate(nextProps) {
	// 	let { className: _className, value: _value, disabled: _disabled, countCurrent: _countCurrent, type: _type, hint: _hint } = nextProps;
	// 	let { className, value, disabled, countCurrent, type, hint } = this.props;
	// 	return _className !== className || _value !== value || _disabled !== disabled || _countCurrent !== countCurrent || _type !== type || _hint !== hint;
	// }

	render() {

		let { className, countCurrent, countMax, disabled, fullWidth, hint, labelText, onChange, onKeyDown, type, value } = this.props;

		className = classNames('textfield', fullWidth && 'fullWidth', disabled && 'disabled', className);

		const hintElement = hint ? (
			<div className={classNames('textfield-hint', value && 'hide')}>{hint}</div>
		) : null;

		const labelTextElement = labelText ? (
			<label>{labelText}</label>
		) : null;

		// const inputElement = this.props.multiLine ? (
		// 	<TextareaAutosize
		// 		defaultValue={value}
		// 		onChange={onChange}
		// 		onKeyPress={onKeyDown}
		// 	/>
		// ) : (
		const inputElement = (
			<input
				type={type}
				value={value}
				onChange={onChange}
				onKeyPress={onKeyDown}
				ref='inputElement'
			/>
		);

		const counterTextElement = countMax ? (
			<div>{countCurrent} / {countMax}</div>
		) : null;

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
