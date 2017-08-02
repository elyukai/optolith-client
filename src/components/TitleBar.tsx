import { remote } from 'electron';
import * as React from 'react';
import { TitleBarButton } from './TitleBarButton';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarProps {
	platform: string;
	minimize(): void;
	maximize(): void;
	restore(): void;
	close(): void;
}

export interface TitleBarState {
	isMaximized: boolean;
}

export class TitleBar extends React.Component<TitleBarProps, TitleBarState> {
	state = {
		isMaximized: remote.getCurrentWindow().isMaximized()
	};

	componentDidMount() {
		const win = remote.getCurrentWindow();
		win.addListener('maximize', this.updateState).addListener('unmaximize', this.updateState);
	}

	componentWillUnmount() {
		const win = remote.getCurrentWindow();
		win.removeListener('maximize', this.updateState).removeListener('unmaximize', this.updateState);
	}

	render() {
		const { close, maximize, minimize, platform, restore } = this.props;
		const { isMaximized } = this.state;

		if (platform === 'darwin') {
			return <TitleBarWrapper empty />;
		}

		return (
			<TitleBarWrapper>
				<TitleBarButton icon="&#xE15B;" onClick={minimize} />
				{!isMaximized && <TitleBarButton icon="&#xE5D0;" onClick={maximize} />}
				{isMaximized && <TitleBarButton icon="&#xE5D1;" onClick={restore} />}
				<TitleBarButton icon="&#xE5CD;" onClick={close} className="close" />
			</TitleBarWrapper>
		);
	}

	private updateState = () => {
		this.setState({ isMaximized: remote.getCurrentWindow().isMaximized() });
	}
}
