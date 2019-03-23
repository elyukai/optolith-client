import * as React from 'react';
import { CombatTechniquesContainer } from '../App/Containers/CombatTechniquesContainer';
import { HelpContainer } from '../App/Containers/HelpContainer';
import { TabId } from '../App/Utils/LocationUtils';
import { MainContent } from '../components/MainContent';
import { Page } from '../components/Page';
import { Scroll } from '../components/Scroll';
import { AdvantagesContainer } from '../Containers/AdvantagesContainer';
import { AttributesContainer } from '../Containers/AttributesContainer';
import { CulturesContainer } from '../Containers/CulturesContainer';
import { DisadvantagesContainer } from '../Containers/DisadvantagesContainer';
import { EquipmentContainer } from '../Containers/EquipmentContainer';
import { HerolistContainer } from '../Containers/HerolistContainer';
import { HitZoneArmorsContainer } from '../Containers/HitZoneArmorsContainer';
import { LiturgicalChantsContainer } from '../Containers/LiturgicalChantsContainer';
import { PactContainer } from '../Containers/PactContainer';
import { PersonalDataContainer } from '../Containers/PersonalDataContainer';
import { PetsContainer } from '../Containers/PetsContainer';
import { ProfessionsContainer } from '../Containers/ProfessionsContainer';
import { RacesContainer } from '../Containers/RacesContainer';
import { RulesContainer } from '../Containers/RulesContainer';
import { SheetsContainer } from '../Containers/SheetsContainer';
import { SkillsContainer } from '../Containers/SkillsContainer';
import { SpecialAbilitiesContainer } from '../Containers/SpecialAbilitiesContainer';
import { SpellsContainer } from '../Containers/SpellsContainer';
import { WikiContainer } from '../Containers/WikiContainer';
import { UIMessagesObject } from '../types/ui';
import { Imprint } from './about/Imprint';
import { LastChanges } from './about/LastChanges';
import { ThirdPartyLicenses } from './about/ThirdPartyLicenses';
import { Grouplist } from './grouplist/Grouplist';

export interface RouteProps {
  id: TabId;
  locale: UIMessagesObject;
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
    const { id, locale } = this.props;
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
      cultures: <CulturesContainer locale={locale} />,
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
