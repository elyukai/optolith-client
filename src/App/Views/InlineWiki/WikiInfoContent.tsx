import * as React from "react";
import { List } from "../../../Data/List";
import { bind, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Culture } from "../../Models/Wiki/Culture";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Entry } from "../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { isItemTemplateFromMixed } from "../../Utilities/WikiUtils";
import { Aside } from "../Universal/Aside";
import { WikiActivatableInfo } from "./WikiActivatableInfo";
import { WikiBlessingInfo } from "./WikiBlessingInfo";
import { WikiCantripInfo } from "./WikiCantripInfo";
import { WikiCombatTechniqueInfo } from "./WikiCombatTechniqueInfo";
import { WikiCultureInfo } from "./WikiCultureInfo";
import { WikiEquipmentInfo } from "./WikiEquipmentInfo";
import { WikiInfoEmpty } from "./WikiInfoEmpty";
import { WikiLiturgicalChantInfo } from "./WikiLiturgicalChantInfo";
import { WikiProfessionInfo } from "./WikiProfessionInfo";
import { WikiRaceInfo } from "./WikiRaceInfo";
import { WikiSkillInfo } from "./WikiSkillInfo";
import { WikiSpellInfo } from "./WikiSpellInfo";

export interface WikiInfoContentOwnProps {
  currentId: Maybe<string>
  l10n: L10nRecord
  noWrapper?: boolean
}

export interface WikiInfoContentStateProps {
  attributes: OrderedMap<string, Record<Attribute>>
  advantages: OrderedMap<string, Record<Advantage>>
  books: OrderedMap<string, Record<Book>>
  blessings: OrderedMap<string, Record<Blessing>>
  cantrips: OrderedMap<string, Record<Cantrip>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  cultures: OrderedMap<string, Record<Culture>>
  derivedCharacteristics: OrderedMap<DCIds, Record<DerivedCharacteristic>>
  hero: HeroModelRecord
  languages: Record<SpecialAbility>
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  list: List<Entry>
  professionVariants: OrderedMap<string, Record<ProfessionVariant>>
  raceVariants: OrderedMap<string, Record<RaceVariant>>
  races: OrderedMap<string, Record<Race>>
  scripts: SpecialAbility
  sex: Maybe<Sex>
  skills: OrderedMap<string, Record<Skill>>
  spellExtensions: Maybe<Record<SpecialAbility>>
  spells: OrderedMap<string, Record<Spell>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
  templates: OrderedMap<string, Record<ItemTemplate>>
  wiki: WikiModelRecord
}

export interface WikiInfoContentDispatchProps { }

export type WikiInfoContentProps =
  WikiInfoContentStateProps
  & WikiInfoContentDispatchProps
  & WikiInfoContentOwnProps

export function WikiInfoContent (props: WikiInfoContentProps) {
  const { currentId: mid, list, noWrapper } = props

  const currentObject = bind (mid) (id => find () (list)) list.find (e => mid === e.id)

  let currentElement: JSX.Element | null

  if (typeof currentObject === "object") {
    if (isItemTemplateFromMixed (currentObject)) {
      currentElement = <WikiEquipmentInfo {...props} currentObject={currentObject} />
    }

    const isCategory = Skill.AL.category (currentObject)

    else if () {
      case Categories.ADVANTAGES:
      case Categories.DISADVANTAGES:
      case Categories.SPECIAL_ABILITIES:
        currentElement = <WikiActivatableInfo {...props} x={currentObject} />
        break
      case Categories.BLESSINGS:
        currentElement = <WikiBlessingInfo {...props} x={currentObject} />
        break
      case Categories.CANTRIPS:
        currentElement = <WikiCantripInfo {...props} currentObject={currentObject} />
        break
      case Categories.COMBAT_TECHNIQUES:
        currentElement = <WikiCombatTechniqueInfo {...props} currentObject={currentObject} />
        break
      case Categories.CULTURES:
        currentElement = <WikiCultureInfo {...props} currentObject={currentObject} />
        break
      case Categories.LITURGIES:
        currentElement = <WikiLiturgicalChantInfo {...props} currentObject={currentObject} />
        break
      case Categories.PROFESSIONS:
        currentElement = <WikiProfessionInfo {...props} currentObject={currentObject} />
        break
      case Categories.RACES:
        currentElement = <WikiRaceInfo {...props} currentObject={currentObject} />
        break
      case Categories.SPELLS:
        currentElement = <WikiSpellInfo {...props} currentObject={currentObject} />
        break
      case Categories.TALENTS:
        currentElement = <WikiSkillInfo {...props} currentObject={currentObject} />
        break
    }
  }

  return noWrapper ? (currentElement || <WikiInfoEmpty />) : (
    <Aside>
      {currentElement || <WikiInfoEmpty />}
    </Aside>
  )
}
