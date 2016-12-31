import Overview from './Overview';
import React, { Component } from 'react';
import SubTabs from '../../components/SubTabs';

interface State {
	tab: string;
}

export default class Home extends Component<any, State> {

	state = {
		tab: 'overview'
	};

	handleClick = tab => this.setState({ tab });
	
	render() {

		const { tab } = this.state;

		var element;

		switch (tab) {
			case 'overview':
				element = <Overview />;
				break;
		}

		return (
			<section id="home">
				<SubTabs
					tabs={[
						{
							label: 'Übersicht',
							tag: 'overview'
						},
						{
							label: 'Neuigkeiten',
							tag: 'news',
							disabled: true
						},
						{
							label: 'Letzte Änderungen',
							tag: 'patchnotes',
							disabled: true
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
