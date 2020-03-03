import * as React from "react"
import { List } from "../../../Data/List"
import { fromJust, isJust, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { Culture } from "../../Models/Wiki/Culture"
import { Profession } from "../../Models/Wiki/Profession"
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant"
import { Race } from "../../Models/Wiki/Race"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { RCPOptionSelections } from "./RCPOptionSelections"

export interface RCPOptionSelectionsEnsureProps {
  hero: HeroModelRecord
  staticData: StaticDataRecord
  race: Maybe<Record<Race>>
  culture: Maybe<Record<Culture>>
  profession: Maybe<Record<Profession>>
  professionVariant: Maybe<Record<ProfessionVariant>>
  munfamiliar_spells: Maybe<List<Record<DropdownOption>>>
  close (): void
  setSelections (selections: SelectionsInterface): void
}

const HA = HeroModel.A

export const RCPOptionSelectionsEnsure: React.FC<RCPOptionSelectionsEnsureProps> = props => {
  const {
    staticData,
    hero,
    close,

    race,
    culture,
    profession,
    professionVariant,
    munfamiliar_spells,

    setSelections,
  } = props

  if (isJust (race) && isJust (culture) && isJust (profession)) {
    return (
      <RCPOptionSelections
        staticData={staticData}
        race={fromJust (race)}
        culture={fromJust (culture)}
        profession={fromJust (profession)}
        professionVariant={professionVariant}
        munfamiliar_spells={munfamiliar_spells}
        rules={HA.rules (hero)}
        close={close}
        setSelections={setSelections}
        />
    )
  }

  return null
}
