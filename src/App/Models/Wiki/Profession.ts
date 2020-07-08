import * as IntMap from "../../../Data/IntMap"
import * as List from "../../../Data/List"
import { translate } from "../../Utilities/I18n"
import { Profession } from "../Profession.gen"
import { StaticData } from "./WikiModel"

export { Profession }

export const getCustomProfession =
  (staticData: StaticData): Profession =>
    ({
      id: 0,
      name: translate (staticData) ("profession.ownprofession"),
      ap: 0,
      prerequisites: {
        activatable: List.empty,
        increasable: List.empty,
      },
      specialAbilities: List.empty,
      combatTechniques: IntMap.empty,
      skills: IntMap.empty,
      spells: IntMap.empty,
      liturgicalChants: IntMap.empty,
      blessings: List.empty,
      suggestedAdvantages: List.empty,
      suggestedDisadvantages: List.empty,
      unsuitableAdvantages: List.empty,
      unsuitableDisadvantages: List.empty,
      variants: IntMap.empty,
      gr: 0,
      subgr: 0,
      src: List.empty,
      errata: List.empty,
    })
