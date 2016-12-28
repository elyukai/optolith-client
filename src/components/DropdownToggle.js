import DropdownPosition from './DropdownPosition';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Dropdown extends Component {

	static propTypes = {
		className: PropTypes.any,
		hint: PropTypes.any,
		onChange: PropTypes.func,
		options: PropTypes.array,
		value: PropTypes.any
	};

	state = {
		isOpen: false,
		position: 'bottom'
	};

	clickInside = false;

	switch = () => {
		if (!this.state.isOpen) {
			var height = this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166;
			var containerRect = this.refs.container.getBoundingClientRect();
			if ((window.innerHeight - 32 - containerRect.top) < height) {
				this.setState({ isOpen: !this.state.isOpen, position: 'top' });
			} else {
				this.setState({ isOpen: !this.state.isOpen, position: 'bottom' });
			}
		}
		this.setState({ isOpen: !this.state.isOpen });
	};

	onChange = (option) => {
		this.props.onChange(option);
		this.setState({ isOpen: false });
	};

	outsideClick = () => {
		if (!this.clickInside && this.state.isOpen) {
			this.setState({ isOpen: false });
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
									<div className={classNameInner} key={option[1]} onClick={this.onChange.bind(null, option[1])}>
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
			<DropdownPosition>
				
			</DropdownPosition>
			<div className={className} ref="container">
				{labelTextELement}
				<div onMouseDown={this.insideFocus} onMouseUp={this.insideBlur} onTouchStart={this.insideFocus} onTouchEnd={this.insideBlur}>
					{this.state.position === 'top' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
					<div onClick={this.switch} className="value">{valueText}</div>
					{this.state.position === 'bottom' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
				</div>
			</div>
		);
	}
}
