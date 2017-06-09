import { remote } from 'electron';
import * as React from 'react';
import * as HerolistActions from '../../actions/HerolistActions';
import * as HistoryActions from '../../actions/HistoryActions';
import { AdventurePoints, UILocale } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { AvatarWrapper } from '../AvatarWrapper';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { TooltipToggle } from '../TooltipToggle';
import { ApTooltip } from './ApTooltip';
import { Settings } from './Settings';
import { TitleBarBack } from './TitleBarBack';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarTabs } from './TitleBarTabs';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForHeroProps {
	ap: AdventurePoints;
	avatar?: string;
	currentTab: string;
	isUndoAvailable: boolean;
	locale: UILocale;
	phase: number;
}

export class TitleBarForHero extends React.Component<TitleBarForHeroProps, object> {
	saveHero = () => HerolistActions.saveHero();
	undo = () => HistoryActions.undoLastAction();
	toggleDevtools = () => remote.getCurrentWindow().webContents.toggleDevTools();
	showSettings = () => createOverlay(<Settings />);

	render() {
		const { ap, avatar, currentTab, isUndoAvailable, locale, phase } = this.props;
		const { total, spent } = ap;

		const tabs = [
			{ label: locale['titlebar.tabs.profile'], tag: 'profile' }
		];

		if (phase === 1) {
			tabs.push(
				{ label: locale['titlebar.tabs.racecultureprofession'], tag: 'rcp' }
			);
		}
		else if (phase === 2) {
			tabs.push(
				{ label: locale['titlebar.tabs.attributes'], tag: 'attributes' },
				{ label: locale['titlebar.tabs.advantagesdisadvantages'], tag: 'disadv' },
				{ label: locale['titlebar.tabs.skills'], tag: 'skills' }
			);
		}
		else {
			tabs.push(
				{ label: locale['titlebar.tabs.attributes'], tag: 'attributes' },
				{ label: locale['titlebar.tabs.skills'], tag: 'skills' },
				{ label: locale['titlebar.tabs.belongings'], tag: 'belongings' }
			);
		}

		return (
			<TitleBarWrapper>
				<TitleBarLeft>
					<TitleBarBack />
					<AvatarWrapper src={avatar} />
					<TitleBarTabs active={currentTab} tabs={tabs} />
				</TitleBarLeft>
				<TitleBarRight>
					<TooltipToggle
						position="bottom"
						margin={12}
						content={<ApTooltip ap={ap} locale={locale} />}
						>
						<Text className="collected-ap">{total - spent} {locale['titlebar.view.adventurepoints']}</Text>
					</TooltipToggle>
					<IconButton
						icon="&#xE166;"
						onClick={this.undo}
						disabled={!isUndoAvailable}
						/>
					<BorderButton
						label={locale['actions.save']}
						onClick={this.saveHero}
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
