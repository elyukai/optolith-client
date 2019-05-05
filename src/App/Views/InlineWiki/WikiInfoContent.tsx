import * as React from "react";
import { equals } from "../../../Data/Eq";
import { find, List } from "../../../Data/List";
import { bind, fromJust, isJust, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { Item } from "../../Models/Hero/Item";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Culture } from "../../Models/Wiki/Culture";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { Profession } from "../../Models/Wiki/Profession";
import { ProfessionVariant } from "../../Models/Wiki/ProfessionVariant";
import { Race } from "../../Models/Wiki/Race";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Entry } from "../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { pipe } from "../../Utilities/pipe";
import { WikiActivatableInfo } from "./WikiActivatableInfo";
import { WikiBlessingInfo } from "./WikiBlessingInfo";
import { WikiCantripInfo } from "./WikiCantripInfo";
import { WikiCombatTechniqueInfo } from "./WikiCombatTechniqueInfo";
import { WikiCultureInfo } from "./WikiCultureInfo";
import { WikiEquipmentInfo } from "./WikiEquipmentInfo";
import { WikiInfoContentWrapper } from "./WikiInfoContentWrapper";
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
  derivedCharacteristics: Maybe<OrderedMap<DCIds, Record<DerivedCharacteristic>>>
  hero: Maybe<HeroModelRecord>
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
  const { currentId: mid, list } = props

  const mx = bind (mid) (id => find (pipe (Advantage.AL.id, equals (id))) (list))

  if (isJust (mx)) {
    const x = fromJust (mx)

    if (Item.is (x) || ItemTemplate.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiEquipmentInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Advantage.is (x) || Disadvantage.is (x) || SpecialAbility.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiActivatableInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Blessing.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiBlessingInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Cantrip.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCantripInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (CombatTechnique.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCombatTechniqueInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Culture.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiCultureInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (LiturgicalChant.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiLiturgicalChantInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Profession.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiProfessionInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Race.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiRaceInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Spell.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiSpellInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }

    if (Skill.is (x)) {
      return <WikiInfoContentWrapper {...props}>
        <WikiSkillInfo {...props} x={x} />
      </WikiInfoContentWrapper>
    }
  }

  return <WikiInfoContentWrapper {...props} />
}
