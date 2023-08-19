import { FC } from "react"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { useAppSelector } from "../hooks/redux.ts"
import { selectRoute } from "../slices/routeSlice.ts"
import { Imprint } from "./about/Imprint.tsx"
import { LastChanges } from "./about/LastChanges.tsx"
import { ThirdPartyLicenses } from "./about/ThirdPartyLicenses.tsx"
import { Characters } from "./characters/Characters.tsx"
import { Attributes } from "./characters/character/attributes/Attributes.tsx"
import { CombatTechniques } from "./characters/character/combatTechniques/CombatTechniques.tsx"
import { ProfileOverview } from "./characters/character/profile/ProfileOverview.tsx"
import { Rules } from "./characters/character/rules/Rules.tsx"
import { Skills } from "./characters/character/skills/Skills.tsx"

export const Router: FC = () => {
  const route = useAppSelector(selectRoute)

  switch (route[0]) {
    case "characters":
      return (() => {
        switch (route[2]) {
          case undefined:
            return <Characters />
          case "profile":
            return <ProfileOverview />
          case "personal_data":
            return null
          case "character_sheet":
            return null
          case "pact":
            return null
          case "rules":
            return <Rules />

          case "race":
            return null
          case "culture":
            return null
          case "profession":
            return null

          case "attributes":
            return <Attributes />

          case "advantages":
            return null
          case "disadvantages":
            return null

          case "skills":
            return <Skills />
          case "combat_techniques":
            return <CombatTechniques />
          case "special_abilities":
            return null
          case "spells":
            return null
          case "liturgical_chants":
            return null

          case "equipment":
            return null
          case "hit_zone_armor":
            return null
          case "pets":
            return null
          default:
            assertExhaustive(route)
        }
      })()

    case "groups":
      return null // <Grouplist />,
    case "library":
      return null // <WikiContainer staticData={staticData} />,
    case "faq":
      return null // <HelpContainer staticData={staticData} />,

    case "imprint":
      return <Imprint />
    case "third_party_licenses":
      return <ThirdPartyLicenses />
    case "last_changes":
      return <LastChanges />

    default:
      assertExhaustive(route)
  }
}
