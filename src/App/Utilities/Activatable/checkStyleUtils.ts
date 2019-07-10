import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import * as Wiki from "../../Models/Wiki/wikiTypeHelpers";

const { gr } = SpecialAbility.AL

export const isCombatStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && [9, 10] .includes (gr (e))

export const isMagicalStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === 13

export const isBlessedStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === 25

export const isSkillStyleSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && gr (e) === 33

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special
 * ability.
 * @param entry The instance.
 */
export const isExtendedSpecialAbility =
  (e: Wiki.EntryWithCategory) =>
    SpecialAbility.is (e) && [11, 14, 26, 34] .includes (gr (e))
