import { ident } from "../../Data/Function";
import { compare } from "../../Data/Int";
import { subscript } from "../../Data/List";
import { bindF, ensure, fromMaybe, listToMaybe, maybe, Maybe } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { HeroModel } from "../Models/Hero/HeroModel";
import { Sex } from "../Models/Hero/heroTypeHelpers";
import { isItem, Item } from "../Models/Hero/Item";
import { ActiveActivatable } from "../Models/View/ActiveActivatable";
import { BlessingCombined } from "../Models/View/BlessingCombined";
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements";
import { CultureCombined } from "../Models/View/CultureCombined";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { LiturgicalChantWithRequirements } from "../Models/View/LiturgicalChantWithRequirements";
import { isProfessionCombined, ProfessionCombined } from "../Models/View/ProfessionCombined";
import { RaceCombined } from "../Models/View/RaceCombined";
import { SkillCombined } from "../Models/View/SkillCombined";
import { isSpellCombined, SpellCombined } from "../Models/View/SpellCombined";
import { Blessing } from "../Models/Wiki/Blessing";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { isLiturgicalChant, LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Profession } from "../Models/Wiki/Profession";
import { Race } from "../Models/Wiki/Race";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { isSpell, Spell } from "../Models/Wiki/Spell";
import { NameBySex } from "../Models/Wiki/sub/NameBySex";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { compareLocale, translate } from "../Utilities/I18n";
import { pipe, pipe_ } from "../Utilities/pipe";
import { comparingR, SortOptions } from "../Utilities/sortBy";
import { isString } from "../Utilities/typeCheckUtils";
import { getLocaleAsProp, getSex } from "./stateSelectors";
import * as uiSettingsSelectors from "./uisettingsSelectors";

const compareName =
  (l10n: L10nRecord) => comparingR (HeroModel.A.name) (compareLocale (L10n.A_.id (l10n)))

export const getHerolistSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getHerolistSortOrder,
  (l10n, sortOrder): SortOptions<HeroModel> =>
    sortOrder === "datemodified"
      ? [
          {
            compare: comparingR (pipe (HeroModel.A_.dateModified, x => x .valueOf ()))
                                (compare),
            reverse: true,
          },
          compareName (l10n),
        ]
      : [
          compareName (l10n),
        ]
)

export const getRacesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getRacesSortOrder,
  (l10n, sortOrder): SortOptions<Race> | SortOptions<RaceCombined> =>
    sortOrder === "cost"
      ? [
          comparingR (Race.A.ap) (compare),
          compareName (l10n),
        ]
      : [
          compareName (l10n),
        ]
)

export const getRacesCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getRacesSortOrder,
  (l10n, sortOrder): SortOptions<RaceCombined> =>
    sortOrder === "cost"
      ? [
          comparingR (pipe (RaceCombined.A_.wikiEntry, Race.A_.ap))
                     (compare),
          comparingR (pipe (RaceCombined.A_.wikiEntry, Race.A_.name))
                     (compareLocale (L10n.A_.id (l10n))),
        ]
      : [
          comparingR (pipe (RaceCombined.A_.wikiEntry, Race.A_.name))
                     (compareLocale (L10n.A_.id (l10n))),
        ]
)

export const getCulturesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCulturesSortOrder,
  (l10n, sortOrder): SortOptions<Culture> | SortOptions<CultureCombined> =>
    sortOrder === "cost"
      ? [
          comparingR (Culture.A.culturalPackageAdventurePoints) (compare),
          compareName (l10n),
        ]
      : [
          compareName (l10n),
        ]
)

const getProfessionSourceKey =
  (e: Record<Profession> | Record<ProfessionCombined>): string =>
    pipe_ (
      e,
      x => isProfessionCombined (x) ? ProfessionCombined.A_.wikiEntry (x) : ident (x),
      Profession.A.src,
      listToMaybe,
      maybe ("US25000")
            (Profession.A.id)
    )

const foldProfessionName =
  (sex: Sex) => pipe (Profession.A.name, x => isString (x) ? x : NameBySex.A_[sex] (x))

const foldProfessionSubName =
  (sex: Sex) =>
    pipe (Profession.A.subname, maybe ("") (x => isString (x) ? x : NameBySex.A_[sex] (x)))

export const getProfessionsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (l10n, sortOrder, msex) =>
    maybe<SortOptions<Profession>>
      ([])
      ((sex: Sex): SortOptions<Profession> => {
        if (sortOrder === "cost") {
          return [
            comparingR (Profession.A.ap) (compare),
            comparingR (foldProfessionName (sex)) (compareLocale (L10n.A_.id (l10n))),
            comparingR (foldProfessionSubName (sex)) (compareLocale (L10n.A_.id (l10n))),
            comparingR (getProfessionSourceKey) (compareLocale (L10n.A_.id (l10n))),
          ]
        }

        return [
          comparingR (foldProfessionName (sex)) (compareLocale (L10n.A_.id (l10n))),
          comparingR (foldProfessionSubName (sex)) (compareLocale (L10n.A_.id (l10n))),
          comparingR (getProfessionSourceKey) (compareLocale (L10n.A_.id (l10n))),
        ]
      })
      (msex)
)

export const getProfessionsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (l10n, sortOrder, msex) =>
    maybe<SortOptions<ProfessionCombined>>
      ([])
      ((sex: Sex): SortOptions<ProfessionCombined> => {
        if (sortOrder === "cost") {
          return [
            comparingR (pipe (ProfessionCombined.A_.wikiEntry, Profession.A.ap))
                       (compare),
            comparingR (pipe (ProfessionCombined.A_.wikiEntry, foldProfessionName (sex)))
                       (compareLocale (L10n.A_.id (l10n))),
            comparingR (pipe (ProfessionCombined.A_.wikiEntry, foldProfessionSubName (sex)))
                       (compareLocale (L10n.A_.id (l10n))),
            comparingR (pipe (ProfessionCombined.A_.wikiEntry, getProfessionSourceKey))
                       (compareLocale (L10n.A_.id (l10n))),
          ]
        }

        return [
          comparingR (pipe (ProfessionCombined.A_.wikiEntry, foldProfessionName (sex)))
                     (compareLocale (L10n.A_.id (l10n))),
          comparingR (pipe (ProfessionCombined.A_.wikiEntry, foldProfessionSubName (sex)))
                     (compareLocale (L10n.A_.id (l10n))),
          comparingR (pipe (ProfessionCombined.A_.wikiEntry, getProfessionSourceKey))
                     (compareLocale (L10n.A_.id (l10n))),
        ]
      })
      (msex)
)

export const getSkillsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSkillsSortOrder,
  (l10n, sortOrder): SortOptions<Skill> => {
    if (sortOrder === "ic") {
      return [
        comparingR (Skill.A_.ic) (compare),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (Skill.A_.gr) (compare),
        compareName (l10n),
      ]
    }

    return [ compareName (l10n) ]
  }
)

export const getSkillsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSkillsSortOrder,
  (l10n, sortOrder): SortOptions<SkillCombined> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (SkillCombined.A_.wikiEntry, Skill.A_.ic))
                   (compare),
        comparingR (pipe (SkillCombined.A_.wikiEntry, Skill.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (SkillCombined.A_.wikiEntry, Skill.A_.gr))
                   (compare),
        comparingR (pipe (SkillCombined.A_.wikiEntry, Skill.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (SkillCombined.A_.wikiEntry, Skill.A_.name))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

export const getCombatTechniquesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  (l10n, sortOrder): SortOptions<CombatTechnique> => {
    if (sortOrder === "ic") {
      return [
        comparingR (CombatTechnique.A_.ic) (compare),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (CombatTechnique.A_.gr) (compare),
        compareName (l10n),
      ]
    }

    return [ compareName (l10n) ]
  }
)

export const getCombatTechniquesWithRequirementsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  (l10n, sortOrder) => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (CombatTechniqueWithRequirements.A_.wikiEntry, CombatTechnique.A_.ic))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A_.wikiEntry, CombatTechnique.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (CombatTechniqueWithRequirements.A_.wikiEntry, CombatTechnique.A_.gr))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A_.wikiEntry, CombatTechnique.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (CombatTechniqueWithRequirements.A_.wikiEntry, CombatTechnique.A_.name))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

type ActiveSpecialAbility = ActiveActivatable<SpecialAbility>
type InactiveSpecialAbility = InactiveActivatable<SpecialAbility>

export const getSpecialAbilitiesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSpecialAbilitiesSortOrder,
  (l10n, sortOrder): SortOptions<ActiveSpecialAbility | InactiveSpecialAbility> => {
    if (sortOrder === "groupname") {
      return [
        comparingR (pipe (
                     ActiveActivatable.A.wikiEntry,
                     SpecialAbility.A.gr,
                     subscript (translate (l10n) ("specialabilitygroups")),
                     fromMaybe ("")
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
        comparingR (pipe (ActiveActivatable.A.wikiEntry, SpecialAbility.A.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (ActiveActivatable.A.wikiEntry, SpecialAbility.A.name))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

type ensureSpell = (x: Record<Spell | Cantrip>) => Maybe<Record<Spell>>

export const getSpellsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleAsProp,
  (l10n, sortOrder): SortOptions<Spell | Cantrip> => {

    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     Spell.A.property,
                     subscript (translate (l10n) ("propertylist")),
                     fromMaybe ("")
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "ic") {
      return [
        comparingR (pipe (
                     ensure (isSpell) as ensureSpell,
                     maybe (0) (Spell.A_.ic)
                   ))
                   (compare),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     ensure (isSpell) as ensureSpell,
                     maybe (100) (Spell.A_.gr)
                   ))
                   (compare),
        compareName (l10n),
      ]
    }

    return [ compareName (l10n) ]
  }
)

type getSpellFromCombinedOrCantrip =
  (x: Record<SpellCombined | Cantrip>) => Record<Spell> | Record<Cantrip>

const getSpellFromCombinedOrCantrip =
  (x: Record<SpellCombined> | Record<Cantrip>) =>
    isSpellCombined (x) ? SpellCombined.A_.wikiEntry (x) : ident (x)

export const getSpellsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleAsProp,
  (l10n, sortOrder): SortOptions<SpellCombined | Cantrip> => {
    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     Spell.A.property,
                     subscript (translate (l10n) ("propertylist")),
                     fromMaybe ("")
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     Spell.A.name
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "ic") {
      return [
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     ensure (isSpell) as ensureSpell,
                     maybe (0) (Spell.A_.ic)
                   ))
                   (compare),
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     Spell.A.name
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     ensure (isSpell) as ensureSpell,
                     maybe (100) (Spell.A_.gr)
                   ))
                   (compare),
        comparingR (pipe (
                     getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                     Spell.A.name
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (
                   getSpellFromCombinedOrCantrip as getSpellFromCombinedOrCantrip,
                   Spell.A.name
                 ))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

type ensureChant = (x: Record<LiturgicalChant | Blessing>) => Maybe<Record<LiturgicalChant>>

export const getLiturgicalChantsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (l10n, sortOrder): SortOptions<LiturgicalChantWithRequirements> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A_.wikiEntry, LiturgicalChant.A_.ic))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A_.wikiEntry, LiturgicalChant.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A_.wikiEntry, LiturgicalChant.A_.gr))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A_.wikiEntry, LiturgicalChant.A_.name))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (LiturgicalChantWithRequirements.A_.wikiEntry, LiturgicalChant.A_.name))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

type getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements | BlessingCombined>) =>
    Record<LiturgicalChant> | Record<Blessing>

const getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>) =>
    LiturgicalChantWithRequirements.is (x)
    ? LiturgicalChantWithRequirements.A_.wikiEntry (x)
    : BlessingCombined.A_.wikiEntry (x)

export const getLiturgicalChantsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (l10n, sortOrder): SortOptions<LiturgicalChantWithRequirements | BlessingCombined> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     ensure (isLiturgicalChant) as ensureChant,
                     maybe (0) (LiturgicalChant.A_.ic)
                   ))
                   (compare),
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     LiturgicalChant.A.name
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     ensure (isLiturgicalChant) as ensureChant,
                     maybe (100) (LiturgicalChant.A_.gr)
                   ))
                   (compare),
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     LiturgicalChant.A.name
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
      ]
    }

    return [
      comparingR (pipe (
                   getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                   LiturgicalChant.A.name
                 ))
                 (compareLocale (L10n.A_.id (l10n))),
    ]
  }
)

export const getBlessingsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  (l10n): SortOptions<BlessingCombined> =>
    [ comparingR (pipe (BlessingCombined.A_.wikiEntry, Blessing.A_.name))
                 (compareLocale (L10n.A_.id (l10n))) ]
)

type ensureItem = (x: Record<Item | ItemTemplate>) => Maybe<Record<Item>>

export const getEquipmentSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getEquipmentSortOrder,
  (l10n, sortOrder): SortOptions<ItemTemplate | Item> => {

    if (sortOrder === "groupname") {
      return [
        comparingR (pipe (
                     Item.A.gr,
                     subscript (translate (l10n) ("itemgroups")),
                     fromMaybe ("")
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "where") {
      return [
        comparingR (pipe (
                     ensure (isItem) as ensureItem,
                     bindF (Item.A_.where),
                     fromMaybe ("")
                   ))
                   (compareLocale (L10n.A_.id (l10n))),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "weight") {
      return [
        {
          compare: comparingR (pipe (Item.A.weight, fromMaybe (0)))
                              (compare),
          reverse: true,
        },
        compareName (l10n),
      ]
    }

    return [ compareName (l10n) ]
  }
)
