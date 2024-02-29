import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { getCost } from "../../shared/domain/activatable/activatableActive.ts"
import {
  Activatable,
  ActivatableInstance,
  ActivatableMap,
  createEmptyDynamicActivatable,
} from "../../shared/domain/activatable/activatableEntry.ts"
import { getSelectOptionsFromCacheById } from "../../shared/domain/database.ts"
import { RegistrationMethod } from "../../shared/domain/dependencies/registrationHelpers.ts"
import { createIdentifierObject, equalsIdentifier } from "../../shared/domain/identifier.ts"
import { hasAspectById } from "../../shared/domain/rated/liturgicalChant.ts"
import { RangeBounds } from "../../shared/utils/range.ts"
import { DraftReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

/**
 * Functions for working with rated entries that can be activated and have
 * enhancements.
 */
export type ActivatableSlice<N extends string, E extends string> = {
  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Add the entry with the given id.
     */
    addInstance: ActionCreatorWithPayload<
      { id: number; instance: ActivatableInstance },
      `${N}/add${E}`
    >

    /**
     * Change the level of the entry with the given id.
     */
    changeInstanceLevel: ActionCreatorWithPayload<
      { id: number; index: number; level: number },
      `${N}/change${E}Level`
    >

    /**
     * Remove the entry with the given id.
     */
    removeInstance: ActionCreatorWithPayload<{ id: number; index: number }, `${N}/remove${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: DraftReducer<CharacterState, AnyAction, [database: DatabaseState]>
}

const tagToNamespace = {
  AdvancedCombatSpecialAbility: "advancedCombatSpecialAbilities",
  AdvancedKarmaSpecialAbility: "advancedKarmaSpecialAbilities",
  AdvancedMagicalSpecialAbility: "advancedMagicalSpecialAbilities",
  AdvancedSkillSpecialAbility: "advancedSkillSpecialAbilities",
  Advantage: "advantages",
  AncestorGlyph: "ancestorGlyphs",
  ArcaneOrbEnchantment: "arcaneOrbEnchantments",
  AttireEnchantment: "attireEnchantments",
  BlessedTradition: "blessedTraditions",
  BowlEnchantment: "bowlEnchantments",
  BrawlingSpecialAbility: "brawlingSpecialAbilities",
  CauldronEnchantment: "cauldronEnchantments",
  CeremonialItemSpecialAbility: "ceremonialItemSpecialAbilities",
  ChronicleEnchantment: "chronicleEnchantments",
  CombatSpecialAbility: "combatSpecialAbilities",
  CombatStyleSpecialAbility: "combatStyleSpecialAbilities",
  CommandSpecialAbility: "commandSpecialAbilities",
  DaggerRitual: "daggerRituals",
  Disadvantage: "disadvantages",
  FamiliarSpecialAbility: "familiarSpecialAbilities",
  FatePointSexSpecialAbility: "fatePointSexSpecialAbilities",
  FatePointSpecialAbility: "fatePointSpecialAbilities",
  FoolsHatEnchantment: "foolsHatEnchantments",
  GeneralSpecialAbility: "generalSpecialAbilities",
  InstrumentEnchantment: "instrumentEnchantments",
  KarmaSpecialAbility: "karmaSpecialAbilities",
  Krallenkettenzauber: "krallenkettenzauber",
  LiturgicalStyleSpecialAbility: "liturgicalStyleSpecialAbilities",
  LycantropicGift: "lycantropicGifts",
  MagicalRune: "magicalRunes",
  MagicalSign: "magicalSigns",
  MagicalSpecialAbility: "magicalSpecialAbilities",
  MagicalTradition: "magicalTraditions",
  MagicStyleSpecialAbility: "magicStyleSpecialAbilities",
  OrbEnchantment: "orbEnchantments",
  PactGift: "pactGifts",
  ProtectiveWardingCircleSpecialAbility: "protectiveWardingCircleSpecialAbilities",
  RingEnchantment: "ringEnchantments",
  Sermon: "sermons",
  SexSpecialAbility: "sexSpecialAbilities",
  SickleRitual: "sickleRituals",
  SikaryanDrainSpecialAbility: "sikaryanDrainSpecialAbilities",
  SkillStyleSpecialAbility: "skillStyleSpecialAbilities",
  SpellSwordEnchantment: "spellSwordEnchantments",
  StaffEnchantment: "staffEnchantments",
  ToyEnchantment: "toyEnchantments",
  Trinkhornzauber: "trinkhornzauber",
  VampiricGift: "vampiricGifts",
  Vision: "visions",
  WandEnchantment: "wandEnchantments",
  WeaponEnchantment: "weaponEnchantments",
} as const

type RecordValue<R> = R extends Record<number, infer V> ? V : never

/**
 * Creates a slice for a map of rated entries.
 */
export const createActivatableSlice = <
  E extends ActivatableIdentifier["tag"],
  P,
  IdO extends { tag: string },
  N extends (typeof tagToNamespace)[E] = (typeof tagToNamespace)[E],
>(config: {
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<ActivatableMap>
  getPrerequisites: (id: number, database: DatabaseState) => P[]
  getAdventurePointsValue: (staticEntry: RecordValue<DatabaseState[N]>) => AdventurePointsValue
  createIdentifierObject: (id: number) => IdO
  registerOrUnregisterPrerequisitesAsDependencies: (
    method: RegistrationMethod,
    character: Draft<CharacterState>,
    prerequisites: P[],
    sourceId: IdO,
    levelRange: RangeBounds,
    capabilities: {
      ancestorBloodAdvantageIds: number[]
      closeCombatTechniqueIds: number[]
      rangedCombatTechniqueIds: number[]
      blessedTraditionChurchIds: number[]
      blessedTraditionShamanisticIds: number[]
      magicalTraditionIds: number[]
      magicalTraditionIdsThatCanLearnRituals: number[]
      magicalTraditionIdsThatCanBindFamiliars: number[]
      getSpellIdsByPropertyId: (id: number) => number[]
      getRitualIdsByPropertyId: (id: number) => number[]
      getLiturgicalChantIdsByAspectId: (id: number) => number[]
      getCeremonyIdsByAspectId: (id: number) => number[]
    },
  ) => void
}): ActivatableSlice<N, E> => {
  const namespace = tagToNamespace[config.entityName] as N

  const updateCachedAdventurePoints = (entry: Draft<Activatable>, database: DatabaseState) => {
    const staticEntry = database[namespace][entry.id]
    const apValue =
      staticEntry === undefined
        ? undefined
        : config.getAdventurePointsValue(staticEntry as RecordValue<DatabaseState[N]>)

    if (apValue !== undefined) {
      const id = createIdentifierObject(config.entityName, entry.id)
      entry.cachedAdventurePoints = {
        general: getCost(id, apValue, entry.instances, optionId =>
          getSelectOptionsFromCacheById(database.cache.activatableSelectOptions, id)?.find(opt =>
            equalsIdentifier(opt.id, optionId),
          ),
        ).total,
        bound: 0,
      }
    }
    return entry
  }

  const addAction = createAction<{ id: number; instance: ActivatableInstance }, `${N}/add${E}`>(
    `${namespace}/add${config.entityName}`,
  )

  const changeLevelAction = createAction<
    { id: number; index: number; level: number },
    `${N}/change${E}Level`
  >(`${namespace}/change${config.entityName}Level`)

  const removeAction = createAction<{ id: number; index: number }, `${N}/remove${E}`>(
    `${namespace}/remove${config.entityName}`,
  )

  const getCapabilities = (
    database: DatabaseState,
  ): Parameters<(typeof config)["registerOrUnregisterPrerequisitesAsDependencies"]>[5] => ({
    ancestorBloodAdvantageIds: database.cache.ancestorBloodAdvantages.ids,
    closeCombatTechniqueIds: Object.values(database.closeCombatTechniques).map(x => x.id),
    rangedCombatTechniqueIds: Object.values(database.rangedCombatTechniques).map(x => x.id),
    blessedTraditionChurchIds: Object.values(database.blessedTraditions)
      .filter(x => !x.is_shamanistic)
      .map(x => x.id),
    blessedTraditionShamanisticIds: Object.values(database.blessedTraditions)
      .filter(x => x.is_shamanistic)
      .map(x => x.id),
    magicalTraditionIds: Object.values(database.magicalTraditions).map(x => x.id),
    magicalTraditionIdsThatCanLearnRituals: Object.values(database.magicalTraditions)
      .filter(x => x.can_learn_rituals)
      .map(x => x.id),
    magicalTraditionIdsThatCanBindFamiliars: Object.values(database.magicalTraditions)
      .filter(x => x.can_bind_familiars)
      .map(x => x.id),
    getSpellIdsByPropertyId: id =>
      Object.values(database.spells)
        .filter(x => x.property.id.property === id)
        .map(x => x.id),
    getRitualIdsByPropertyId: id =>
      Object.values(database.rituals)
        .filter(x => x.property.id.property === id)
        .map(x => x.id),
    getLiturgicalChantIdsByAspectId: id =>
      Object.values(database.liturgicalChants)
        .filter(x => hasAspectById(id, x.traditions))
        .map(x => x.id),
    getCeremonyIdsByAspectId: id =>
      Object.values(database.ceremonies)
        .filter(x => hasAspectById(id, x.traditions))
        .map(x => x.id),
  })

  const reducer: DraftReducer<CharacterState, AnyAction, [database: DatabaseState]> = (
    state,
    action,
    database,
  ) => {
    if (addAction.match(action)) {
      const { id, instance } = action.payload
      const entry = (config.getState(state)[id] ??= createEmptyDynamicActivatable(id))
      entry.instances.push(instance)
      updateCachedAdventurePoints(entry, database)
      config.registerOrUnregisterPrerequisitesAsDependencies(
        RegistrationMethod.Remove,
        state,
        config.getPrerequisites(action.payload.id, database),
        config.createIdentifierObject(action.payload.id),
        [1, instance.level ?? 1],
        getCapabilities(database),
      )
    } else if (changeLevelAction.match(action)) {
      const { id, index, level } = action.payload
      const entry = config.getState(state)[id]
      const instance = entry?.instances[index]
      if (instance !== undefined && instance.level !== undefined && instance.level !== level) {
        instance.level = level
        updateCachedAdventurePoints(entry!, database)
        if (level < instance.level) {
          config.registerOrUnregisterPrerequisitesAsDependencies(
            RegistrationMethod.Remove,
            state,
            config.getPrerequisites(action.payload.id, database),
            config.createIdentifierObject(action.payload.id),
            [level + 1, instance.level],
            getCapabilities(database),
          )
        } else if (level > instance.level) {
          config.registerOrUnregisterPrerequisitesAsDependencies(
            RegistrationMethod.Add,
            state,
            config.getPrerequisites(action.payload.id, database),
            config.createIdentifierObject(action.payload.id),
            [instance.level + 1, level],
            getCapabilities(database),
          )
        }
      }
    } else if (removeAction.match(action)) {
      const { id, index } = action.payload
      const entry = config.getState(state)[id]
      if (entry !== undefined) {
        config.registerOrUnregisterPrerequisitesAsDependencies(
          RegistrationMethod.Remove,
          state,
          config.getPrerequisites(action.payload.id, database),
          config.createIdentifierObject(action.payload.id),
          [1, entry.instances[index]!.level ?? 1],
          getCapabilities(database),
        )
        entry.instances.splice(index, 1)
        updateCachedAdventurePoints(entry, database)
      }
    }
  }

  return {
    actions: {
      addInstance: addAction,
      changeInstanceLevel: changeLevelAction,
      removeInstance: removeAction,
    },
    reducer,
  }
}
