import * as React from 'react';
import { MainContent } from '../components/MainContent';
import { Page } from '../components/Page';
import { Scroll } from '../components/Scroll';
import { AdvantagesContainer } from '../containers/AdvantagesContainer';
import { AttributesContainer } from '../containers/AttributesContainer';
import { CombatTechniquesContainer } from '../containers/CombatTechniquesContainer';
import { CulturesContainer } from '../containers/Cultures';
import { DisadvantagesContainer } from '../containers/DisadvantagesContainer';
import { EquipmentContainer } from '../containers/EquipmentContainer';
import { HelpContainer } from '../containers/HelpContainer';
import { HerolistContainer } from '../containers/HerolistContainer';
import { HitZoneArmorsContainer } from '../containers/HitZoneArmorsContainer';
import { LiturgicalChantsContainer } from '../containers/LiturgicalChantsContainer';
import { PactContainer } from '../containers/PactContainer';
import { PersonalDataContainer } from '../containers/PersonalDataContainer';
import { PetsContainer } from '../containers/PetsContainer';
import { ProfessionsContainer } from '../containers/Professions';
import { RacesContainer } from '../containers/RacesContainer';
import { RulesContainer } from '../containers/RulesContainer';
import { SheetsContainer } from '../containers/SheetsContainer';
import { SkillsContainer } from '../containers/SkillsContainer';
import { SpecialAbilitiesContainer } from '../containers/SpecialAbilitiesContainer';
import { SpellsContainer } from '../containers/SpellsContainer';
import { WikiContainer } from '../containers/WikiContainer';
import { UIMessagesObject } from '../types/ui';
import { TabId } from '../utils/LocationUtils';
import { Imprint } from './about/Imprint';
import { LastChanges } from './about/LastChanges';
import { ThirdPartyLicenses } from './about/ThirdPartyLicenses';
import { Grouplist } from './grouplist/Grouplist';

export interface RouteProps {
  id: TabId;
  locale: UIMessagesObject;
  setTab (id: TabId): void;
}

export interface RouteState {
  hasError?: {
    error: Error;
    info: any;
  };
}

export class Route extends React.Component<RouteProps> {
  state: RouteState = {};

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info }}));
  }

  componentWillReceiveProps (nextProps: RouteProps) {
    if (nextProps.id !== this.props.id && typeof this.state.hasError === 'object') {
      this.setState (() => ({ hasError: undefined }));
    }
  }

  render (): React.ReactNode {
    const { id, locale, setTab } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <Page>
        <MainContent>
          <Scroll className="error-message">
            <h4>Error</h4>
            <p>{hasError.error.stack}</p>
            <h4>Component Stack</h4>
            <p>{hasError.info.componentStack}</p>
          </Scroll>
        </MainContent>
      </Page>;
    }

    const VIEWS = {
      herolist: <HerolistContainer locale={locale} />,
      grouplist: <Grouplist />,
      wiki: <WikiContainer locale={locale} />,
      faq: <HelpContainer locale={locale} />,
      imprint: <Imprint locale={locale} />,
      thirdPartyLicenses: <ThirdPartyLicenses />,
      lastChanges: <LastChanges />,

      profile: <PersonalDataContainer locale={locale} />,
      personalData: <PersonalDataContainer locale={locale} />,
      characterSheet: <SheetsContainer locale={locale} />,
      pact: <PactContainer locale={locale} />,
      rules: <RulesContainer locale={locale} />,

      races: <RacesContainer locale={locale} />,
      cultures:
        <CulturesContainer locale={locale} switchToProfessions={() => setTab ('professions')} />,
      professions: <ProfessionsContainer locale={locale} />,

      attributes: <AttributesContainer locale={locale} />,

      advantages: <AdvantagesContainer locale={locale} />,
      disadvantages: <DisadvantagesContainer locale={locale} />,

      skills: <SkillsContainer locale={locale} />,
      combatTechniques: <CombatTechniquesContainer locale={locale} />,
      specialAbilities: <SpecialAbilitiesContainer locale={locale} />,
      spells: <SpellsContainer locale={locale} />,
      liturgicalChants: <LiturgicalChantsContainer locale={locale} />,

      equipment: <EquipmentContainer locale={locale} />,
      zoneArmor: <HitZoneArmorsContainer locale={locale} />,
      pets: <PetsContainer locale={locale} />,

      // master: <Master />
    };

    return VIEWS[id] || undefined;
  }
}
