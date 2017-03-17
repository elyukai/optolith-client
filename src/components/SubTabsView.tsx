import * as React from 'react';
import SubTabs from './SubTabs';

interface Props {
	id: string;
	tabs: SubTab[];
}

interface State {
	currentTab: string;
}

export default class SubTabsView extends React.Component<Props, State> {
	state = {
		currentTab: this.props.tabs[0].id,
	};

	handleClick = (currentTab: string) => this.setState({ currentTab } as State);

	render() {
		const { tabs, ...other } = this.props;
		const { currentTab } = this.state;

		const rawElement = tabs.find(e => e.id === currentTab);
		const element = rawElement ? rawElement.element : null;

		return (
			<section {...other}>
				<SubTabs
					tabs={tabs}
					active={currentTab}
					onClick={this.handleClick}
					/>
				{element}
			</section>
		);
	}
}
