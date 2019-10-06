import { OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Advantage } from "./Advantage";
import { Attribute } from "./Attribute";
import { Blessing } from "./Blessing";
import { Book } from "./Book";
import { Cantrip } from "./Cantrip";
import { CombatTechnique } from "./CombatTechnique";
import { Culture } from "./Culture";
import { Disadvantage } from "./Disadvantage";
import { ExperienceLevel } from "./ExperienceLevel";
import { ItemTemplate } from "./ItemTemplate";
import { LiturgicalChant } from "./LiturgicalChant";
import { Profession } from "./Profession";
import { ProfessionVariant } from "./ProfessionVariant";
import { Race } from "./Race";
import { RaceVariant } from "./RaceVariant";
import { Skill } from "./Skill";
import { SpecialAbility } from "./SpecialAbility";
import { Spell } from "./Spell";

export type WikiModelRecord = Record<WikiModel>

export interface WikiModel {
  "@@name": "Wiki"
  books: OrderedMap<string, Record<Book>>
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>
  races: OrderedMap<string, Record<Race>>
  raceVariants: OrderedMap<string, Record<RaceVariant>>
  cultures: OrderedMap<string, Record<Culture>>
  professions: OrderedMap<string, Record<Profession>>
  professionVariants: OrderedMap<string, Record<ProfessionVariant>>
  attributes: OrderedMap<string, Record<Attribute>>
  advantages: OrderedMap<string, Record<Advantage>>
  disadvantages: OrderedMap<string, Record<Disadvantage>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
  skills: OrderedMap<string, Record<Skill>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  spells: OrderedMap<string, Record<Spell>>
  cantrips: OrderedMap<string, Record<Cantrip>>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  blessings: OrderedMap<string, Record<Blessing>>
  itemTemplates: OrderedMap<string, Record<ItemTemplate>>
}

export const WikiModel =
  fromDefault ("Wiki")
              <WikiModel> ({
                books: OrderedMap.empty,
                experienceLevels: OrderedMap.empty,
                races: OrderedMap.empty,
                raceVariants: OrderedMap.empty,
                cultures: OrderedMap.empty,
                professions: OrderedMap.empty,
                professionVariants: OrderedMap.empty,
                attributes: OrderedMap.empty,
                advantages: OrderedMap.empty,
                disadvantages: OrderedMap.empty,
                specialAbilities: OrderedMap.empty,
                skills: OrderedMap.empty,
                combatTechniques: OrderedMap.empty,
                spells: OrderedMap.empty,
                cantrips: OrderedMap.empty,
                liturgicalChants: OrderedMap.empty,
                blessings: OrderedMap.empty,
                itemTemplates: OrderedMap.empty,
              })

export const WikiModelL = makeLenses (WikiModel)
