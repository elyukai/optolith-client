import { remote } from 'electron';
import * as React from 'react';
import * as InGameActions from '../../actions/InGameActions';
import { UILocale } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { Settings } from './Settings';
import { TitleBarBack } from './TitleBarBack';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForGroupProps {
	locale: UILocale;
	groupName: string;
}

export class TitleBarForGroup extends React.Component<TitleBarForGroupProps, object> {
	saveGroup = () => InGameActions.save();
	toggleDevtools = () => remote.getCurrentWindow().webContents.toggleDevTools();
	showSettings = () => createOverlay(<Settings />);

	render() {
		const { groupName, locale } = this.props;
		return (
			<TitleBarWrapper>
				<TitleBarLeft>
					<TitleBarBack />
					<Text>{groupName}</Text>
				</TitleBarLeft>
				<TitleBarRight>
					<BorderButton
						label={locale['actions.save']}
						onClick={this.saveGroup}
						/>
					<IconButton
						icon="&#xE8B8;"
						onClick={this.showSettings}
						/>
					<IconButton
						icon="&#xE868;"
						onClick={this.toggleDevtools}
						/>
				</TitleBarRight>
			</TitleBarWrapper>
		);
	}
}
