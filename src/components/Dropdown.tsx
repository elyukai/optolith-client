import * as classNames from 'classnames';
import * as React from 'react';
import { Label } from './Label';
import { Scroll } from './Scroll';

export interface DropdownProps {
	className?: string;
	disabled?: boolean;
	fullWidth?: boolean;
	hint?: string;
	label?: string;
	options: {
		id?: number | string;
		name: string | undefined;
		disabled?: boolean;
	}[];
	required?: boolean;
	value?: boolean | string | number;
	onChange?(option?: number | string): void;
}

interface DropdownState {
	isOpen: boolean;
	position: string;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
	state = {
		isOpen: false,
		position: 'bottom'
	};

	containerRef: HTMLDivElement;
	clickInside = false;

	switch = () => {
		if (!this.state.isOpen) {
			const height = this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166;
			const containerRect = this.containerRef.getBoundingClientRect();
			if ((window.innerHeight - 32 - containerRect.top) < height) {
				this.setState({ isOpen: !this.state.isOpen, position: 'top' });
			} else {
				this.setState({ isOpen: !this.state.isOpen, position: 'bottom' });
			}
		}
		this.setState({ isOpen: !this.state.isOpen } as DropdownState);
	}

	onChange = (option?: number | string) => {
		const { onChange } = this.props;
		if (typeof onChange === 'function') {
			onChange(option);
		}
		this.setState({ isOpen: false } as DropdownState);
	}

	outsideClick = () => {
		if (!this.clickInside && this.state.isOpen) {
			this.setState({ isOpen: false } as DropdownState);
		}
	}

	insideFocus = () => this.clickInside = true;
	insideBlur = () => this.clickInside = false;

	componentDidMount() {
		window.addEventListener('mousedown', this.outsideClick, false);
		window.addEventListener('ontouchstart', this.outsideClick, false);
	}

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.outsideClick, false);
		window.removeEventListener('ontouchstart', this.outsideClick, false);
	}

	render() {
		const { className, disabled, fullWidth, hint, label, options, required, value } = this.props;
		const { isOpen, position } = this.state;

		const style = isOpen ? (options.length < 6 ? options.length * 33 + 1 : 166) : 0;

		const current = options.find(e => e.id === value);
		const valueText = current ? current.name : hint;

		const downElement = (
			<div style={{ height: style }} className="down">
				<div style={{ height: (style - 2) }}>
					<Scroll noInnerElement className={options.length > 5 ? 'scroll-active' : ''}>
						{
							options.map(option => {
								const classNameInner = classNames(option.id === value && 'active', option.disabled === true && 'disabled');
								return (
									<div className={classNameInner} key={option.id || '__DEFAULT__'} onClick={!disabled && !option.disabled && this.onChange.bind(null, option.id)}>
										{option.name}
									</div>
								);
							})
						}
					</Scroll>
				</div>
			</div>
		);

		const placeholder = <div style={{height: 0}}></div>;

		return (
			<div
				className={classNames(className, position, {
					dropdown: true,
					active: isOpen,
					fullWidth,
					disabled,
					invalid: required && current === undefined
				})}
				ref={node => this.containerRef = node}
				>
				{label && <Label text={label} disabled={disabled} />}
				<div
					onMouseDown={this.insideFocus}
					onMouseUp={this.insideBlur}
					onTouchStart={this.insideFocus}
					onTouchEnd={this.insideBlur}
					>
					{position === 'top' && isOpen ? downElement : placeholder}
					<div onClick={this.switch} className={classNames('value', !current && 'hint')}>{valueText}</div>
					{position === 'bottom' && isOpen ? downElement : placeholder}
				</div>
			</div>
		);
	}
}
