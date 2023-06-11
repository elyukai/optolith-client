import { FC } from "react"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { selectRoute } from "../slices/routeSlice.ts"
import "./Router.scss"
import { Imprint } from "./about/Imprint.tsx"
import { LastChanges } from "./about/LastChanges.tsx"
import { ThirdPartyLicenses } from "./about/ThirdPartyLicenses.tsx"
import { Attributes } from "./characters/character/attributes/Attributes.tsx"

export const Router: FC = () => {
  const route = useAppSelector(selectRoute)

  switch (route) {
    case "characters": return null // <HerolistContainer staticData={staticData} />,
    case "groups": return null // <Grouplist />,
    case "library": return null // <WikiContainer staticData={staticData} />,
    case "faq": return null // <HelpContainer staticData={staticData} />,

    case "imprint": return <Imprint />
    case "third_party_licenses": return <ThirdPartyLicenses />
    case "last_changes": return <LastChanges />

    case "profile": return null // unwrapWithHero(hero => ( <PersonalDataContainer staticData={staticData} hero={hero} /> )),
    case "personal_data": return null // unwrapWithHero(hero => ( <PersonalDataContainer staticData={staticData} hero={hero} /> )),
    case "character_sheet": return null // unwrapWithHero(hero => ( <SheetsContainer staticData={staticData} hero={hero} /> )),
    case "pact": return null // unwrapWithHero(hero => ( <PactContainer staticData={staticData} hero={hero} /> )),
    case "rules": return null // unwrapWithHero(hero => ( <RulesContainer staticData={staticData} hero={hero} /> )),

    case "race": return null // unwrapWithHero(hero => ( <RacesContainer staticData={staticData} hero={hero} /> )),
    case "culture": return null // unwrapWithHero(hero => ( <CulturesContainer staticData={staticData} hero={hero} /> )),
    case "profession": return null // unwrapWithHero(hero => ( <ProfessionsContainer staticData={staticData} hero={hero} /> )),

    case "attributes": return <Attributes /> // unwrapWithHero(hero => ( <AttributesContainer staticData={staticData} hero={hero} /> )),

    case "advantages": return null // unwrapWithHero(hero => ( <AdvantagesContainer staticData={staticData} hero={hero} /> )),
    case "disadvantages": return null // unwrapWithHero(hero => ( <DisadvantagesContainer staticData={staticData} hero={hero} /> )),

    case "skills": return null // unwrapWithHero(hero => ( <SkillsContainer staticData={staticData} hero={hero} /> )),
    case "combat_techniques": return null // unwrapWithHero(hero => ( <CombatTechniquesContainer staticData={staticData} hero={hero} /> )),
    case "special_abilities": return null // unwrapWithHero(hero => ( <SpecialAbilitiesContainer staticData={staticData} hero={hero} /> )),
    case "spells": return null // unwrapWithHero(hero => ( <SpellsContainer staticData={staticData} hero={hero} /> )),
    case "liturgical_chants": return null // unwrapWithHero(hero => ( <LiturgicalChantsContainer staticData={staticData} hero={hero} /> )),

    case "equipment": return null // unwrapWithHero(hero => ( <EquipmentContainer staticData={staticData} hero={hero} /> )),
    case "hit_zone_armor": return null // unwrapWithHero(hero => ( <HitZoneArmorsContainer staticData={staticData} hero={hero} /> )),
    case "pets": return null // <PetsContainer staticData={staticData} />,

    default: assertExhaustive(route)
  }
}
