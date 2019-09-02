import { fnull, head, List, subscript } from "../../Data/List";
import { bindF, ensure, fromMaybe, listToMaybe, maybe, Maybe } from "../../Data/Maybe";
import { compare, dec } from "../../Data/Num";
import { Record } from "../../Data/Record";
import { HeroModel } from "../Models/Hero/HeroModel";
import { Sex } from "../Models/Hero/heroTypeHelpers";
import { isItem, Item } from "../Models/Hero/Item";
import { ActiveActivatable } from "../Models/View/ActiveActivatable";
import { BlessingCombined } from "../Models/View/BlessingCombined";
import { CantripCombined } from "../Models/View/CantripCombined";
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements";
import { CultureCombined } from "../Models/View/CultureCombined";
import { InactiveActivatable } from "../Models/View/InactiveActivatable";
import { LiturgicalChantWithRequirements } from "../Models/View/LiturgicalChantWithRequirements";
import { ProfessionCombined } from "../Models/View/ProfessionCombined";
import { RaceCombined } from "../Models/View/RaceCombined";
import { SkillWithRequirements } from "../Models/View/SkillWithRequirements";
import { SpellWithRequirements } from "../Models/View/SpellWithRequirements";
import { Blessing } from "../Models/Wiki/Blessing";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../Models/Wiki/L10n";
import { isLiturgicalChant, LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Profession } from "../Models/Wiki/Profession";
import { Race } from "../Models/Wiki/Race";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { isSpell, Spell } from "../Models/Wiki/Spell";
import { NameBySex } from "../Models/Wiki/sub/NameBySex";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { compareLocale, translate } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { comparingR, SortOptions } from "../Utilities/sortBy";
import { isNumber, isString } from "../Utilities/typeCheckUtils";
import { getLocaleAsProp, getSex } from "./stateSelectors";
import * as uiSettingsSelectors from "./uisettingsSelectors";

const compareName =
  (l10n: L10nRecord) => comparingR (HeroModel.AL.name) (compareLocale (l10n))

export const getHerolistSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getHerolistSortOrder,
  (l10n, sortOrder): SortOptions<HeroModel> =>
    sortOrder === "dateModified"
      ? [
          {
            compare: comparingR (pipe (HeroModel.A.dateModified, x => x .valueOf ()))
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
  (l10n, sortOrder): SortOptions<Race> =>
    sortOrder === "cost"
      ? [
          comparingR (Race.AL.ap) (compare),
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
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.ap))
                     (compare),
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.name))
                     (compareLocale (l10n)),
        ]
      : [
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.name))
                     (compareLocale (l10n)),
        ]
)

export const getCulturesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCulturesSortOrder,
  (l10n, sortOrder): SortOptions<Culture> =>
    sortOrder === "cost"
      ? [
          comparingR (Culture.AL.culturalPackageAdventurePoints) (compare),
          compareName (l10n),
        ]
      : [
          compareName (l10n),
        ]
)

export const getCulturesCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCulturesSortOrder,
  (l10n, sortOrder): SortOptions<CultureCombined> =>
    sortOrder === "cost"
      ? [
          comparingR (pipe (
                       CultureCombined.A.wikiEntry,
                       Culture.A.culturalPackageAdventurePoints
                     ))
                     (compare),
          comparingR (pipe (CultureCombined.A.wikiEntry, Culture.A.name))
                     (compareLocale (l10n)),
        ]
      : [
          comparingR (pipe (CultureCombined.A.wikiEntry, Culture.A.name))
                     (compareLocale (l10n)),
        ]
)

const getProfessionCombinedSourceKey =
  pipe (
    ProfessionCombined.A.wikiEntry,
    Profession.A.src,
    listToMaybe,
    maybe ("US25000") (SourceLink.A.id)
  )

const foldProfessionName =
  (sex: Sex) => pipe (Profession.AL.name, x => isString (x) ? x : NameBySex.A[sex] (x))

const foldProfessionSubName =
  (sex: Sex) =>
    pipe (Profession.AL.subname, maybe ("") (x => isString (x) ? x : NameBySex.A[sex] (x)))

const getPlainProfAP = (x: List<number> | number) => isNumber (x) ? x : fnull (x) ? 0 : head (x)

export const getProfessionsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (l10n, sort_order, msex) =>
    maybe<SortOptions<ProfessionCombined>>
      ([])
      ((sex: Sex): SortOptions<ProfessionCombined> =>
        sort_order === "cost"
          ? [
              comparingR (pipe (ProfessionCombined.A.mappedAP, getPlainProfAP))
                         (compare),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionName (sex)))
                         (compareLocale (l10n)),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionSubName (sex)))
                         (compareLocale (l10n)),
              comparingR (getProfessionCombinedSourceKey)
                         (compareLocale (l10n)),
            ]
          : [
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionName (sex)))
                         (compareLocale (l10n)),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionSubName (sex)))
                         (compareLocale (l10n)),
              comparingR (getProfessionCombinedSourceKey)
                         (compareLocale (l10n)),
            ])
      (msex)
)

const foldMaleProfessionName =
  pipe (Profession.AL.name, x => isString (x) ? x : NameBySex.A.m (x))

const foldMaleProfessionSubName =
  pipe (Profession.AL.subname, maybe ("") (x => isString (x) ? x : NameBySex.A.m (x)))

export const getWikiProfessionsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  (l10n): SortOptions<ProfessionCombined> =>
    [
      comparingR (pipe (ProfessionCombined.A.wikiEntry, foldMaleProfessionName))
                 (compareLocale (l10n)),
      comparingR (pipe (ProfessionCombined.A.wikiEntry, foldMaleProfessionSubName))
                 (compareLocale (l10n)),
      comparingR (getProfessionCombinedSourceKey)
                 (compareLocale (l10n)),
    ]
)

export const getSkillsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSkillsSortOrder,
  (l10n, sortOrder): SortOptions<SkillWithRequirements> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.ic))
                   (compare),
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.gr))
                   (compare),
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                 (compareLocale (l10n)),
    ]
  }
)

export const getCombatTechniquesSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  (l10n, sortOrder): SortOptions<CombatTechnique> => {
    if (sortOrder === "ic") {
      return [
        comparingR (CombatTechnique.A.ic) (compare),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (CombatTechnique.A.gr) (compare),
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
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.ic))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.gr))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                 (compareLocale (l10n)),
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
                     ActiveActivatable.AL.wikiEntry,
                     SpecialAbility.AL.gr,
                     dec,
                     subscript (translate (l10n) ("specialabilitygroups")),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        comparingR (pipe (ActiveActivatable.AL.wikiEntry, SpecialAbility.AL.name))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (ActiveActivatable.AL.wikiEntry, SpecialAbility.AL.name))
                 (compareLocale (l10n)),
    ]
  }
)

type ensureSpell = (x: Record<Spell | Cantrip>) => Maybe<Record<Spell>>

export const getSpellsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSpellsSortOrder,
  (l10n, sortOrder): SortOptions<SpellWithRequirements> => {
    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     SpellWithRequirements.A.wikiEntry,
                     Spell.A.property,
                     dec,
                     subscript (translate (l10n) ("propertylist")),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "ic") {
      return [
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.ic))
                   (compare),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     SpellWithRequirements.A.wikiEntry,
                     Spell.A.gr,
                     dec,
                     subscript (translate (l10n) ("spellgroups")),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                 (compareLocale (l10n)),
    ]
  }
)

type getSpellOrCantripFromCombined =
  (x: Record<SpellWithRequirements | CantripCombined>) =>
    Record<Spell> | Record<Cantrip>

const getSpellOrCantripFromCombined =
  (x: Record<SpellWithRequirements> | Record<CantripCombined>) =>
    SpellWithRequirements.is (x)
    ? SpellWithRequirements.A.wikiEntry (x)
    : CantripCombined.A.wikiEntry (x)

export const getSpellsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleAsProp,
  (l10n, sortOrder): SortOptions<SpellWithRequirements | CantripCombined> => {
    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.property,
                     dec,
                     subscript (translate (l10n) ("propertylist")),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.name
                   ))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "ic") {
      return [
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     ensure (isSpell) as ensureSpell,
                     maybe (0) (Spell.A.ic)
                   ))
                   (compare),
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.name
                   ))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     ensure (isSpell) as ensureSpell,
                     bindF (pipe (
                       Spell.A.gr,
                       dec,
                       subscript (translate (l10n) ("spellgroups"))
                     )),
                     fromMaybe (translate (l10n) ("cantrips"))
                   ))
                   (compareLocale (l10n)),
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.name
                   ))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (
                   getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                   Spell.AL.name
                 ))
                 (compareLocale (l10n)),
    ]
  }
)

export const getCantripsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  (l10n): SortOptions<CantripCombined> =>
    [ comparingR (pipe (CantripCombined.A.wikiEntry, Cantrip.A.name))
                 (compareLocale (l10n)) ]
)

type ensureChant = (x: Record<LiturgicalChant | Blessing>) => Maybe<Record<LiturgicalChant>>

export const getLiturgicalChantsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (l10n, sortOrder): SortOptions<LiturgicalChantWithRequirements> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.ic))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.gr))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                 (compareLocale (l10n)),
    ]
  }
)

type getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements | BlessingCombined>) =>
    Record<LiturgicalChant> | Record<Blessing>

const getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>) =>
    LiturgicalChantWithRequirements.is (x)
    ? LiturgicalChantWithRequirements.A.wikiEntry (x)
    : BlessingCombined.A.wikiEntry (x)

export const getLiturgicalChantsCombinedSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (l10n, sortOrder): SortOptions<LiturgicalChantWithRequirements | BlessingCombined> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     ensure (isLiturgicalChant) as ensureChant,
                     maybe (0) (LiturgicalChant.A.ic)
                   ))
                   (compare),
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     LiturgicalChant.AL.name
                   ))
                   (compareLocale (l10n)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     ensure (isLiturgicalChant) as ensureChant,
                     maybe (100) (LiturgicalChant.A.gr)
                   ))
                   (compare),
        comparingR (pipe (
                     getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                     LiturgicalChant.AL.name
                   ))
                   (compareLocale (l10n)),
      ]
    }

    return [
      comparingR (pipe (
                   getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                   LiturgicalChant.AL.name
                 ))
                 (compareLocale (l10n)),
    ]
  }
)

export const getBlessingsSortOptions = createMaybeSelector (
  getLocaleAsProp,
  (l10n): SortOptions<BlessingCombined> =>
    [ comparingR (pipe (BlessingCombined.A.wikiEntry, Blessing.A.name))
                 (compareLocale (l10n)) ]
)

type ensureItem = (x: Record<Item | ItemTemplate>) => Maybe<Record<Item>>

export const getEquipmentSortOptions = createMaybeSelector (
  getLocaleAsProp,
  uiSettingsSelectors.getEquipmentSortOrder,
  (l10n, sortOrder): SortOptions<ItemTemplate | Item> => {

    if (sortOrder === "groupname") {
      return [
        comparingR (pipe (
                     Item.AL.gr,
                     dec,
                     subscript (translate (l10n) ("itemgroups")),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "where") {
      return [
        comparingR (pipe (
                     ensure (isItem) as ensureItem,
                     bindF (Item.A.where),
                     fromMaybe ("")
                   ))
                   (compareLocale (l10n)),
        compareName (l10n),
      ]
    }
    else if (sortOrder === "weight") {
      return [
        {
          compare: comparingR (pipe (Item.AL.weight, fromMaybe (0)))
                              (compare),
          reverse: true,
        },
        compareName (l10n),
      ]
    }

    return [ compareName (l10n) ]
  }
)
