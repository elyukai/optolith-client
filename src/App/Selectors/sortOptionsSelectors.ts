import { fnull, head, List } from "../../Data/List"
import { bindF, ensure, fromMaybe, listToMaybe, maybe, Maybe } from "../../Data/Maybe"
import { compare } from "../../Data/Num"
import { lookupF } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { Sex } from "../Models/Hero/heroTypeHelpers"
import { isItem, Item } from "../Models/Hero/Item"
import { NumIdName } from "../Models/NumIdName"
import { ActiveActivatable } from "../Models/View/ActiveActivatable"
import { BlessingCombined } from "../Models/View/BlessingCombined"
import { CantripCombined } from "../Models/View/CantripCombined"
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements"
import { CultureCombined } from "../Models/View/CultureCombined"
import { InactiveActivatable } from "../Models/View/InactiveActivatable"
import { LiturgicalChantWithRequirements } from "../Models/View/LiturgicalChantWithRequirements"
import { ProfessionCombined } from "../Models/View/ProfessionCombined"
import { RaceCombined } from "../Models/View/RaceCombined"
import { SkillWithRequirements } from "../Models/View/SkillWithRequirements"
import { SpellWithRequirements } from "../Models/View/SpellWithRequirements"
import { Blessing } from "../Models/Wiki/Blessing"
import { Cantrip } from "../Models/Wiki/Cantrip"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { Culture } from "../Models/Wiki/Culture"
import { ItemTemplate } from "../Models/Wiki/ItemTemplate"
import { isLiturgicalChant, LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { Profession } from "../Models/Wiki/Profession"
import { Race } from "../Models/Wiki/Race"
import { Skill } from "../Models/Wiki/Skill"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { isSpell, Spell } from "../Models/Wiki/Spell"
import { NameBySex } from "../Models/Wiki/sub/NameBySex"
import { SourceLink } from "../Models/Wiki/sub/SourceLink"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { compareLocale, translate } from "../Utilities/I18n"
import { pipe } from "../Utilities/pipe"
import { comparingR, SortOptions } from "../Utilities/sortBy"
import { isNumber, isString } from "../Utilities/typeCheckUtils"
import { getCurrentSex, getWiki } from "./stateSelectors"
import * as uiSettingsSelectors from "./uisettingsSelectors"

const compareName =
  (staticData: StaticDataRecord) => comparingR (HeroModel.AL.name) (compareLocale (staticData))

export const getHerolistSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getHerolistSortOrder,
  (staticData, sortOrder): SortOptions<HeroModelRecord> =>
    sortOrder === "dateModified"
      ? [
          {
            compare: comparingR (pipe (HeroModel.A.dateModified, x => x .valueOf ()))
                                (compare),
            reverse: true,
          },
          compareName (staticData),
        ]
      : [
          compareName (staticData),
        ]
)

export const getRacesSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getRacesSortOrder,
  (staticData, sortOrder): SortOptions<Record<Race>> =>
    sortOrder === "cost"
      ? [
          comparingR (Race.AL.ap) (compare),
          compareName (staticData),
        ]
      : [
          compareName (staticData),
        ]
)

export const getRacesCombinedSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getRacesSortOrder,
  (staticData, sortOrder): SortOptions<Record<RaceCombined>> =>
    sortOrder === "cost"
      ? [
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.ap))
                     (compare),
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.name))
                     (compareLocale (staticData)),
        ]
      : [
          comparingR (pipe (RaceCombined.A.wikiEntry, Race.A.name))
                     (compareLocale (staticData)),
        ]
)

export const getCulturesSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getCulturesSortOrder,
  (staticData, sortOrder): SortOptions<Record<Culture>> =>
    sortOrder === "cost"
      ? [
          comparingR (Culture.AL.culturalPackageAdventurePoints) (compare),
          compareName (staticData),
        ]
      : [
          compareName (staticData),
        ]
)

export const getCulturesCombinedSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getCulturesSortOrder,
  (staticData, sortOrder): SortOptions<Record<CultureCombined>> =>
    sortOrder === "cost"
      ? [
          comparingR (pipe (
                       CultureCombined.A.wikiEntry,
                       Culture.A.culturalPackageAdventurePoints
                     ))
                     (compare),
          comparingR (pipe (CultureCombined.A.wikiEntry, Culture.A.name))
                     (compareLocale (staticData)),
        ]
      : [
          comparingR (pipe (CultureCombined.A.wikiEntry, Culture.A.name))
                     (compareLocale (staticData)),
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
  getWiki,
  uiSettingsSelectors.getProfessionsSortOrder,
  getCurrentSex,
  (staticData, sort_order, msex) =>
    maybe<SortOptions<Record<ProfessionCombined>>>
      ([])
      ((sex: Sex): SortOptions<Record<ProfessionCombined>> =>
        sort_order === "cost"
          ? [
              comparingR (pipe (ProfessionCombined.A.mappedAP, getPlainProfAP))
                         (compare),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionName (sex)))
                         (compareLocale (staticData)),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionSubName (sex)))
                         (compareLocale (staticData)),
              comparingR (getProfessionCombinedSourceKey)
                         (compareLocale (staticData)),
            ]
          : [
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionName (sex)))
                         (compareLocale (staticData)),
              comparingR (pipe (ProfessionCombined.A.wikiEntry, foldProfessionSubName (sex)))
                         (compareLocale (staticData)),
              comparingR (getProfessionCombinedSourceKey)
                         (compareLocale (staticData)),
            ])
      (msex)
)

const foldMaleProfessionName =
  pipe (Profession.AL.name, x => isString (x) ? x : NameBySex.A.m (x))

const foldMaleProfessionSubName =
  pipe (Profession.AL.subname, maybe ("") (x => isString (x) ? x : NameBySex.A.m (x)))

export const getWikiProfessionsCombinedSortOptions = createMaybeSelector (
  getWiki,
  (staticData): SortOptions<Record<ProfessionCombined>> =>
    [
      comparingR (pipe (ProfessionCombined.A.wikiEntry, foldMaleProfessionName))
                 (compareLocale (staticData)),
      comparingR (pipe (ProfessionCombined.A.wikiEntry, foldMaleProfessionSubName))
                 (compareLocale (staticData)),
      comparingR (getProfessionCombinedSourceKey)
                 (compareLocale (staticData)),
    ]
)

export const getSkillsCombinedSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getSkillsSortOrder,
  (staticData, sortOrder): SortOptions<Record<SkillWithRequirements>> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.ic))
                   (compare),
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.gr))
                   (compare),
        comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (SkillWithRequirements.A.wikiEntry, Skill.A.name))
                 (compareLocale (staticData)),
    ]
  }
)

export const getCombatTechniquesSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  (staticData, sortOrder): SortOptions<Record<CombatTechnique>> => {
    if (sortOrder === "ic") {
      return [
        comparingR (CombatTechnique.A.ic) (compare),
        compareName (staticData),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (CombatTechnique.A.gr) (compare),
        compareName (staticData),
      ]
    }

    return [ compareName (staticData) ]
  }
)

export const getCombatTechniquesWithRequirementsSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  (staticData, sortOrder) => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.ic))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.gr))
                   (compare),
        comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (CombatTechniqueWithRequirements.A.wikiEntry, CombatTechnique.A.name))
                 (compareLocale (staticData)),
    ]
  }
)

type ActiveSpecialAbility = ActiveActivatable<SpecialAbility>
type InactiveSpecialAbility = InactiveActivatable<SpecialAbility>

export const getSpecialAbilitiesSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getSpecialAbilitiesSortOrder,
  (staticData, sortOrder): SortOptions<Record<ActiveSpecialAbility | InactiveSpecialAbility>> => {
    if (sortOrder === "groupname") {
      return [
        comparingR (pipe (
                     ActiveActivatable.AL.wikiEntry,
                     SpecialAbility.AL.gr,
                     lookupF (StaticData.A.specialAbilityGroups (staticData)),
                     maybe ("") (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        comparingR (pipe (ActiveActivatable.AL.wikiEntry, SpecialAbility.AL.name))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (ActiveActivatable.AL.wikiEntry, SpecialAbility.AL.name))
                 (compareLocale (staticData)),
    ]
  }
)

type ensureSpell = (x: Record<Spell | Cantrip>) => Maybe<Record<Spell>>

export const getSpellsSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getSpellsSortOrder,
  (staticData, sortOrder): SortOptions<Record<SpellWithRequirements>> => {
    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     SpellWithRequirements.A.wikiEntry,
                     Spell.A.property,
                     lookupF (StaticData.A.properties (staticData)),
                     maybe ("") (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "ic") {
      return [
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.ic))
                   (compare),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     SpellWithRequirements.A.wikiEntry,
                     Spell.A.gr,
                     lookupF (StaticData.A.spellGroups (staticData)),
                     maybe ("") (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (SpellWithRequirements.A.wikiEntry, Spell.A.name))
                 (compareLocale (staticData)),
    ]
  }
)

type getSpellOrCantripFromCombined =
  (x: Record<SpellWithRequirements | CantripCombined>) =>
    Record<Spell> | Record<Cantrip>

// eslint-disable-next-line @typescript-eslint/no-redeclare
const getSpellOrCantripFromCombined =
  (x: Record<SpellWithRequirements> | Record<CantripCombined>) =>
    SpellWithRequirements.is (x)
    ? SpellWithRequirements.A.wikiEntry (x)
    : CantripCombined.A.wikiEntry (x)

export const getSpellsCombinedSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getSpellsSortOrder,
  (staticData, sortOrder): SortOptions<Record<SpellWithRequirements | CantripCombined>> => {
    if (sortOrder === "property") {
      return [
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.property,
                     lookupF (StaticData.A.properties (staticData)),
                     maybe ("") (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.name
                   ))
                   (compareLocale (staticData)),
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
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     ensure (isSpell) as ensureSpell,
                     bindF (pipe (
                       Spell.A.gr,
                       lookupF (StaticData.A.spellGroups (staticData)),
                     )),
                     maybe (translate (staticData) ("spells.groups.cantrip")) (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        comparingR (pipe (
                     getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                     Spell.AL.name
                   ))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (
                   getSpellOrCantripFromCombined as getSpellOrCantripFromCombined,
                   Spell.AL.name
                 ))
                 (compareLocale (staticData)),
    ]
  }
)

export const getCantripsSortOptions = createMaybeSelector (
  getWiki,
  (staticData): SortOptions<Record<CantripCombined>> =>
    [ comparingR (pipe (CantripCombined.A.wikiEntry, Cantrip.A.name))
                 (compareLocale (staticData)) ]
)

type ensureChant = (x: Record<LiturgicalChant | Blessing>) => Maybe<Record<LiturgicalChant>>

export const getLiturgicalChantsSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (staticData, sortOrder): SortOptions<Record<LiturgicalChantWithRequirements>> => {
    if (sortOrder === "ic") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.ic))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                   (compareLocale (staticData)),
      ]
    }
    else if (sortOrder === "group") {
      return [
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.gr))
                   (compare),
        comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (LiturgicalChantWithRequirements.A.wikiEntry, LiturgicalChant.A.name))
                 (compareLocale (staticData)),
    ]
  }
)

type getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements | BlessingCombined>) =>
    Record<LiturgicalChant> | Record<Blessing>

// eslint-disable-next-line @typescript-eslint/no-redeclare
const getChantOrBlessingFromCombined =
  (x: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>) =>
    LiturgicalChantWithRequirements.is (x)
    ? LiturgicalChantWithRequirements.A.wikiEntry (x)
    : BlessingCombined.A.wikiEntry (x)

export const getLiturgicalChantsCombinedSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getLiturgiesSortOrder,
  (staticData, sortOrder):
    SortOptions<Record<LiturgicalChantWithRequirements | BlessingCombined>> => {
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
                   (compareLocale (staticData)),
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
                   (compareLocale (staticData)),
      ]
    }

    return [
      comparingR (pipe (
                   getChantOrBlessingFromCombined as getChantOrBlessingFromCombined,
                   LiturgicalChant.AL.name
                 ))
                 (compareLocale (staticData)),
    ]
  }
)

export const getBlessingsSortOptions = createMaybeSelector (
  getWiki,
  (staticData): SortOptions<Record<BlessingCombined>> =>
    [ comparingR (pipe (BlessingCombined.A.wikiEntry, Blessing.A.name))
                 (compareLocale (staticData)) ]
)

type ensureItem = (x: Record<Item | ItemTemplate>) => Maybe<Record<Item>>

export const getEquipmentSortOptions = createMaybeSelector (
  getWiki,
  uiSettingsSelectors.getEquipmentSortOrder,
  (staticData, sortOrder): SortOptions<Record<ItemTemplate | Item>> => {
    if (sortOrder === "groupname") {
      return [
        comparingR (pipe (
                     Item.AL.gr,
                     lookupF (StaticData.A.equipmentGroups (staticData)),
                     maybe ("") (NumIdName.A.name)
                   ))
                   (compareLocale (staticData)),
        compareName (staticData),
      ]
    }
    else if (sortOrder === "where") {
      return [
        comparingR (pipe (
                     ensure (isItem) as ensureItem,
                     bindF (Item.A.where),
                     fromMaybe ("")
                   ))
                   (compareLocale (staticData)),
        compareName (staticData),
      ]
    }
    else if (sortOrder === "weight") {
      return [
        {
          compare: comparingR (pipe (Item.AL.weight, fromMaybe (0)))
                              (compare),
          reverse: true,
        },
        compareName (staticData),
      ]
    }

    return [ compareName (staticData) ]
  }
)
