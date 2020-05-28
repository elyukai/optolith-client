import * as React from "react"
import { Maybe, maybe } from "../../../Data/Maybe"
import { AdvantagesContainer } from "../../Containers/AdvantagesContainer"
import { AttributesContainer } from "../../Containers/AttributesContainer"
import { CombatTechniquesContainer } from "../../Containers/CombatTechniquesContainer"
import { CulturesContainer } from "../../Containers/CulturesContainer"
import { DisadvantagesContainer } from "../../Containers/DisadvantagesContainer"
import { EquipmentContainer } from "../../Containers/EquipmentContainer"
import { HelpContainer } from "../../Containers/HelpContainer"
import { HerolistContainer } from "../../Containers/HerolistContainer"
import { HitZoneArmorsContainer } from "../../Containers/HitZoneArmorsContainer"
import { LiturgicalChantsContainer } from "../../Containers/LiturgicalChantsContainer"
import { PactContainer } from "../../Containers/PactContainer"
import { PersonalDataContainer } from "../../Containers/PersonalDataContainer"
import { PetsContainer } from "../../Containers/PetsContainer"
import { ProfessionsContainer } from "../../Containers/ProfessionsContainer"
import { RacesContainer } from "../../Containers/RacesContainer"
import { RulesContainer } from "../../Containers/RulesContainer"
import { SheetsContainer } from "../../Containers/SheetsContainer"
import { SkillsContainer } from "../../Containers/SkillsContainer"
import { SpecialAbilitiesContainer } from "../../Containers/SpecialAbilitiesContainer"
import { SpellsContainer } from "../../Containers/SpellsContainer"
import { WikiContainer } from "../../Containers/WikiContainer"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { TabId } from "../../Utilities/LocationUtils"
import { Imprint } from "../About/Imprint"
import { LastChanges } from "../About/LastChanges"
import { ThirdPartyLicenses } from "../About/ThirdPartyLicenses"
import { Grouplist } from "../Groups/Grouplist"
import { MainContent } from "../Universal/MainContent"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"

interface Props {
  id: TabId
  staticData: StaticDataRecord
  mhero: Maybe<HeroModelRecord>
}

interface State {
  hasError?: {
    error: Error
    info: any
  }
}

export class Router extends React.Component<Props> {
  state: State = {}

  componentDidCatch (error: any, info: any) {
    this.setState (() => ({ hasError: { error, info } }))
  }

  render (): React.ReactNode {
    const { id, staticData, mhero } = this.props
    const { hasError } = this.state

    if (typeof hasError === "object") {
      return (
        <Page>
          <MainContent>
            <Scroll className="error-message">
              <h4>{"Error"}</h4>
              <p>{hasError.error.stack}</p>
              <h4>{"Component Stack"}</h4>
              <p>{hasError.info.componentStack}</p>
            </Scroll>
          </MainContent>
        </Page>
      )
    }

    const unwrapWithHero =
      (f: (hero: HeroModelRecord) => JSX.Element) =>
        maybe (null as React.ReactNode) (f) (mhero)

    const VIEWS: { [K in TabId]: () => React.ReactNode } = {
      [TabId.Herolist]: () => <HerolistContainer staticData={staticData} />,
      [TabId.Grouplist]: () => <Grouplist />,
      [TabId.Wiki]: () => <WikiContainer staticData={staticData} />,
      [TabId.Faq]: () => <HelpContainer staticData={staticData} />,
      [TabId.Imprint]: () => <Imprint staticData={staticData} />,
      [TabId.ThirdPartyLicenses]: () => <ThirdPartyLicenses />,
      [TabId.LastChanges]: () => <LastChanges staticData={staticData} />,

      [TabId.Profile]:
        () => unwrapWithHero (hero => (
                               <PersonalDataContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.PersonalData]:
        () => unwrapWithHero (hero => (
                               <PersonalDataContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.CharacterSheet]:
        () => unwrapWithHero (hero => (
                               <SheetsContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Pact]:
        () => unwrapWithHero (hero => (
                               <PactContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Rules]:
        () => unwrapWithHero (hero => (
                               <RulesContainer staticData={staticData} hero={hero} />
                             )),

      [TabId.Races]:
        () => unwrapWithHero (hero => (
                               <RacesContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Cultures]:
        () => unwrapWithHero (hero => (
                               <CulturesContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Professions]:
        () => unwrapWithHero (hero => (
                               <ProfessionsContainer staticData={staticData} hero={hero} />
                             )),

      [TabId.Attributes]:
        () => unwrapWithHero (hero => (
                               <AttributesContainer staticData={staticData} hero={hero} />
                             )),

      [TabId.Advantages]:
        () => unwrapWithHero (hero => (
                               <AdvantagesContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Disadvantages]:
        () => unwrapWithHero (hero => (
                               <DisadvantagesContainer staticData={staticData} hero={hero} />
                             )),

      [TabId.Skills]:
        () => unwrapWithHero (hero => (
                               <SkillsContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.CombatTechniques]:
        () => unwrapWithHero (hero => (
                               <CombatTechniquesContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.SpecialAbilities]:
        () => unwrapWithHero (hero => (
                               <SpecialAbilitiesContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Spells]:
        () => unwrapWithHero (hero => (
                               <SpellsContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.LiturgicalChants]:
        () => unwrapWithHero (hero => (
                               <LiturgicalChantsContainer staticData={staticData} hero={hero} />
                             )),

      [TabId.Equipment]:
        () => unwrapWithHero (hero => (
                               <EquipmentContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.ZoneArmor]:
        () => unwrapWithHero (hero => (
                               <HitZoneArmorsContainer staticData={staticData} hero={hero} />
                             )),
      [TabId.Pets]: () => <PetsContainer staticData={staticData} />,

      // master: <Master />
    }

    return VIEWS [id] ()
  }
}
