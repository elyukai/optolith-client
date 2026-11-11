import { partition } from "@elyukai/utils/array/groups"
import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { on } from "@elyukai/utils/function"
import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import { mapObject } from "@elyukai/utils/object"
import { reduceCompare, type Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Activatable as RawActivatable } from "@optolith/character-schema/types"
import type {
  AdvancedSpecialAbility,
  AdvancedSpecialAbilityByOptionMappingRule,
  AdvancedSpecialAbilityRestrictedOptionIdentifier,
  SpecialAbilityIdentifier as SpecialAbilityIdentifierType,
} from "@optolith/database-schema/gen"
import { SpecialAbilityIdentifier } from "@optolith/database-schema/types/_IdentifierGroup"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { computed, observable } from "mobx"
import type { Global } from "../../global.ts"
import type { Translate, TranslateMap } from "../../utils/locale.ts"
import { ensureNonEmptyObject } from "../../utils/object.ts"
import { addAdventurePointsCaches, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BaseCharacter } from "../character.ts"
import { Case, equalsCase, fromUniformCase } from "../databaseEnum.ts"
import type { AnySpecialAbilityOfGroupDependency } from "../dependencies/single/anySpecialAbilityOfGroup.ts"
import { checkMultipleDisjunctionPartsAreValid } from "../prerequisites/disjunctionPrerequisiteMultipartValidation.ts"
import { SpecialAbilitiesSortOrder } from "../sortOrders.ts"
import {
  activatableGroupTranslationKeys,
  CharacterActivatables,
  type DisplayedActiveActivatable,
  type DisplayedInactiveActivatable,
  type SerializedActivatableInstance,
} from "./activatable.ts"

export class CharacterSpecialAbilities {
  readonly global: Global
  readonly character: BaseCharacter

  readonly #specialAbilities: {
    [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
  }

  @observable accessor dependencies: AnySpecialAbilityOfGroupDependency[] = []

  constructor(
    global: Global,
    character: BaseCharacter,
    raw?: {
      [Entity in SpecialAbilityIdentifierType["kind"]]?: Record<string, RawActivatable>
    },
  ) {
    this.global = global
    this.character = character
    this.#specialAbilities = mapObject(
      SpecialAbilityIdentifier.type.value.values,
      (_value, key) => new CharacterActivatables(global, character, key, raw?.[key]),
    ) as {
      [Entity in SpecialAbilityIdentifierType["kind"]]: CharacterActivatables<Entity>
    }
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#specialAbilities).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePointsTotal),
      emptyAdventurePointsCache,
    )
  }

  @computed
  get active(): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>[] =>
        entry.activeForDisplay,
    )
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] {
    return Object.values(this.#specialAbilities).flatMap(
      (entry): DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>[] =>
        entry.inactive,
    )
  }

  getSpecialAbilitiesCollection<Entity extends SpecialAbilityIdentifierType["kind"]>(
    entity: Entity,
  ): CharacterActivatables<Entity> {
    return this.#specialAbilities[entity]
  }

  add(id: SpecialAbilityIdentifierType, instance: SerializedActivatableInstance): void {
    this.#specialAbilities[id.kind].add(fromUniformCase(id), instance)
  }

  remove(id: SpecialAbilityIdentifierType, index: number): void {
    this.#specialAbilities[id.kind].remove(fromUniformCase(id), index)
  }

  toJSON():
    | {
        [Entity in SpecialAbilityIdentifierType["kind"]]?: Record<string, RawActivatable>
      }
    | undefined {
    return ensureNonEmptyObject(mapObject(this.#specialAbilities, entry => entry.toJSON()))
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): AnySpecialAbilityOfGroupDependency[] {
    return this.dependencies.filter(dep => {
      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(
          this.global.db.getInstanceOfEntityById,
          this.character.prerequisiteCapabilities,
          dep.sourceId,
          dep.index,
        )
      }

      return true
    })
  }

  #getAvailableAdvancedSpecialAbilitiesForEntity<Entity extends AdvancedSpecialAbilityEntityName>(
    entity: Entity,
  ): AvailableAdvancedSpecialAbilities {
    const allAdvanced = this.getSpecialAbilitiesCollection(
      getStyleEntityNameForAdvancedEntityName(entity),
    ).active.flatMap(entry =>
      entry.dbEntry.advanced.map(
        (
          spec,
        ): [
          Case<StyleSpecialAbilityEntityName, string>,
          AdvancedSpecialAbility<Case<AdvancedSpecialAbilityEntityName, string>>,
        ] => [
          Case(entry.entityName, entry.id),
          normalizeAdvancedSpecialAbilityIdInSpec(entity, spec),
        ],
      ),
    )

    const resolvedAdvanced = allAdvanced
      .map(spec => {
        switch (spec[1].kind) {
          case "Any":
          case "General":
          case "OneOf":
          case "RestrictOptions":
            return spec[1]
          case "DeriveFromExternalOption": {
            const entry = this.getSpecialAbilitiesCollection("MagicalTradition").getById(
              spec[1].DeriveFromExternalOption.external_entry,
            )
            if (entry === undefined || !entry.isActive) {
              return undefined
            }
            const option = entry?.getFirstOptionOfType("Patron")
            if (option === undefined) {
              return undefined
            }
            return mapNullable(
              spec[1].DeriveFromExternalOption.map.find(mapping => mapping.from_option === option)
                ?.to_advanced,
              res => Case("General", res),
            )
          }
          case "ByOption": {
            const entry = this.character.getActivatableById(spec[0])
            const option = entry?.getFirstOptionOfType("General")
            return spec[1].ByOption.map.find(mapping => option === mapping.option)
              ?.associatedAdvanced
          }
          default:
            return assertExhaustive(spec[1])
        }
      })
      .filter(isNotNullish)

    const allAdvancedWithoutAny = resolvedAdvanced.filter(spec => spec.kind !== "Any")
    const anyCount = allAdvanced.length - allAdvancedWithoutAny.length

    const concreteAdvanced = allAdvancedWithoutAny.filter(
      spec => spec.kind === "General" || spec.kind === "RestrictOptions",
    )

    const [usedConcreteAdvanced, availableConcreteAdvanced] = partition(concreteAdvanced, spec => {
      switch (spec.kind) {
        case "General":
          return this.character.isActivatableActive(spec.General)
        case "RestrictOptions": {
          const entry = this.character.getActivatableById(spec.RestrictOptions.id)
          return (
            entry !== undefined &&
            entry.isActive &&
            entry
              .getOptions()
              .some(
                option =>
                  option.type === "Predefined" &&
                  spec.RestrictOptions.option.some(specOption => equalsCase(option.id, specOption)),
              )
          )
        }
        default:
          return assertExhaustive(spec)
      }
    })

    const [usedOneOf, availableOneOf] = allAdvancedWithoutAny
      .filter(spec => spec.kind === "OneOf")
      .reduce<
        [
          Case<AdvancedSpecialAbilityEntityName, string>[],
          Case<AdvancedSpecialAbilityEntityName, string>[],
        ]
      >(
        ([usedAcc, availableAcc], spec) => {
          if (spec.OneOf.is_selection_required_on_purchase) {
            return [usedAcc, availableAcc] // TODO: Take select option
          }

          const possible = spec.OneOf.options.filter(
            option =>
              !usedConcreteAdvanced.some(
                used => used.kind === "General" && equalsCase(used.General, option),
              ) && !usedAcc.some(used => equalsCase(used, option)),
          )

          const newUsed = possible.find(option => this.character.isActivatableActive(option))
          return newUsed
            ? [[...usedAcc, newUsed], availableAcc]
            : [usedAcc, [...availableAcc, ...possible]]
        },
        [[], []],
      )

    const normalizedAvailable = availableConcreteAdvanced
      .map(spec => {
        switch (spec.kind) {
          case "General":
            return {
              id: spec.General,
            }
          case "RestrictOptions":
            return {
              id: spec.RestrictOptions.id,
              restrictedOptions: spec.RestrictOptions.option,
            }
          default:
            return assertExhaustive(spec)
        }
      })
      .concat(availableOneOf.map(spec => ({ id: spec })))

    const normalizedUsed = usedConcreteAdvanced
      .map(spec => {
        switch (spec.kind) {
          case "General":
            return {
              id: spec.General,
            }
          case "RestrictOptions":
            return {
              id: spec.RestrictOptions.id,
              restrictedOptions: spec.RestrictOptions.option,
            }
          default:
            return assertExhaustive(spec)
        }
      })
      .concat(usedOneOf.map(spec => ({ id: spec })))

    const anyUsed =
      anyCount > 0
        ? this.getSpecialAbilitiesCollection(entity).active.filter(entry =>
            normalizedUsed.some(
              spec =>
                equalsCase(
                  spec.id,
                  Case(entity satisfies AdvancedSpecialAbilityEntityName, entry.id),
                ) &&
                (spec.restrictedOptions === undefined ||
                  entry
                    .getOptions()
                    .some(
                      opt =>
                        opt.type === "Predefined" &&
                        spec.restrictedOptions.some(specOpt => equalsCase(opt.id, specOpt)),
                    )),
            ),
          ).length
        : 0

    return {
      specific: normalizedAvailable,
      any: anyCount - anyUsed,
    }
  }

  @computed
  get availableAdvancedSpecialAbilities(): AvailableAdvancedSpecialAbilities {
    return [
      this.#getAvailableAdvancedSpecialAbilitiesForEntity("AdvancedCombatSpecialAbility"),
      this.#getAvailableAdvancedSpecialAbilitiesForEntity("AdvancedKarmaSpecialAbility"),
      this.#getAvailableAdvancedSpecialAbilitiesForEntity("AdvancedMagicalSpecialAbility"),
      this.#getAvailableAdvancedSpecialAbilitiesForEntity("AdvancedSkillSpecialAbility"),
    ].reduce(
      (acc, entry) => ({
        specific: [...acc.specific, ...entry.specific],
        any: acc.any + entry.any,
      }),
      { specific: [], any: 0 },
    )
  }
}

export type AvailableAdvancedSpecialAbilities = {
  specific: {
    id: Case<AdvancedSpecialAbilityEntityName, string>
    restrictedOptions?: AdvancedSpecialAbilityRestrictedOptionIdentifier[]
  }[]
  any: number
}

const normalizeAdvancedSpecialAbilityId = (
  defaultEntity: AdvancedSpecialAbilityEntityName,
  id: string | Case<AdvancedSpecialAbilityEntityName, string>,
): Case<AdvancedSpecialAbilityEntityName, string> =>
  typeof id === "string" ? Case(defaultEntity, id) : id

const normalizeAdvancedSpecialAbilityIdInSpec = (
  defaultEntity: AdvancedSpecialAbilityEntityName,
  spec: AdvancedSpecialAbility<string | Case<AdvancedSpecialAbilityEntityName, string>>,
): AdvancedSpecialAbility<Case<AdvancedSpecialAbilityEntityName, string>> => {
  switch (spec.kind) {
    case "General":
      return Case(spec.kind, normalizeAdvancedSpecialAbilityId(defaultEntity, spec.General))
    case "OneOf":
      return Case(spec.kind, {
        ...spec.OneOf,
        options: spec.OneOf.options.map(id => normalizeAdvancedSpecialAbilityId(defaultEntity, id)),
      })
    case "RestrictOptions":
      return Case(spec.kind, {
        ...spec.RestrictOptions,
        id: normalizeAdvancedSpecialAbilityId(defaultEntity, spec.RestrictOptions.id),
      })
    case "DeriveFromExternalOption":
      return Case(spec.kind, {
        ...spec.DeriveFromExternalOption,
        map: spec.DeriveFromExternalOption.map.map(mapEntry => ({
          ...mapEntry,
          to_advanced: normalizeAdvancedSpecialAbilityId(defaultEntity, mapEntry.to_advanced),
        })),
      })
    case "ByOption":
      return Case(spec.kind, {
        ...spec.ByOption,
        map: spec.ByOption.map.map(mapEntry => ({
          ...mapEntry,
          associatedAdvanced: normalizeAdvancedSpecialAbilityIdInByOptionSpec(
            defaultEntity,
            mapEntry.associatedAdvanced,
          ),
        })),
      })
    case "Any":
      return spec
    default:
      return assertExhaustive(spec)
  }
}

const normalizeAdvancedSpecialAbilityIdInByOptionSpec = (
  defaultEntity: AdvancedSpecialAbilityEntityName,
  spec: AdvancedSpecialAbilityByOptionMappingRule<
    string | Case<AdvancedSpecialAbilityEntityName, string>
  >,
): AdvancedSpecialAbilityByOptionMappingRule<Case<AdvancedSpecialAbilityEntityName, string>> => {
  switch (spec.kind) {
    case "General":
      return Case(spec.kind, normalizeAdvancedSpecialAbilityId(defaultEntity, spec.General))
    case "OneOf":
      return Case(spec.kind, {
        ...spec.OneOf,
        options: spec.OneOf.options.map(id => normalizeAdvancedSpecialAbilityId(defaultEntity, id)),
      })
    default:
      return assertExhaustive(spec)
  }
}

export const getStyleEntityNameForAdvancedEntityName = (
  entity: AdvancedSpecialAbilityEntityName,
): StyleSpecialAbilityEntityName => {
  switch (entity) {
    case "AdvancedCombatSpecialAbility":
      return "CombatStyleSpecialAbility"
    case "AdvancedKarmaSpecialAbility":
      return "LiturgicalStyleSpecialAbility"
    case "AdvancedMagicalSpecialAbility":
      return "MagicStyleSpecialAbility"
    case "AdvancedSkillSpecialAbility":
      return "SkillStyleSpecialAbility"
    default:
      return assertExhaustive(entity)
  }
}

export type StyleSpecialAbilityEntityName =
  | "CombatStyleSpecialAbility"
  | "LiturgicalStyleSpecialAbility"
  | "MagicStyleSpecialAbility"
  | "SkillStyleSpecialAbility"

export type AdvancedSpecialAbilityEntityName =
  | "AdvancedCombatSpecialAbility"
  | "AdvancedKarmaSpecialAbility"
  | "AdvancedMagicalSpecialAbility"
  | "AdvancedSkillSpecialAbility"

export const isAdvancedSpecialAbilityEntityName = (
  entity: string,
): entity is AdvancedSpecialAbilityEntityName =>
  entity === "AdvancedCombatSpecialAbility" ||
  entity === "AdvancedKarmaSpecialAbility" ||
  entity === "AdvancedMagicalSpecialAbility" ||
  entity === "AdvancedSkillSpecialAbility"

/**
 * Filters and sorts the displayed special abilities.
 */
export const filterAndSortDisplayed = <
  T extends
    | DisplayedInactiveActivatable<SpecialAbilityIdentifierType["kind"]>
    | DisplayedActiveActivatable<SpecialAbilityIdentifierType["kind"]>,
>(
  visibleDisAdvantages: T[],
  filterText: string,
  sortOrder: SpecialAbilitiesSortOrder,
  showEntriesWithoutMetPrerequisites: boolean,
  translate: Translate,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = (c: T): string =>
    typeof c.name === "string" ? c.name : renderActivatableNameChunk(translateMap, c.name.full)

  const filters = ensureNonEmpty(
    [
      filterText === ""
        ? undefined
        : (c: T) => getName(c).toLowerCase().includes(filterText.toLowerCase()) ?? false,
      showEntriesWithoutMetPrerequisites ? undefined : (c: T) => c.active || c.isAvailable,
    ].filter(isNotNullish),
  )

  return (
    filters === undefined
      ? visibleDisAdvantages
      : visibleDisAdvantages.filter(entry => filters.every(filter => filter(entry)))
  ).toSorted(
    (() => {
      switch (sortOrder) {
        case SpecialAbilitiesSortOrder.Name:
          return on(getName, localeCompare)
        case SpecialAbilitiesSortOrder.Group:
          return reduceCompare(
            on(x => translate(activatableGroupTranslationKeys[x.type] ?? ""), localeCompare),
            on(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}
