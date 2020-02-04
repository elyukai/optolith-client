import * as React from "react";
import { List } from "../../../Data/List";
import { fromJust, isJust, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Selections as SelectionsInterface } from "../../Models/Hero/heroTypeHelpers";
import { DropdownOption } from "../../Models/View/DropdownOption";
import { Culture } from "../../Models/Wiki/Culture";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Profession } from "../../Models/Wiki/Profession";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { RCPOptionSelections } from "./RCPOptionSelections";

export interface RCPOptionSelectionsEnsureProps {
  hero: HeroModelRecord
  l10n: L10nRecord
  wiki: WikiModelRecord
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
    l10n,
    hero,
    close,

    race,
    culture,
    profession,
    professionVariant,
    wiki,
    munfamiliar_spells,

    setSelections,
  } = props

  if (isJust (race) && isJust (culture) && isJust (profession)) {
    return (
      <RCPOptionSelections
        l10n={l10n}
        race={fromJust (race)}
        culture={fromJust (culture)}
        profession={fromJust (profession)}
        professionVariant={professionVariant}
        wiki={wiki}
        munfamiliar_spells={munfamiliar_spells}
        rules={HA.rules (hero)}
        close={close}
        setSelections={setSelections}
        />
    )
  }

  return null
}
