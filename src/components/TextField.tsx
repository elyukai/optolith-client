// import TextareaAutosize from 'react-textarea-autosize';
import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import Label from './Label';
import ReactDOM from 'react-dom';

interface Props {
	autoFocus?: boolean;
	className?: string;
	countCurrent?: number;
	countMax?: number;
	disabled?: boolean;
	fullWidth?: boolean;
	hint?: string;
	label?: string;
	multiLine?: boolean;
	onChange: (event: Event) => void;
	onKeyDown?: (event: React.KeyboardEvent<any>) => void;
	type?: string;
	value: string | number;
}

export default class TextField extends Component<Props, any> {

	static propTypes = {
		autoFocus: PropTypes.bool,
		className: PropTypes.any,
		countCurrent: PropTypes.any,
		countMax: PropTypes.any,
		disabled: PropTypes.bool,
		fullWidth: PropTypes.bool,
		hint: PropTypes.string,
		label: PropTypes.string,
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

	inputRef;

	componentDidMount() {
		if (this.props.autoFocus) {
			ReactDOM.findDOMNode<HTMLInputElement>(this.inputRef).focus();
		}
	}

	render() {

		const { className, countCurrent, countMax, disabled, fullWidth, hint, label, onChange, onKeyDown, type, value } = this.props;

		const hintElement = hint ? (
			<div className={classNames('textfield-hint', value && 'hide')}>{hint}</div>
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
				onChange={disabled ? null : onChange}
				onKeyPress={disabled ? null : onKeyDown}
				readOnly={disabled}
				ref={node => this.inputRef = node}
			/>
		);

		const counterTextElement = countMax ? (
			<div>{countCurrent} / {countMax}</div>
		) : null;

		return (
			<div className={classNames(className, { textfield: true, fullWidth, disabled })}>
				{hintElement}
				<Label text={label} />
				{inputElement}
				{counterTextElement}
			</div>
		);
	}
}
