import Overview from './Overview';
import PhaseStore from '../../stores/PhaseStore';
import React, { Component } from 'react';
import Sheets from './Sheets';
import SubTabs from '../../components/SubTabs';

export default class Profile extends Component {

	state = {
		phase: PhaseStore.get(),
		tab: 'overview'
	};

	_updatePhaseStore = () => this.setState({
		phase: PhaseStore.get()
	});

	handleClick = tab => this.setState({ tab });
	
	componentDidMount() {
		PhaseStore.addChangeListener(this._updatePhaseStore );
	}
	
	componentWillUnmount() {
		PhaseStore.removeChangeListener(this._updatePhaseStore );
	}

	render() {

		const { phase, tab } = this.state;

		var element;

		switch (tab) {
			case 'overview':
				element = <Overview />;
				break;
			case 'sheets':
				element = <Sheets />;
				break;
		}

		return (
			<section id="profile">
				<SubTabs
					tabs={[
						{
							label: 'Übersicht',
							tag: 'overview'
						},
						// {
						// 	label: 'Hintergrund',
						// 	tag: 'background',
						// 	disabled: true
						// },
						{
							label: 'Heldenbogen',
							tag: 'sheets',
							disabled: phase < 3
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
