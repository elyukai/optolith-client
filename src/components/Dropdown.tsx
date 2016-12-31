import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import Label from './Label';

type OptionID = number | boolean | string | null;

interface Props {
	className?: string;
	disabled?: boolean;
	fullWidth?: boolean;
	hint?: string;
	label?: string;
	onChange: (option: OptionID) => void;
	options: [string,  OptionID][];
	value: boolean | string | number;
}

interface State {
	isOpen: boolean;
	position: string;
}

export default class Dropdown extends Component<Props, State> {

	static propTypes = {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		fullWidth: PropTypes.bool,
		hint: PropTypes.string,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		options: PropTypes.array.isRequired,
		value: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.number,
			PropTypes.string
		])
	};

	state = {
		isOpen: false,
		position: 'bottom'
	};

	containerRef;
	clickInside = false;

	switch = () => {
		if (!this.state.isOpen) {
			var height = this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166;
			var containerRect = this.containerRef.getBoundingClientRect();
			if ((window.innerHeight - 32 - containerRect.top) < height) {
				this.setState({ isOpen: !this.state.isOpen, position: 'top' });
			} else {
				this.setState({ isOpen: !this.state.isOpen, position: 'bottom' });
			}
		}
		this.setState({ isOpen: !this.state.isOpen } as State);
	};

	onChange = (option) => {
		this.props.onChange(option);
		this.setState({ isOpen: false } as State);
	};

	outsideClick = () => {
		if (!this.clickInside && this.state.isOpen) {
			this.setState({ isOpen: false } as State);
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

		const className = classNames( 'dropdown', this.state.isOpen && 'active', this.props.fullWidth && 'fullWidth', this.props.disabled && 'disabled', this.state.position, this.props.className );

		const labelTextELement = this.props.label ? (
			<label>{this.props.label}</label>
		) : this.props.children;

		const style = this.state.isOpen ? (this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166) : 0;
		
		const current = this.props.options.filter(arr => arr[1] == this.props.value);
		const valueText = current.length === 0 ? (this.props.hint ? this.props.hint : '') : current[0][0];

		const downElement = (
			<div style={{ height: style }} className="down">
				<div style={{ height: (style - 2) }}>
					<GeminiScrollbar>
						{
							this.props.options.map(option => {

								const classNameInner = classNames( option[1] === this.props.value && 'active' );

								return (
									<div className={classNameInner} key={option[1].toString()} onClick={this.props.disabled ? null : this.onChange.bind(null, option[1])}>
										{option[0]}
									</div>
								);
							})
						}
					</GeminiScrollbar>
				</div>
			</div>
		);

		return (
			<div className={className} ref={node => this.containerRef = node}>
				<Label text={this.props.label} disabled={this.props.disabled}></Label>
				<div onMouseDown={this.insideFocus} onMouseUp={this.insideBlur} onTouchStart={this.insideFocus} onTouchEnd={this.insideBlur}>
					{this.state.position === 'top' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
					<div onClick={this.switch} className="value">{valueText}</div>
					{this.state.position === 'bottom' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
				</div>
			</div>
		);
	}
}
