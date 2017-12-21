import { remote } from 'electron';
import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { TooltipToggle } from '../../components/TooltipToggle';
import { SettingsContainer } from '../../containers/Settings';
import { SubTab } from '../../types/data';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { TabId } from '../../utils/LocationUtils';
import { ApTooltip } from './ApTooltip';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarSubTabs } from './NavigationBarSubTabs';
import { NavigationBarTabProps, NavigationBarTabs } from './NavigationBarTabs';
import { NavigationBarWrapper } from './NavigationBarWrapper';

export interface NavigationBarOwnProps {
  locale: UIMessages;
	platform: string;
  checkForUpdates(): void;
}

export interface NavigationBarStateProps {
  currentTab: TabId;
  avatar: string | undefined;
  isRedoAvailable: boolean;
  isRemovingEnabled: boolean;
  isUndoAvailable: boolean;
  isSettingsOpen: boolean;
  isHeroSection: boolean;
  tabs: NavigationBarTabProps[];
  subtabs: SubTab[] | undefined;
	total: number;
	spent: number;
	spentForAttributes: number;
	spentForSkills: number;
	spentForCombatTechniques: number;
	spentForSpells: number;
	spentForLiturgicalChants: number;
	spentForCantrips: number;
	spentForBlessings: number;
	spentForAdvantages: number;
	spentForMagicalAdvantages: number;
	spentForBlessedAdvantages: number;
	spentForDisadvantages: number;
	spentForMagicalDisadvantages: number;
	spentForBlessedDisadvantages: number;
	spentForSpecialAbilities: number;
	spentForEnergies: number;
	spentTotal: number;
	maximumForMagicalAdvantagesDisadvantages: number;
	isSpellcaster: boolean;
	isBlessedOne: boolean;
}

export interface NavigationBarDispatchProps {
  undo(): void;
  redo(): void;
  saveHero(): void;
  saveGroup(): void;
  setTab(id: TabId): void;
  openSettings(): void;
  closeSettings(): void;
}

export type NavigationBarProps = NavigationBarStateProps & NavigationBarDispatchProps & NavigationBarOwnProps;

export function NavigationBar(props: NavigationBarProps) {
  const { subtabs, openSettings, closeSettings, isHeroSection, avatar, locale, undo, isRedoAvailable, isUndoAvailable, redo, saveHero, setTab, spentTotal, total } = props;

  return (
    <>
      <NavigationBarWrapper>
        <NavigationBarLeft>
          {isHeroSection && <>
            <NavigationBarBack setTab={() => setTab('herolist')} />
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
              <Text className="collected-ap">{total - spentTotal} {_translate(locale, 'titlebar.view.adventurepoints')}</Text>
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
              label={_translate(locale, 'actions.save')}
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
      {subtabs && (
        <NavigationBarSubTabs
          {...props}
          tabs={subtabs}
          />
      )}
    </>
  );
}

function toggleDevtools() {
  remote.getCurrentWindow().webContents.toggleDevTools();
}
