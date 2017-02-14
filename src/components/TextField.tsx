// import TextareaAutosize from 'react-textarea-autosize';
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
	onChange: (event: React.FormEvent<HTMLInputElement>) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	type?: string;
	value: string | number;
}

export default class TextField extends React.Component<Props, undefined> {
	static defaultProps = {
		multiLine: false,
		type: 'text'
	};

	inputRef: HTMLInputElement;

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
				onChange={disabled ? undefined : (onChange as (event: React.FormEvent<HTMLInputElement>) => void)}
				onKeyPress={disabled ? undefined : (onKeyDown as (event: React.KeyboardEvent<HTMLInputElement>) => void)}
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
