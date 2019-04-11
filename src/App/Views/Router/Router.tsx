import * as React from "react";
import { AdvantagesContainer } from "../../Containers/AdvantagesContainer";
import { AttributesContainer } from "../../Containers/AttributesContainer";
import { CombatTechniquesContainer } from "../../Containers/CombatTechniquesContainer";
import { CulturesContainer } from "../../Containers/CulturesContainer";
import { DisadvantagesContainer } from "../../Containers/DisadvantagesContainer";
import { EquipmentContainer } from "../../Containers/EquipmentContainer";
import { HelpContainer } from "../../Containers/HelpContainer";
import { HerolistContainer } from "../../Containers/HerolistContainer";
import { HitZoneArmorsContainer } from "../../Containers/HitZoneArmorsContainer";
import { LiturgicalChantsContainer } from "../../Containers/LiturgicalChantsContainer";
import { PactContainer } from "../../Containers/PactContainer";
import { PersonalDataContainer } from "../../Containers/PersonalDataContainer";
import { PetsContainer } from "../../Containers/PetsContainer";
import { ProfessionsContainer } from "../../Containers/ProfessionsContainer";
import { RacesContainer } from "../../Containers/RacesContainer";
import { RulesContainer } from "../../Containers/RulesContainer";
import { SheetsContainer } from "../../Containers/SheetsContainer";
import { SkillsContainer } from "../../Containers/SkillsContainer";
import { SpecialAbilitiesContainer } from "../../Containers/SpecialAbilitiesContainer";
import { SpellsContainer } from "../../Containers/SpellsContainer";
import { WikiContainer } from "../../Containers/WikiContainer";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { TabId } from "../../Utilities/LocationUtils";
import { Imprint } from "../About/Imprint";
import { LastChanges } from "../About/LastChanges";
import { ThirdPartyLicenses } from "../About/ThirdPartyLicenses";
import { Grouplist } from "../Groups/Grouplist";
import { MainContent } from "../Universal/MainContent";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";

export interface RouterProps {
  id: TabId
  locale: L10nRecord
}

export interface RouterState {
  hasError?: {
    error: Error;
    info: any;
  }
}

export class Router extends React.Component<RouterProps> {
  state: RouterState = {}

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info }}))
  }

  componentWillReceiveProps (nextProps: RouterProps) {
    if (nextProps.id !== this.props.id && typeof this.state.hasError === "object") {
      this.setState (() => ({ hasError: undefined }))
    }
  }

  render (): React.ReactNode {
    const { id, locale } = this.props
    const { hasError } = this.state

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
      </Page>
    }

    const VIEWS: { [K in TabId]: JSX.Element } = {
      [TabId.Herolist]: <HerolistContainer l10n={locale} />,
      [TabId.Grouplist]: <Grouplist />,
      [TabId.Wiki]: <WikiContainer locale={locale} />,
      [TabId.Faq]: <HelpContainer locale={locale} />,
      [TabId.Imprint]: <Imprint locale={locale} />,
      [TabId.ThirdPartyLicenses]: <ThirdPartyLicenses />,
      [TabId.LastChanges]: <LastChanges />,

      [TabId.Profile]: <PersonalDataContainer locale={locale} />,
      [TabId.PersonalData]: <PersonalDataContainer locale={locale} />,
      [TabId.CharacterSheet]: <SheetsContainer locale={locale} />,
      [TabId.Pact]: <PactContainer locale={locale} />,
      [TabId.Rules]: <RulesContainer locale={locale} />,

      [TabId.Races]: <RacesContainer locale={locale} />,
      [TabId.Cultures]: <CulturesContainer locale={locale} />,
      [TabId.Professions]: <ProfessionsContainer locale={locale} />,

      [TabId.Attributes]: <AttributesContainer locale={locale} />,

      [TabId.Advantages]: <AdvantagesContainer locale={locale} />,
      [TabId.Disadvantages]: <DisadvantagesContainer locale={locale} />,

      [TabId.Skills]: <SkillsContainer locale={locale} />,
      [TabId.CombatTechniques]: <CombatTechniquesContainer locale={locale} />,
      [TabId.SpecialAbilities]: <SpecialAbilitiesContainer locale={locale} />,
      [TabId.Spells]: <SpellsContainer locale={locale} />,
      [TabId.LiturgicalChants]: <LiturgicalChantsContainer locale={locale} />,

      [TabId.Equipment]: <EquipmentContainer locale={locale} />,
      [TabId.ZoneArmor]: <HitZoneArmorsContainer locale={locale} />,
      [TabId.Pets]: <PetsContainer locale={locale} />,

      // master: <Master />
    }

    return VIEWS [id] !== null ? VIEWS [id] : undefined
  }
}
