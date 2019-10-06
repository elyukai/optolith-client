import { SpecialAbilityGroup } from "../../Constants/Groups";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import * as Wiki from "../../Models/Wiki/wikiTypeHelpers";

const { gr } = SpecialAbility.AL

export const isCombatStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e)
    && [SpecialAbilityGroup.CombatStylesArmed, SpecialAbilityGroup.CombatStylesUnarmed]
      .includes (gr (e))

export const isMagicalStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === SpecialAbilityGroup.MagicalStyles

export const isBlessedStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === SpecialAbilityGroup.BlessedStyles

export const isSkillStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === SpecialAbilityGroup.SkillStyles

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special
 * ability.
 * @param entry The instance.
 */
export const isExtendedSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e)
    && [
      SpecialAbilityGroup.CombatExtended,
      SpecialAbilityGroup.MagicalExtended,
      SpecialAbilityGroup.KarmaExtended,
      SpecialAbilityGroup.SkillExtended,
    ] .includes (gr (e))
