import { unique } from "@elyukai/utils/array/filters"
import { reduceWhile } from "@elyukai/utils/array/reductions"
import { deepEqual } from "@elyukai/utils/equality"
import { on } from "@elyukai/utils/function"
import { Lazy } from "@elyukai/utils/lazy"
import {
  ensure,
  isNotNullish,
  mapNullable,
  nullableToArray,
  type Nullish,
} from "@elyukai/utils/nullable"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Profession as RawProfession } from "@optolith/character-schema/types"
import type { ResolvedSkillApplicationIdentifier } from "@optolith/database-schema/cache"
import type {
  ActivatableIdentifier,
  Cantrip_ID,
  CantripsOptions,
  CloseCombatTechnique,
  CombatTechniquesOptions,
  Curse_ID,
  CursesOptions,
  EnhancementPrerequisite,
  EntityMap,
  Language_ID,
  LanguagesScriptsOptions,
  LiturgiesOptions,
  PrerequisitesElement,
  Profession,
  Profession_ID,
  ProfessionActivatablePrerequisite,
  ProfessionName,
  ProfessionPackage,
  ProfessionPackage_ID,
  ProfessionPackageOptions,
  ProfessionPrerequisiteGroup,
  ProfessionVariant,
  ProfessionVariant_ID,
  ProfessionVersion,
  ProfessionVersion_ID,
  RangedCombatTechnique,
  RatedPrerequisite,
  RatingForCombatTechniquesNumber,
  Script_ID,
  SingleProfessionSpecialAbility,
  Skill_ID,
  SkillsOptions,
  SkillSpecializationOptions,
  SpellworksOptions,
  VariantOptionAction,
} from "@optolith/database-schema/gen"
import { renderActivatableNameComponents } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { printProfessionPrerequisiteGroup } from "@optolith/entity-descriptions/entities/partial/prerequisites/prerequisiteGroups"
import { printEnhancementPrerequisite } from "@optolith/entity-descriptions/entities/partial/prerequisites/single/enhancement"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable } from "mobx"
import type { GetInstanceById } from "../database.ts"
import type { Global } from "../global.ts"
import {
  getActivatablePrerequisites,
  getSelectOptionConfiguration,
  resolveAPValuesForResolvedSelectOptions,
  type ActivatableOption,
} from "./activatable/activatable.ts"
import type { DisplayedInactiveActivatableOption } from "./activatable/activatableInactive.ts"
import type { BaseCharacter } from "./character.ts"
import { Case, fromUniformCase } from "./databaseEnum.ts"
import { checkRulePrerequisite } from "./prerequisites/single/rulePrerequisiteValidation.ts"
import type { Sex } from "./sex.ts"

export class CharacterProfession {
  readonly global: Global
  character: BaseCharacter

  /**
   * The profession package identifier. Profession packages are values of a profession version for a specific experience level. Profession versions are part of the same profession but with slightly different values, such as in extension rule books existing professions might get an additional style special ability.
   */
  @observable accessor packageId: ProfessionPackage_ID

  /**
   * The profession variant identifier.
   */
  @observable accessor variantId: ProfessionVariant_ID | undefined

  /**
   * A custom name for the profession, if provided.
   */
  @observable accessor customName: string | undefined

  constructor(
    global: Global,
    character: BaseCharacter,
    ...args:
      | [raw: RawProfession]
      | [packageId: ProfessionPackage_ID, variantId?: ProfessionVariant_ID, customName?: string]
  ) {
    this.global = global
    this.character = character
    this.packageId = typeof args[0] === "object" ? args[0].package : args[0]
    this.variantId = typeof args[0] === "object" ? args[0].variant : args[1]
    this.customName = typeof args[0] === "object" ? args[0].customName : args[2]
  }

  @computed
  get base(): Profession | undefined {
    return this.baseId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("Profession", this.baseId)
  }

  @computed
  get baseId(): Profession_ID | undefined {
    return this.version?.profession
  }

  @computed
  get version(): ProfessionVersion | undefined {
    return this.versionId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("ProfessionVersion", this.versionId)
  }

  @computed
  get versionId(): ProfessionVersion_ID | undefined {
    return this.package?.profession_version
  }

  @computed
  get package(): ProfessionPackage | undefined {
    return this.global.db.getInstanceOfEntityById("ProfessionPackage", this.packageId)
  }

  @computed
  get variant(): ProfessionVariant | undefined {
    return this.variantId === undefined
      ? undefined
      : this.global.db.getInstanceOfEntityById("ProfessionVariant", this.variantId)
  }

  @computed
  get adventurePoints(): number {
    return (this.package?.ap_value ?? 0) + (this.variant?.ap_value ?? 0)
  }

  @computed
  get selectOptions(): DisplayedProfessionSelectOptions {
    return this.package === undefined
      ? { separateSelects: [], hasAnySelectOptions: false }
      : getFinalSelectOptions(this.package, this.variant, this.global, this.character)
  }

  @computed
  get fullNameParts(): FullProfessionNameParts | undefined {
    if (this.version === undefined) {
      return undefined
    }

    const { sex } = this.character.personalData
    const { translateMap } = this.global.locale

    if (this.customName !== undefined) {
      return {
        name: this.customName,
        fullName: this.customName,
      }
    }

    const versionTranslation = translateMap(this.version.translations)
    const variantTranslation = translateMap(this.variant?.translations)

    const name = professionNameToString(sex, versionTranslation?.name) ?? ""
    const subName = professionNameToString(sex, versionTranslation?.specification)
    const variantName = professionNameToString(sex, variantTranslation?.name)

    if (subName !== undefined || variantName !== undefined) {
      const specifications = [subName, variantName].filter(isNotNullish).join(", ")

      return {
        name,
        subName,
        variantName,
        fullName: name + parensIf(specifications),
      }
    } else {
      return {
        name,
        fullName: name,
      }
    }
  }

  @action
  setCustomProfessionName(newCustomProfessionName: string) {
    this.customName = newCustomProfessionName
  }

  static getProfessionsForDisplay(character: BaseCharacter): ProfessionForDisplay[] {
    const commonProfessionValidator =
      character.culture?.getCommonProfessionPredicate() ?? (() => true)
    const startExperienceLevel = character.experienceLevel.start
    const lowerOrMatchingExperienceLevelsInReverseOrder =
      startExperienceLevel === undefined
        ? character.global.sortedExperienceLevels
        : character.global.sortedExperienceLevels
            .filter(el => el.adventurePoints <= startExperienceLevel.adventure_points)
            .reverse()

    return character.global.db
      .getAllInstanceContainersOfEntity("Profession")
      .flatMap(
        profession =>
          character.global.db
            .getAllChildInstanceContainersForParent("ProfessionVersion", profession.id)
            .filter(professionVersion =>
              isEntryFromIncludedPublication(
                professionVersion.content,
                character.global.db.getInstanceOfEntityById.bind(character.global.db),
                character.global.locale.translateMap,
                character.rules.publicationOptions,
              ),
            )
            .map(professionVersion => {
              const packages = character.global.db.getAllChildInstanceContainersForParent(
                "ProfessionPackage",
                professionVersion.id,
              )

              const professionPackage = reduceWhile(
                lowerOrMatchingExperienceLevelsInReverseOrder,
                (_acc: { id: string; content: ProfessionPackage } | undefined, el) =>
                  packages.find(pkg => pkg.content.experience_level === el.id),
                acc => acc !== undefined,
                undefined,
              )

              if (professionPackage === undefined) {
                return undefined
              }

              return {
                parent: profession,
                version: professionVersion,
                package: professionPackage,
              }
            })
            .filter(
              (combined): combined is NonNullable<typeof combined> =>
                isNotNullish(combined) &&
                commonProfessionValidator({
                  id: combined.parent.id,
                  profession: combined.parent.content,
                  magicalTraditions: Lazy.of(() =>
                    extractActivatableFromProfessionPackage(
                      combined.package.content,
                      "MagicalTradition",
                      character.global.db.getInstanceOfEntityById.bind(character.global.db),
                    ),
                  ),
                  blessedTraditions: Lazy.of(() =>
                    extractActivatableFromProfessionPackage(
                      combined.package.content,
                      "BlessedTradition",
                      character.global.db.getInstanceOfEntityById.bind(character.global.db),
                    ),
                  ),
                }),
            ),
        // TODO: Check if values are allowed for the current experience level, and filter out those that are not
        // TODO: Check prerequisites that do not count as entries to add (so only sex, race, culture, and such)
      )
      .map((profession): ProfessionForDisplay | undefined => {
        const translation = character.global.locale.translateMap(
          profession.version.content.translations,
        )
        if (translation === undefined) {
          return undefined
        }
        return {
          id: profession.parent.id,
          name:
            professionNameToString(character.personalData.sex, translation.name) +
            parensIf(
              translation.specification === undefined
                ? undefined
                : professionNameToString(character.personalData.sex, translation.specification),
            ),
          apValue: profession.package.content.ap_value,
          sources: profession.version.content.src
            .map(
              src =>
                character.global.locale.translateMap(
                  character.global.db.getInstanceOfEntityById("Publication", src.id)?.translations,
                )?.abbreviation,
            )
            .filter(isNotNullish)
            .sort(character.global.locale.compare)
            .join(", "),
          versionId: profession.version.id,
          packageId: profession.package.id,
        }
      })
      .filter(isNotNullish)
  }

  @computed
  get professionVariantsForDisplay(): ProfessionVariantForDisplay[] {
    return (
      ensure(
        this.global.db.getAllChildInstanceContainersForParent("ProfessionVariant", this.packageId),
        list => list.length > 1,
      )
        ?.map(professionVariant => {
          const translation = this.global.locale.translateMap(
            professionVariant.content.translations,
          )
          return {
            id: professionVariant.id,
            name:
              translation === undefined
                ? professionVariant.id
                : professionNameToString(this.character.personalData.sex, translation.name),
          }
        })
        .toSorted(on(pv => pv.name, this.global.locale.compare)) ?? []
    )
  }

  @computed
  get isVariantSelectionRequired(): boolean {
    return this.package?.is_variant_selection_required ?? false
  }

  toJSON(): RawProfession {
    return {
      base: this.baseId ?? this.versionId ?? this.packageId,
      version: this.versionId ?? this.packageId,
      package: this.packageId,
      variant: this.variantId,
      customName: this.customName,
    }
  }
}

const mergeOption = <K extends keyof ProfessionPackageOptions>(
  key: K,
  base: ProfessionPackageOptions,
  variant: {
    [K_ in keyof ProfessionPackageOptions]?: VariantOptionAction<ProfessionPackageOptions[K_]>
  },
): ProfessionPackageOptions[K] =>
  variant[key] !== undefined
    ? variant[key].kind === "Remove"
      ? undefined
      : variant[key].Override
    : base[key]

export type ProfessionForDisplay = Readonly<{
  id: ProfessionVersion_ID
  name: string
  apValue: number
  sources: string
  versionId: ProfessionVersion_ID
  packageId: ProfessionPackage_ID
}>

export type ProfessionVariantForDisplay = Readonly<{
  id: ProfessionVariant_ID
  name: string
}>

export const extractActivatableFromProfessionPackage = <
  E extends "MagicalTradition" | "BlessedTradition",
>(
  professionPackage: ProfessionPackage,
  entity: E,
  getById: GetInstanceById<E>,
): { id: string; content: EntityMap[E] }[] =>
  unique(
    professionPackage.prerequisites?.flatMap(p =>
      extractActivatableFromPrerequisiteElement(p, entity),
    ) ?? [],
  )
    .map(id => mapNullable(getById(entity, id), content => ({ id, content })))
    .filter(isNotNullish)

const extractActivatableFromPrerequisiteElement = <
  E extends "MagicalTradition" | "BlessedTradition",
>(
  prerequisiteElement: PrerequisitesElement<ProfessionPrerequisiteGroup>,
  entity: E,
) => {
  switch (prerequisiteElement.kind) {
    case "Disjunction":
      return prerequisiteElement.Disjunction.list
        .map(element => extractActivatableFromPrerequisite(element, entity))
        .filter(isNotNullish)
    case "Group":
      return prerequisiteElement.Group.list
        .map(element => extractActivatableFromPrerequisite(element, entity))
        .filter(isNotNullish)
    case "Single":
      return nullableToArray(extractActivatableFromPrerequisite(prerequisiteElement.Single, entity))
    default:
      return assertExhaustive(prerequisiteElement)
  }
}

const extractActivatableFromPrerequisite = <E extends "MagicalTradition" | "BlessedTradition">(
  prerequisite: ProfessionPrerequisiteGroup,
  entity: E,
) =>
  prerequisite.kind === "Activatable" && prerequisite.Activatable.id.kind === entity
    ? fromUniformCase(prerequisite.Activatable.id)
    : undefined

/**
 * Maps a profession name that may be different for different sexes to a string.
 */
export const professionNameToString = <T extends ProfessionName | undefined>(
  sex: Sex,
  professionName: T,
): string | Nullish<T> => {
  if (professionName === undefined || typeof professionName === "string") {
    return professionName as string | Nullish<T>
  } else {
    switch (sex.type) {
      case "Male":
        return professionName.male ?? professionName.default
      case "Female":
        return professionName.female ?? professionName.default
      case "BalThani":
      case "Tsajana":
      case "Custom":
        return professionName.default
      default:
        return assertExhaustive(sex)
    }
  }
}

/**
 * The parts of a full profession name.
 */
export type FullProfessionNameParts = {
  name: string
  subName?: string
  variantName?: string
  fullName: string
}

const getFinalSelectOptions = (
  pkg: ProfessionPackage,
  variant: ProfessionVariant | undefined,
  global: Global,
  character: BaseCharacter,
): DisplayedProfessionSelectOptions => {
  type ReqOptions = Required<ProfessionPackageOptions>
  type SoftOptions = {
    [K in keyof ReqOptions]: ReqOptions[K] | undefined
  }

  const b = pkg.options ?? {}
  const v = variant?.options ?? {}

  const mergedOptions: SoftOptions = {
    skill_specialization: mergeOption("skill_specialization", b, v),
    languages_scripts: mergeOption("languages_scripts", b, v),
    specialAbilitiesForAdventurePoints: mergeOption("specialAbilitiesForAdventurePoints", b, v),
    combat_techniques: mergeOption("combat_techniques", b, v),
    combatTechniquesForAdventurePoints: mergeOption("combatTechniquesForAdventurePoints", b, v),
    cantrips: mergeOption("cantrips", b, v),
    curses: mergeOption("curses", b, v),
    skills: mergeOption("skills", b, v),
    spellworks: mergeOption("spellworks", b, v),
    spellworksForChosenProperty: mergeOption("spellworksForChosenProperty", b, v),
    liturgies: mergeOption("liturgies", b, v),
    lockAdventurePoints: mergeOption("lockAdventurePoints", b, v),
  }

  const selectOptions: Omit<DisplayedProfessionSelectOptions, "hasAnySelectOptions"> = {
    skillSpecialization:
      mergedOptions.skill_specialization === undefined
        ? undefined
        : getFinalSkillSpecializationSelectOption(mergedOptions.skill_specialization, global),
    languagesLiteracy:
      mergedOptions.languages_scripts === undefined
        ? undefined
        : getFinalLanguagesScriptsSelectOption(mergedOptions.languages_scripts, global, character),
    specialAbilitiesForAdventurePoints: undefined, // TODO
    combatTechniques:
      mergedOptions.combat_techniques === undefined
        ? undefined
        : getFinalCombatTechniquesSelectOption(mergedOptions.combat_techniques, global, character),
    combatTechniquesForAdventurePoints: undefined, // TODO
    cantrips:
      mergedOptions.cantrips === undefined
        ? undefined
        : getFinalCantripsSelectOption(mergedOptions.cantrips, global, character),
    curses:
      mergedOptions.curses === undefined
        ? undefined
        : getFinalCursesSelectOption(mergedOptions.curses, global, character),
    skills:
      mergedOptions.skills === undefined
        ? undefined
        : getFinalSkillsSelectOption(mergedOptions.skills, global),
    spellworks:
      mergedOptions.spellworks === undefined
        ? undefined
        : getFinalSpellworksSelectOption(mergedOptions.spellworks, global, character),
    spellworksForChosenProperty: undefined, // TODO
    liturgies:
      mergedOptions.liturgies === undefined
        ? undefined
        : getFinalLiturgiesSelectOption(mergedOptions.liturgies, global, character),
    lockAdventurePoints: undefined, // TODO
    separateSelects: collectSelectionsFromPackageAndVariant(pkg, variant, global, character),
  }

  return {
    ...selectOptions,
    hasAnySelectOptions: Object.values(selectOptions).some(
      value => value !== undefined && (!Array.isArray(value) || value.length > 0),
    ),
  }
}

export type DisplayedProfessionSelectOptions = {
  skillSpecialization?: DisplayedSkillSpecializationSelectOption
  languagesLiteracy?: DisplayedLanguagesScriptsSelectOption
  specialAbilitiesForAdventurePoints?: undefined
  combatTechniques?: DisplayedCombatTechniquesSelectOption
  combatTechniquesForAdventurePoints?: undefined
  cantrips?: DisplayedCantripsSelectOption
  curses?: DisplayedCursesSelectOption
  skills?: DisplayedSkillsSelectOption
  spellworks?: DisplayedSpellworksSelectOption
  spellworksForChosenProperty?: undefined
  liturgies?: DisplayedLiturgiesSelectOption
  lockAdventurePoints?: undefined
  separateSelects: DisplayedGeneralSelectOption[]
  hasAnySelectOptions: boolean
}

export type DisplayedSkillSpecializationSelectOption = {
  id: Skill_ID
  name: string
  applications: DisplayedSkillSpecializationSelectOptionApplications
}[]

export type DisplayedSkillSpecializationSelectOptionApplications = {
  id: ResolvedSkillApplicationIdentifier
  name: string
}[]

const getFinalSkillSpecializationSelectOption = (
  o: SkillSpecializationOptions,
  global: Global,
): DisplayedSkillSpecializationSelectOption => {
  const skills = (() => {
    switch (o.kind) {
      case "Group":
        return global.db
          .getAllInstanceContainersOfEntity("Skill")
          .filter(skill => skill.content.group === o.Group)
      case "Specific":
        return o.Specific.options
          .map(skillId => global.db.getInstanceContainerOfEntityById("Skill", skillId))
          .filter(isNotNullish)
      default:
        return assertExhaustive(o)
    }
  })()

  return skills
    .map(skill => ({
      id: skill.id,
      name: global.locale.translateMap(skill.content.translations)?.name ?? MISSING_VALUE,
      applications:
        global.cache.skillApplications[skill.id]
          ?.filter(application => application.content.prerequisites === undefined)
          .map(application => ({
            id: application.id,
            name:
              global.locale.translateMap(application.content.translations)?.name ?? MISSING_VALUE,
          })) ?? [],
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))
}

export type DisplayedLanguagesScriptsSelectOption = {
  apValue: number
  languages: { id: Language_ID; name: string }[]
  scripts?: { id: Script_ID; name: string; apValue: number }[]
}

const getFinalLanguagesScriptsSelectOption = (
  o: LanguagesScriptsOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedLanguagesScriptsSelectOption => {
  const languages = global.db
    .getAllInstanceContainersOfEntity("Language")
    .filter(language =>
      isEntryFromIncludedPublication(
        language.content,
        global.db.getInstanceOfEntityById.bind(global.db),
        global.locale.translateMap,
        character.rules.publicationOptions,
      ),
    )
    .map(language => ({
      id: language.id,
      name: global.locale.translateMap(language.content.translations)?.name ?? language.id,
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))

  const scripts = o.includeScripts
    ? global.db
        .getAllInstanceContainersOfEntity("Script")
        .map(script => ({
          id: script.id,
          name: global.locale.translateMap(script.content.translations)?.name ?? script.id,
          apValue: script.content.ap_value ?? 0,
        }))
        .toSorted(on(sw => sw.name, global.locale.compare))
    : undefined

  return {
    apValue: o.ap_value,
    languages,
    scripts,
  }
}

export type DisplayedCantripsSelectOption = {
  number: number
  cantrips: { id: Cantrip_ID; name: string }[]
}

const getFinalCantripsSelectOption = (
  o: CantripsOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedCantripsSelectOption => {
  const cantrips = o.options
    .map(option => global.db.getInstanceContainerOfEntityById("Cantrip", option))
    .filter(isNotNullish)
    .filter(language =>
      isEntryFromIncludedPublication(
        language.content,
        global.db.getInstanceOfEntityById.bind(global.db),
        global.locale.translateMap,
        character.rules.publicationOptions,
      ),
    )
    .map(cantrip => ({
      id: cantrip.id,
      name: global.locale.translateMap(cantrip.content.translations)?.name ?? cantrip.id,
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    number: o.number,
    cantrips,
  }
}

export type DisplayedCursesSelectOption = {
  apValue: number
  curses: { id: Curse_ID; name: string; improvementCost: ImprovementCost }[]
}

const getFinalCursesSelectOption = (
  o: CursesOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedCursesSelectOption => {
  const curses = global.db
    .getAllInstanceContainersOfEntity("Curse")
    .filter(curse =>
      isEntryFromIncludedPublication(
        curse.content,
        global.db.getInstanceOfEntityById.bind(global.db),
        global.locale.translateMap,
        character.rules.publicationOptions,
      ),
    )
    .map(curse => ({
      id: curse.id,
      name: global.locale.translateMap(curse.content.translations)?.name ?? curse.id,
      improvementCost: global.settings.magicalActions.curseImprovementCost.kind,
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    apValue: o.ap_value,
    curses,
  }
}

export type DisplayedSkillsSelectOption = {
  apValue: number
  skills: { id: Skill_ID; name: string; improvementCost: ImprovementCost }[]
  skillsName: string
}

const getFinalSkillsSelectOption = (
  o: SkillsOptions,
  global: Global,
): DisplayedSkillsSelectOption => {
  const allSkills = global.db.getAllInstanceContainersOfEntity("Skill")
  const skillGroup = global.db.getInstanceContainerOfEntityById("SkillGroup", o.group)
  const skills = (
    o.specific !== undefined
      ? allSkills.filter(
          skill =>
            skill.content.group === o.group &&
            (o.specific === undefined || o.specific.includes(skill.id)),
        )
      : allSkills.filter(skill => skill.content.group === o.group)
  )
    .map(skill => ({
      id: skill.id,
      name: global.locale.translateMap(skill.content.translations)?.name ?? skill.id,
      improvementCost: skill.content.improvement_cost.kind,
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    apValue: o.ap_value,
    skills,
    skillsName:
      global.locale.translateMap(skillGroup?.content.translations)?.longName ?? MISSING_VALUE,
  }
}

const prepareSkillsOfEntity = <E extends "Spell" | "Ritual" | "LiturgicalChant" | "Ceremony">(
  entity: E,
  global: Global,
  character: BaseCharacter,
) =>
  global.db
    .getAllInstanceContainersOfEntity(entity)
    .filter(spellwork =>
      isEntryFromIncludedPublication(
        spellwork.content,
        global.db.getInstanceOfEntityById.bind(global.db),
        global.locale.translateMap,
        character.rules.publicationOptions,
      ),
    )
    .map(spellwork => ({
      id: Case(entity, spellwork.id),
      name: global.locale.translateMap(spellwork.content.translations)?.name ?? spellwork.id,
      improvementCost: spellwork.content.improvement_cost.kind,
    }))

export type DisplayedSpellworksSelectOption = {
  apValue: number
  number: number
  spellworks: {
    id: Case<"Spell" | "Ritual", string>
    name: string
    improvementCost: ImprovementCost
  }[]
}

const getFinalSpellworksSelectOption = (
  o: SpellworksOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedSpellworksSelectOption => {
  const spellworks = prepareSkillsOfEntity<"Spell" | "Ritual">("Spell", global, character)
    .concat(prepareSkillsOfEntity("Ritual", global, character))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    apValue: o.apValue,
    number: o.number,
    spellworks,
  }
}

export type DisplayedLiturgiesSelectOption = {
  apValue: number
  liturgies: {
    id: Case<"LiturgicalChant" | "Ceremony", string>
    name: string
    improvementCost: ImprovementCost
  }[]
}

const getFinalLiturgiesSelectOption = (
  o: LiturgiesOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedLiturgiesSelectOption => {
  const liturgies = prepareSkillsOfEntity<"LiturgicalChant" | "Ceremony">(
    "LiturgicalChant",
    global,
    character,
  )
    .concat(prepareSkillsOfEntity("Ceremony", global, character))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    apValue: o.ap_value,
    liturgies,
  }
}

export type DisplayedCombatTechniquesSelectOption = {
  fixed: RatingForCombatTechniquesNumber[]
  restRatingModifier?: number
  combatTechniques: {
    id: Case<"CloseCombatTechnique" | "RangedCombatTechnique", string>
    name: string
  }[]
}

const getFinalCombatTechniquesSelectOption = (
  o: CombatTechniquesOptions,
  global: Global,
  character: BaseCharacter,
): DisplayedCombatTechniquesSelectOption => {
  const combatTechniques = o.options
    .map(ct =>
      mapNullable(
        global.db.getInstanceContainerOfEntityById(ct),
        entry =>
          [ct, entry] as
            | [Case<"CloseCombatTechnique", string>, { id: string; content: CloseCombatTechnique }]
            | [
                Case<"RangedCombatTechnique", string>,
                { id: string; content: RangedCombatTechnique },
              ],
      ),
    )
    .filter(isNotNullish)
    .filter(combatTechnique =>
      isEntryFromIncludedPublication(
        combatTechnique[1].content,
        global.db.getInstanceOfEntityById.bind(global.db),
        global.locale.translateMap,
        character.rules.publicationOptions,
      ),
    )
    .map(ct => ({
      id: ct[0],
      name: global.locale.translateMap(ct[1]?.content.translations)?.name ?? fromUniformCase(ct[0]),
    }))
    .toSorted(on(sw => sw.name, global.locale.compare))

  return {
    fixed: o.fixed,
    restRatingModifier: o.rest_rating_modifier,
    combatTechniques,
  }
}

export type DisplayedGeneralSelectOptionOption = {
  tag: "general"
  name: string
  value: ProfessionPrerequisiteGroup | Case<"Enhancement", EnhancementPrerequisite>
}

export type DisplayedActivatableEntrySelectOptionOption =
  | DisplayedInactiveActivatableOption
  | { kind: "preset"; text: string; value: ActivatableOption }

export type DisplayedActivatableEntrySelectOption = {
  tag: "incompleteActivatable"
  type: ActivatableIdentifier["kind"]
  id: string
  name: string
  options: DisplayedActivatableEntrySelectOptionOption[]
  level?: {
    value: number
    placement: "before" | "after"
  }
}

export type DisplayedGeneralSelectOption =
  | (DisplayedGeneralSelectOptionOption | DisplayedActivatableEntrySelectOption)[]
  | DisplayedActivatableEntrySelectOption

export type DisplayedGeneralSelectOptions = DisplayedGeneralSelectOption[]

const printIncompleteActivatable = (
  value: ProfessionActivatablePrerequisite,
  global: Global,
  character: BaseCharacter,
): DisplayedActivatableEntrySelectOption => {
  const entityName = value.id.kind
  const id = fromUniformCase(value.id)

  const options = global.getAllResolvedSelectOptions(value.id)
  const optionsWithResolvedAPValue = resolveAPValuesForResolvedSelectOptions(
    options,
    global,
    character,
    () => false,
    () => 0,
  )
  const dbEntry = global.db.getInstanceOfEntityById(value.id)

  return {
    tag: "incompleteActivatable",
    type: entityName,
    id,
    name:
      global.locale.translateMap<{ name: string }>(dbEntry?.translations)?.name ?? MISSING_VALUE,
    options: getSelectOptionConfiguration(
      optionsWithResolvedAPValue,
      entityName,
      id,
      dbEntry !== undefined && "select_options" in dbEntry
        ? dbEntry.select_options?.rules
        : undefined,
      global,
    ).map((opt, optIndex): DisplayedActivatableEntrySelectOptionOption =>
      value.options?.[optIndex] !== undefined && value.options[optIndex].kind !== "Select"
        ? {
            kind: "preset",
            text:
              value.options[optIndex].kind === "Text"
                ? (global.locale.translateMap(value.options[optIndex].Text.translations)?.text ??
                  MISSING_VALUE)
                : (global.locale.translateMap(
                    global.getResolvedSelectOptionById(value.id, value.options[optIndex].Identifier)
                      ?.content.translations,
                  )?.name ?? MISSING_VALUE),
            value:
              value.options[optIndex].kind === "Identifier"
                ? { type: "Predefined", id: value.options[optIndex].Identifier }
                : {
                    type: "Custom",
                    value:
                      global.locale.translateMap(value.options[optIndex].Text.translations)?.text ??
                      MISSING_VALUE,
                  },
          }
        : opt,
    ),
    level:
      value.level !== undefined
        ? {
            value: value.level,
            placement:
              dbEntry !== undefined &&
              "nameBuilderRules" in dbEntry &&
              dbEntry.nameBuilderRules?.levelPlacement?.kind === "BeforeOptions"
                ? "before"
                : "after",
          }
        : undefined,
  }
}

const printEnhancement = (
  value: EnhancementPrerequisite,
  global: Global,
): DisplayedGeneralSelectOptionOption => {
  const rendered = printEnhancementPrerequisite(value).run({
    translate: global.locale.translate,
    translateMap: global.locale.translateMap,
    getInstanceById: global.db.getInstanceOfEntityById.bind(global.db),
  })?.value

  return {
    tag: "general",
    name:
      rendered === undefined
        ? value.id
        : typeof rendered === "string"
          ? rendered
          : renderActivatableNameComponents(global.locale.translateMap, rendered, true),
    value: Case("Enhancement", value),
  }
}

const printPrerequisite = (
  value: ProfessionPrerequisiteGroup,
  global: Global,
): DisplayedGeneralSelectOptionOption => {
  const rendered = printProfessionPrerequisiteGroup(value).run({
    translate: global.locale.translate,
    translateMap: global.locale.translateMap,
    getInstanceById: global.db.getInstanceOfEntityById.bind(global.db),
    getResolvedSelectOptionById: global.getResolvedSelectOptionById,
    getResolvedSkillApplicationById: global.getResolvedSkillApplicationById,
    format: global.locale.format,
    localeCompare: global.locale.compare,
    localeJoin: global.locale.join,
  })?.value

  return {
    tag: "general",
    name:
      rendered === undefined
        ? MISSING_VALUE
        : typeof rendered === "string"
          ? rendered
          : renderActivatableNameComponents(global.locale.translateMap, rendered, true),
    value,
  }
}

const getOptionForSingleProfessionSpecialAbility = (
  sa: SingleProfessionSpecialAbility,
  global: Global,
  character: BaseCharacter,
) => {
  if (sa.id.kind === "Enhancement") {
    return printEnhancement({ id: sa.id.Enhancement }, global)
  } else if (sa.options?.some(opt => opt.kind === "Select") ?? false) {
    return printIncompleteActivatable(
      {
        id: sa.id,
        active: true,
        level: sa.level,
        options: sa.options,
      },
      global,
      character,
    )
  } else {
    return printPrerequisite(
      Case("Activatable", {
        id: sa.id,
        active: true,
        level: sa.level,
        options: sa.options,
      }),
      global,
    )
  }
}

export const checkProfessionSpecialAbilityRulePrerequisites = (
  sa: SingleProfessionSpecialAbility,
  global: Global,
  character: BaseCharacter,
) => {
  if (sa.id.kind === "Enhancement") {
    return true
  }
  const dbEntry = global.db.getInstanceOfEntityById(sa.id)
  return (
    dbEntry !== undefined &&
    getActivatablePrerequisites(sa.id.kind, dbEntry, global).every(
      p =>
        p.level !== 1 ||
        p.prerequisite.kind !== "Single" ||
        p.prerequisite.Single.kind !== "Rule" ||
        checkRulePrerequisite(character.prerequisiteCapabilities, p.prerequisite.Single.Rule),
    )
  )
}

const collectSelectionsFromPackageAndVariant = (
  pkg: ProfessionPackage,
  variant: ProfessionVariant | undefined,
  global: Global,
  character: BaseCharacter,
): DisplayedGeneralSelectOptions => [
  ...(
    pkg.prerequisites?.filter(
      p =>
        !(
          variant?.prerequisites?.some(vp => vp.kind === "Remove" && deepEqual(p, vp.Remove)) ??
          false
        ),
    ) ?? []
  )
    .concat(variant?.prerequisites?.filter(p => p.kind === "Add").map(p => p.Add) ?? [])
    .filter(
      p =>
        (p.kind === "Disjunction" &&
          p.Disjunction.list.every(dp => dp.kind === "Activatable" || dp.kind === "Rated")) ||
        ((p.kind === "Single" &&
          p.Single.kind === "Activatable" &&
          p.Single.Activatable.options?.some(opt => opt.kind === "Select")) ??
          false) ||
        (p.kind === "Group" &&
          p.Group.list.some(
            gp =>
              gp.kind === "Activatable" &&
              (gp.Activatable.options?.some(opt => opt.kind === "Select") ?? false),
          )),
    )
    .flatMap((p): DisplayedGeneralSelectOption[] =>
      p.kind === "Disjunction"
        ? [
            p.Disjunction.list.map(dp => {
              if (
                dp.kind === "Activatable" &&
                (dp.Activatable.options?.some(opt => opt.kind === "Select") ?? false)
              ) {
                return printIncompleteActivatable(dp.Activatable, global, character)
              } else {
                return printPrerequisite(dp, global)
              }
            }),
          ]
        : p.kind === "Single" && p.Single.kind === "Activatable"
          ? [printIncompleteActivatable(p.Single.Activatable, global, character)]
          : p.kind === "Group"
            ? p.Group.list
                .filter(
                  (gp): gp is Case<"Activatable", ProfessionActivatablePrerequisite> =>
                    gp.kind === "Activatable" &&
                    (gp.Activatable.options?.some(opt => opt.kind === "Select") ?? false),
                )
                .map(gp => printIncompleteActivatable(gp.Activatable, global, character))
            : [],
    ),
  ...(
    pkg.special_abilities?.filter(
      p =>
        !(
          variant?.special_abilities?.some(
            vp => vp.action.kind === "Remove" && deepEqual(p, vp.value),
          ) ?? false
        ),
    ) ?? []
  )
    .concat(
      variant?.special_abilities?.filter(p => p.action.kind === "Override").map(p => p.value) ?? [],
    )
    .filter(sa => {
      switch (sa.kind) {
        case "Constant": {
          return (
            (sa.Constant.options?.some(opt => opt.kind === "Select") ?? false) &&
            checkProfessionSpecialAbilityRulePrerequisites(sa.Constant, global, character)
          )
        }
        case "Selection":
          return true
        default:
          return assertExhaustive(sa)
      }
    })
    .map((sa): DisplayedGeneralSelectOption | undefined => {
      switch (sa.kind) {
        case "Constant": {
          const res = getOptionForSingleProfessionSpecialAbility(sa.Constant, global, character)
          if (res.tag === "incompleteActivatable") {
            return res
          } else {
            return [res] // only to catch this case in the type system, but it should technically be filtered out before
          }
        }
        case "Selection":
          return ensure(
            sa.Selection.options
              .filter(saPart =>
                checkProfessionSpecialAbilityRulePrerequisites(saPart, global, character),
              )
              .map(saPart => getOptionForSingleProfessionSpecialAbility(saPart, global, character)),
            list => list.length > 1,
          )
        default:
          return assertExhaustive(sa)
      }
    })
    .filter(isNotNullish),
  ...(pkg.spells ?? [])
    .concat(variant?.spells ?? [])
    .filter(s => s.id.length > 1)
    .map(s =>
      s.id
        .filter(id => id.kind === "Spellwork") // TODO: Handle magical actions with possible options
        .map((id): DisplayedGeneralSelectOptionOption => {
          const value: RatedPrerequisite = {
            id: id.Spellwork.id, // TODO: Set specific tradition
            value: s.rating_modifier,
          }

          return printPrerequisite(Case("Rated", value), global)
        }),
    ),
  ...(pkg.liturgical_chants ?? [])
    .concat(variant?.liturgical_chants ?? [])
    .filter(lc => lc.id.length > 1)
    .map(lc =>
      lc.id.map((id): DisplayedGeneralSelectOptionOption => {
        const value: RatedPrerequisite = {
          id,
          value: lc.rating_modifier,
        }

        return printPrerequisite(Case("Rated", value), global)
      }),
    ),
]
