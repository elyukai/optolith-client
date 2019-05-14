import * as React from "react";
import { Maybe, maybeR } from "../../../Data/Maybe";
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
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
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
  l10n: L10nRecord
  mhero: Maybe<HeroModelRecord>
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
    const { id, l10n, mhero } = this.props
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

    const unwrapWithHero =
      (f: (hero: HeroModelRecord) => JSX.Element) =>
        maybeR (null) (f) (mhero)

    const VIEWS: { [K in TabId]: () => React.ReactNode } = {
      [TabId.Herolist]: () => <HerolistContainer l10n={l10n} />,
      [TabId.Grouplist]: () => <Grouplist />,
      [TabId.Wiki]: () => <WikiContainer locale={l10n} />,
      [TabId.Faq]: () => <HelpContainer l10n={l10n} />,
      [TabId.Imprint]: () => <Imprint l10n={l10n} />,
      [TabId.ThirdPartyLicenses]: () => <ThirdPartyLicenses />,
      [TabId.LastChanges]: () => <LastChanges />,

      [TabId.Profile]:
        () => unwrapWithHero (hero => <PersonalDataContainer l10n={l10n} hero={hero} />),
      [TabId.PersonalData]:
        () => unwrapWithHero (hero => <PersonalDataContainer l10n={l10n} hero={hero} />),
      [TabId.CharacterSheet]: () => <SheetsContainer locale={l10n} />,
      [TabId.Pact]: () => <PactContainer l10n={l10n} />,
      [TabId.Rules]:
        () => unwrapWithHero (hero => <RulesContainer l10n={l10n} hero={hero} />),

      [TabId.Races]: () => <RacesContainer l10n={l10n} />,
      [TabId.Cultures]: () => <CulturesContainer l10n={l10n} />,
      [TabId.Professions]: () => <ProfessionsContainer l10n={l10n} />,

      [TabId.Attributes]: () => <AttributesContainer l10n={l10n} />,

      [TabId.Advantages]:
        () => unwrapWithHero (hero => <AdvantagesContainer l10n={l10n} hero={hero} />),
      [TabId.Disadvantages]:
        () => unwrapWithHero (hero => <DisadvantagesContainer l10n={l10n} hero={hero} />),

      [TabId.Skills]: () => <SkillsContainer locale={l10n} />,
      [TabId.CombatTechniques]: () => <CombatTechniquesContainer l10n={l10n} />,
      [TabId.SpecialAbilities]: () => <SpecialAbilitiesContainer locale={l10n} />,
      [TabId.Spells]: () => <SpellsContainer locale={l10n} />,
      [TabId.LiturgicalChants]: () => <LiturgicalChantsContainer l10n={l10n} />,

      [TabId.Equipment]: () => <EquipmentContainer l10n={l10n} />,
      [TabId.ZoneArmor]: () => <HitZoneArmorsContainer l10n={l10n} />,
      [TabId.Pets]: () => <PetsContainer l10n={l10n} />,

      // master: <Master />
    }

    return VIEWS [id] ()
  }
}
