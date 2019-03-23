import { remote } from 'electron';
import * as React from 'react';
import { SettingsContainer } from '../../App/Containers/SettingsContainer';
import { SubTab } from '../../App/Models/Hero/heroTypeHelpers';
import { AdventurePointsObject } from '../../App/Selectors/adventurePointsSelectors';
import { translate } from '../../App/Utils/I18n';
import { TabId } from '../../App/Utils/LocationUtils';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { TooltipToggle } from '../../components/TooltipToggle';
import { UIMessagesObject } from '../../types/ui';
import { List, Maybe, Record } from '../../Utilities/dataUtils';
import { ApTooltip } from './ApTooltip';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarSubTabs } from './NavigationBarSubTabs';
import { NavigationBarTabProps, NavigationBarTabs } from './NavigationBarTabs';
import { NavigationBarWrapper } from './NavigationBarWrapper';

export interface NavigationBarOwnProps {
  locale: UIMessagesObject;
  platform: string;
  checkForUpdates (): void;
}

export interface NavigationBarStateProps {
  currentTab: TabId;
  avatar: Maybe<string>;
  isRedoAvailable: boolean;
  isRemovingEnabled: boolean;
  isUndoAvailable: boolean;
  isSettingsOpen: boolean;
  isHeroSection: boolean;
  tabs: List<NavigationBarTabProps>;
  subtabs: Maybe<List<SubTab>>;
  adventurePoints: Record<AdventurePointsObject>;
  maximumForMagicalAdvantagesDisadvantages: Maybe<number>;
  isSpellcaster: boolean;
  isBlessedOne: boolean;
}

export interface NavigationBarDispatchProps {
  undo (): void;
  redo (): void;
  saveHero (): void;
  saveGroup (): void;
  setTab (id: TabId): void;
  openSettings (): void;
  closeSettings (): void;
}

export type NavigationBarProps =
  NavigationBarStateProps & NavigationBarDispatchProps & NavigationBarOwnProps;

export function NavigationBar (props: NavigationBarProps) {
  const {
    subtabs,
    openSettings,
    closeSettings,
    isHeroSection,
    avatar,
    locale,
    undo,
    isRedoAvailable,
    isUndoAvailable,
    redo,
    saveHero,
    setTab,
    adventurePoints,
  } = props;

  return (
    <>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {isHeroSection && <>
            <NavigationBarBack setTab={() => setTab ('herolist')} />
            <AvatarWrapper src={avatar} />
          </>}
          <NavigationBarTabs {...props} />
        </NavigationBarLeft>
        <NavigationBarRight>
          {isHeroSection && <>
            <TooltipToggle
              position="bottom"
              margin={12}
              content={<ApTooltip {...props} />}
              >
              <Text className="collected-ap">
                {adventurePoints.get ('available')}
                {' '}
                {translate (locale, 'titlebar.view.adventurepoints')}
              </Text>
            </TooltipToggle>
            <IconButton
              icon="&#xE90f;"
              onClick={undo}
              disabled={!isUndoAvailable}
              />
            <IconButton
              icon="&#xE910;"
              onClick={redo}
              disabled={!isRedoAvailable}
              />
            <BorderButton
              label={translate (locale, 'actions.save')}
              onClick={saveHero}
              />
          </>}
          <IconButton
            icon="&#xE906;"
            onClick={openSettings}
            />
          <SettingsContainer {...props} close={closeSettings} />
          <IconButton
            icon="&#xE911;"
            onClick={toggleDevtools}
            />
        </NavigationBarRight>
      </NavigationBarWrapper>
      {Maybe.isJust (subtabs) && (
        <NavigationBarSubTabs
          {...props}
          tabs={Maybe.fromJust (subtabs)}
          />
      )}
    </>
  );
}

function toggleDevtools () {
  remote.getCurrentWindow ().webContents.toggleDevTools ();
}
