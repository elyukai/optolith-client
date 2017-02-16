import Overview from './Overview';
import PhaseStore from '../../stores/PhaseStore';
import React, { Component } from 'react';
import Sheets from './Sheets';
import SubTabs from '../../components/SubTabs';

interface ProfileState {
	phase: number;
	tab: string;
}

export default class Profile extends Component<undefined, ProfileState> {

	state = {
		phase: PhaseStore.get(),
		tab: 'overview'
	};

	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as ProfileState);

	handleClick = (tab: string) => this.setState({ tab } as ProfileState);

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
							tag: 'sheets'
							// disabled: true
							// disabled: phase < 3
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
