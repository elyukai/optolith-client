import React, { Component } from 'react';
import { SubTabs } from '../Universal/SubTabs';
import { Groups } from './Groups';
import { InGame } from './InGame';

export class Master extends Component {

	state = {
		tab: 'ingame'
	};

	handleClick = tab => this.setState({ tab });

	render() {

		var element;

		switch (this.state.tab) {
			case 'overview':
				element = <Groups />;
				break;
			case 'ingame':
				element = <InGame />;
				break;
		}

		return (
			<section id="master">
				<SubTabs
					tabs={[
						{
							label: 'Übersicht',
							tag: 'overview',
							disabled: true
						},
						{
							label: 'InGame',
							tag: 'ingame'
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
