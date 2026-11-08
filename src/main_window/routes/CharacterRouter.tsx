import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import { useEffect, useState, type FC } from "react"
import type { CharacterIPCActions, CharacterIPCSelectors } from "../../shared/ipc.ts"
import {
  CharacterStateAndActionsContext,
  defaultCharacterStateAndActionsContextValue,
} from "../context/CharacterStateAndActions.ts"
import { executeStateAction, SharedCharacterState } from "../external.ts"
import type { CharacterRoutePath } from "../slices/routeSlice.ts"
import { Advantages } from "./characters/character/advantagesAndDisadvantages/Advantages.tsx"
import { Disadvantages } from "./characters/character/advantagesAndDisadvantages/Disadvantages.tsx"
import { Attributes } from "./characters/character/attributes/Attributes.tsx"
import { CombatTechniques } from "./characters/character/combatTechniques/CombatTechniques.tsx"
import { LiturgicalChants } from "./characters/character/liturgicalChants/LiturgicalChants.tsx"
import { ProfileOverview } from "./characters/character/profile/ProfileOverview.tsx"
import { Cultures } from "./characters/character/raceCultureProfession/Cultures.tsx"
import { Professions } from "./characters/character/raceCultureProfession/Professions.tsx"
import { Races } from "./characters/character/raceCultureProfession/Races.tsx"
import { Rules } from "./characters/character/rules/Rules.tsx"
import { Skills } from "./characters/character/skills/Skills.tsx"
import { SpecialAbilities } from "./characters/character/specialAbilities/SpecialAbilities.tsx"
import { Spells } from "./characters/character/spells/Spells.tsx"
import { CharacterNavigationBar } from "./nav/CharacterNavigationBar.tsx"

/**
 * Returns a page based on the currently selected route.
 */
export const CharacterRouter: FC<{ id: string; characterRoute: CharacterRoutePath }> = observer(
  props => {
    const [state, setState] = useState<CharacterIPCSelectors>(
      defaultCharacterStateAndActionsContextValue.state,
    )
    const [actions, setActions] = useState<CharacterIPCActions>(
      defaultCharacterStateAndActionsContextValue.actions,
    )

    useEffect(
      action(() => {
        setState(
          SharedCharacterState[props.id] ?? defaultCharacterStateAndActionsContextValue.state,
        )
        setActions(
          new Proxy(
            {},
            {
              get:
                (_, actionName) =>
                (...args: unknown[]) =>
                  executeStateAction(
                    props.id,
                    actionName as keyof CharacterIPCActions,
                    ...(args as Parameters<CharacterIPCActions[keyof CharacterIPCActions]>),
                  ),
            },
          ) as CharacterIPCActions,
        )
      }),
      [props.id, SharedCharacterState[props.id]],
    )

    return (
      <CharacterStateAndActionsContext.Provider value={{ state, actions }}>
        <CharacterNavigationBar />
        {(() => {
          switch (props.characterRoute) {
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
              return <Races />
            case "culture":
              return <Cultures />
            case "profession":
              return <Professions />

            case "attributes":
              return <Attributes />

            case "advantages":
              return <Advantages />
            case "disadvantages":
              return <Disadvantages />

            case "skills":
              return <Skills />
            case "combat_techniques":
              return <CombatTechniques />
            case "special_abilities":
              return <SpecialAbilities />
            case "spells":
              return <Spells />
            case "liturgical_chants":
              return <LiturgicalChants />

            case "equipment":
              return null
            case "hit_zone_armor":
              return null
            case "pets":
              return null
            default:
              return assertExhaustive(props.characterRoute)
          }
        })()}
      </CharacterStateAndActionsContext.Provider>
    )
  },
)
