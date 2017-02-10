import * as React from 'react';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';
import Label from './Label';

type OptionID = number | string | null;

interface Props {
	className?: string;
	disabled?: boolean;
	fullWidth?: boolean;
	hint?: string;
	label?: string;
	onChange: (option: OptionID) => void;
	options: { id: OptionID; name: string; }[];
	value: boolean | string | number;
}

interface State {
	isOpen: boolean;
	position: string;
}

export default class Dropdown extends React.Component<Props, State> {
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
		this.setState({ isOpen: !this.state.isOpen } as State);
	}

	onChange = (option: OptionID) => {
		this.props.onChange(option);
		this.setState({ isOpen: false } as State);
	}

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

		const style = this.state.isOpen ? (this.props.options.length < 6 ? this.props.options.length * 33 + 1 : 166) : 0;

		const current = this.props.options.filter(e => e.id === this.props.value).reduce((a, b) => a = b, undefined);
		const valueText = !current ? this.props.hint ? this.props.hint : '' : current.name;

		const downElement = (
			<div style={{ height: style }} className="down">
				<div style={{ height: (style - 2) }}>
					<GeminiScrollbar>
						{
							this.props.options.map(option => {
								const classNameInner = classNames(option.id === this.props.value && 'active');
								return (
									<div className={classNameInner} key={option.id || 'null'} onClick={this.props.disabled ? null : this.onChange.bind(null, option.id)}>
										{option.name}
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
				<Label text={this.props.label} disabled={this.props.disabled} />
				<div onMouseDown={this.insideFocus} onMouseUp={this.insideBlur} onTouchStart={this.insideFocus} onTouchEnd={this.insideBlur}>
					{this.state.position === 'top' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
					<div onClick={this.switch} className="value">{valueText}</div>
					{this.state.position === 'bottom' && this.state.isOpen ? downElement : <div style={{height:0}}></div>}
				</div>
			</div>
		);
	}
}
