import IconButton from '../../components/IconButton';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

class OverviewNameChange extends Component {

	static propTypes = {
		cancel: PropTypes.func,
		change: PropTypes.func,
		name: PropTypes.string
	};

	state = {
		name: this.props.name
	};

	change = () => this.props.change(this.state.name);

	handleEnter = event => {
		if (event.charCode === 13 && this.state.name !== '')
			this.change();
	};

	handleInput = event => {
		this.setState({ name: event.target.value });
	};

	render() {
		return (
			<div className="change-name">
				<TextField
					value={this.state.name}
					onChange={this.handleInput}
					onKeyPress={this.handleEnter}
					autoFocus />
				<IconButton icon="&#xE876;" onClick={this.change} disabled={this.state.name === ''} />
				<IconButton icon="&#xE5CD;" onClick={this.props.cancel} />
			</div>
		);
	}
}

export default OverviewNameChange;
