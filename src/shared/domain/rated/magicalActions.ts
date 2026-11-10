import { stripInlineMarkdown } from "@elyukai/markdown/render/strip"
import { findMap } from "@elyukai/utils/array/filters"
import { isNotNullish } from "@elyukai/utils/nullable"
import { omitUndefinedKeys } from "@elyukai/utils/object"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { MagicalActionIdentifier, SkillCheck } from "@optolith/database-schema/gen"
import { renderSkillCheckPenalty } from "@optolith/entity-descriptions/entities/partial/rated/skillCheck"
import { ResponsiveTextSize } from "@optolith/entity-descriptions/entities/partial/responsiveText"
import { action, computed } from "mobx"
import type { Global } from "../../global.ts"
import { AdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BaseCharacter } from "../character.ts"
import {
  CharacterActivatableRatedEntries,
  CharacterActivatableRatedEntry,
  type ConsParamsTrim,
  type DisplayedActiveActivatableRated,
  type DisplayedInactiveActivatableRated,
} from "./ratedEntry.ts"

export abstract class CharacterMagicalAction<
  Entity extends MagicalActionIdentifier["kind"],
> extends CharacterActivatableRatedEntry<Entity> {
  override readonly derivedDependencies = []

  @computed
  get minValue(): number | undefined {
    const minimumValues: number[] = this.flatMinimumRestrictions.filter(isNotNullish)
    return minimumValues.length > 0 ? Math.max(...minimumValues) : undefined
  }

  @computed
  get maxValue(): number {
    return this.getMaxValue(this.dbEntry.check, "max_skill_rating")
  }

  @computed
  get isAvailable(): boolean {
    return true // TODO: Implement availability check based on tradition
  }

  @computed
  get skillCheckPenaltyText(): string | undefined {
    const { translate, translateMap } = this.global.locale
    return "check_penalty" in this.dbEntry && this.dbEntry.check_penalty !== undefined
      ? stripInlineMarkdown(
          renderSkillCheckPenalty(this.dbEntry.check_penalty).run({
            translate,
            translateMap,
            getInstanceById: this.global.db.getInstanceOfEntityById.bind(this.global.db),
            responsiveTextSize: ResponsiveTextSize.Compressed,
          }),
        )
      : undefined
  }

  abstract get groupName(): string

  override toJSON(): DisplayedMagicalAction<Entity> {
    return {
      ...super.toJSON(),
      check: this.dbEntry.check,
      checkPenalty: this.skillCheckPenaltyText,
      improvementCost: this.improvementCost,
      groupPosition: 3,
      type: this.entityName,
      name:
        this.global.locale.translateMap<{ name: string }>(this.dbEntry.translations)?.name ?? "",
      groupName: this.groupName,
      associatedText:
        this.global.locale.translateMap(
          this.global.db.getInstanceOfEntityById("Property", this.dbEntry.property)?.translations,
        )?.name ?? "",
    }
  }
}

export class CharacterAnimistPower extends CharacterMagicalAction<"AnimistPower"> {
  get improvementCost(): ImprovementCost {
    switch (this.dbEntry.improvement_cost.kind) {
      case "Fixed":
        return this.dbEntry.improvement_cost.Fixed.kind
      case "ByPrimaryPatron":
        return "D" // TODO: Implement improvement cost based on primary patron
      default:
        return assertExhaustive(this.dbEntry.improvement_cost)
    }
  }

  @computed
  get groupName(): string {
    return this.global.locale.translate("Animist Powers")
  }
}

export class CharacterBannzeichen extends CharacterMagicalAction<"Bannzeichen"> {
  get improvementCost(): ImprovementCost {
    switch (this.dbEntry.improvement_cost.kind) {
      case "Constant":
        return this.dbEntry.improvement_cost.Constant.kind
      case "DerivedFromOption":
        return "D" // TODO: Implement improvement cost derived from option
      default:
        return assertExhaustive(this.dbEntry.improvement_cost)
    }
  }

  @computed
  get groupName(): string {
    return this.global.locale.translate("Bannzeichen")
  }
}

export class CharacterCurse extends CharacterMagicalAction<"Curse"> {
  readonly improvementCost = this.global.settings.magicalActions.curseImprovementCost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Curses")
  }
}

export class CharacterDominationRitual extends CharacterMagicalAction<"DominationRitual"> {
  readonly improvementCost =
    this.global.settings.magicalActions.dominationRitualImprovementCost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Domination Rituals")
  }
}

export class CharacterElvenMagicalSong extends CharacterMagicalAction<"ElvenMagicalSong"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  override get isAvailable(): boolean {
    return (
      super.isAvailable &&
      this.dbEntry.is_distorted ===
        findMap(this.character.activeMagicalTraditions, trad =>
          trad.dbEntry.magicalActions?.kind === this.entityName
            ? trad.dbEntry.magicalActions.ElvenMagicalSong.areDistorted
            : undefined,
        )
    )
  }

  @computed
  get groupName(): string {
    return this.global.locale.translate("Elven Magical Songs")
  }
}

export class CharacterGeodeRitual extends CharacterMagicalAction<"GeodeRitual"> {
  readonly improvementCost = this.global.settings.magicalActions.geodeRitualImprovementCost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Geode Rituals")
  }
}

export class CharacterGoblinRitual extends CharacterMagicalAction<"GoblinRitual"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Goblin Rituals")
  }
}

export class CharacterJesterTrick extends CharacterMagicalAction<"JesterTrick"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Jester Tricks")
  }
}

export class CharacterMagicalDance extends CharacterMagicalAction<"MagicalDance"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Magical Dances")
  }
}

export class CharacterMagicalMelody extends CharacterMagicalAction<"MagicalMelody"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Magical Melodies")
  }
}

export class CharacterMagicalRune extends CharacterMagicalAction<"MagicalRune"> {
  get improvementCost(): ImprovementCost {
    switch (this.dbEntry.improvement_cost.kind) {
      case "Constant":
        return this.dbEntry.improvement_cost.Constant.kind
      case "DerivedFromOption":
        return "D" // TODO: Implement improvement cost derived from option
      default:
        return assertExhaustive(this.dbEntry.improvement_cost)
    }
  }

  @computed
  get groupName(): string {
    return this.global.locale.translate("Magical Runes")
  }
}

export class CharacterZibiljaRitual extends CharacterMagicalAction<"ZibiljaRitual"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get groupName(): string {
    return this.global.locale.translate("Zibilja Rituals")
  }
}

export type DisplayedInactiveMagicalAction<
  Entity extends MagicalActionIdentifier["kind"] = MagicalActionIdentifier["kind"],
> = {
  [E in Entity]: DisplayedInactiveActivatableRated & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
  }
}[Entity]

export type DisplayedActiveMagicalAction<
  Entity extends MagicalActionIdentifier["kind"] = MagicalActionIdentifier["kind"],
> = {
  [E in Entity]: DisplayedActiveActivatableRated & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
  }
}[Entity]

export type DisplayedMagicalAction<
  Entity extends MagicalActionIdentifier["kind"] = MagicalActionIdentifier["kind"],
> = DisplayedActiveMagicalAction<Entity> | DisplayedInactiveMagicalAction<Entity>

export abstract class CharacterMagicalActionCollection<
  Entity extends MagicalActionIdentifier["kind"],
  Entry extends CharacterMagicalAction<Entity>,
> extends CharacterActivatableRatedEntries<Entity, Entry> {
  @computed
  get isAvailable(): boolean {
    return this.character.activeMagicalTraditions.some(
      trad => trad.dbEntry.magicalActions?.kind === this.entityName,
    )
  }

  @computed
  override get inactiveForDisplay() {
    return this.isAvailable ? super.inactiveForDisplay : []
  }
}

export class CharacterAnimistPowerCollection extends CharacterMagicalActionCollection<
  "AnimistPower",
  CharacterAnimistPower
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterAnimistPower, "AnimistPower", ...args)
  }
}

export class CharacterBannzeichenCollection extends CharacterMagicalActionCollection<
  "Bannzeichen",
  CharacterBannzeichen
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterBannzeichen, "Bannzeichen", ...args)
  }
}

export class CharacterCurseCollection extends CharacterMagicalActionCollection<
  "Curse",
  CharacterCurse
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterCurse, "Curse", ...args)
  }
}

export class CharacterDominationRitualCollection extends CharacterMagicalActionCollection<
  "DominationRitual",
  CharacterDominationRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterDominationRitual, "DominationRitual", ...args)
  }
}

export class CharacterElvenMagicalSongCollection extends CharacterMagicalActionCollection<
  "ElvenMagicalSong",
  CharacterElvenMagicalSong
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterElvenMagicalSong, "ElvenMagicalSong", ...args)
  }
}

export class CharacterGeodeRitualCollection extends CharacterMagicalActionCollection<
  "GeodeRitual",
  CharacterGeodeRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterGeodeRitual, "GeodeRitual", ...args)
  }
}

export class CharacterGoblinRitualCollection extends CharacterMagicalActionCollection<
  "GoblinRitual",
  CharacterGoblinRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterGoblinRitual, "GoblinRitual", ...args)
  }
}

export class CharacterJesterTrickCollection extends CharacterMagicalActionCollection<
  "JesterTrick",
  CharacterJesterTrick
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterJesterTrick, "JesterTrick", ...args)
  }
}

export class CharacterMagicalDanceCollection extends CharacterMagicalActionCollection<
  "MagicalDance",
  CharacterMagicalDance
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterMagicalDance, "MagicalDance", ...args)
  }
}

export class CharacterMagicalMelodyCollection extends CharacterMagicalActionCollection<
  "MagicalMelody",
  CharacterMagicalMelody
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterMagicalMelody, "MagicalMelody", ...args)
  }
}

export class CharacterMagicalRuneCollection extends CharacterMagicalActionCollection<
  "MagicalRune",
  CharacterMagicalRune
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterMagicalRune, "MagicalRune", ...args)
  }
}

export class CharacterZibiljaRitualCollection extends CharacterMagicalActionCollection<
  "ZibiljaRitual",
  CharacterZibiljaRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterMagicalActionCollection, 2>) {
    super(CharacterZibiljaRitual, "ZibiljaRitual", ...args)
  }
}

export class CharacterMagicalActionCollections {
  readonly magicalActions: {
    // TODO: AnimistPower: CharacterAnimistPowerCollection
    // TODO: Bannzeichen: CharacterBannzeichenCollection
    Curse: CharacterCurseCollection
    DominationRitual: CharacterDominationRitualCollection
    ElvenMagicalSong: CharacterElvenMagicalSongCollection
    GeodeRitual: CharacterGeodeRitualCollection
    GoblinRitual: CharacterGoblinRitualCollection
    JesterTrick: CharacterJesterTrickCollection
    MagicalDance: CharacterMagicalDanceCollection
    MagicalMelody: CharacterMagicalMelodyCollection
    // TODO: MagicalRune: CharacterMagicalRuneCollection
    ZibiljaRitual: CharacterZibiljaRitualCollection
  }

  constructor(
    global: Global,
    character: BaseCharacter,
    raw?: {
      // TODO: AnimistPower
      // TODO: Bannzeichen
      Curse?: Record<string, { value: number }>
      DominationRitual?: Record<string, { value: number }>
      ElvenMagicalSong?: Record<string, { value: number }>
      GeodeRitual?: Record<string, { value: number }>
      GoblinRitual?: Record<string, { value: number }>
      JesterTrick?: Record<string, { value: number }>
      MagicalDance?: Record<string, { value: number }>
      MagicalMelody?: Record<string, { value: number }>
      // TODO: MagicalRune
      ZibiljaRitual?: Record<string, { value: number }>
    },
  ) {
    this.magicalActions = {
      // TODO: AnimistPower: new CharacterAnimistPowerCollection(global, character, raw?.AnimistPower),
      // TODO: Bannzeichen: new CharacterBannzeichenCollection(global, character, raw?.Bannzeichen),
      Curse: new CharacterCurseCollection(global, character, raw?.Curse),
      DominationRitual: new CharacterDominationRitualCollection(
        global,
        character,
        raw?.DominationRitual,
      ),
      ElvenMagicalSong: new CharacterElvenMagicalSongCollection(
        global,
        character,
        raw?.ElvenMagicalSong,
      ),
      GeodeRitual: new CharacterGeodeRitualCollection(global, character, raw?.GeodeRitual),
      GoblinRitual: new CharacterGoblinRitualCollection(global, character, raw?.GoblinRitual),
      JesterTrick: new CharacterJesterTrickCollection(global, character, raw?.JesterTrick),
      MagicalDance: new CharacterMagicalDanceCollection(global, character, raw?.MagicalDance),
      MagicalMelody: new CharacterMagicalMelodyCollection(global, character, raw?.MagicalMelody),
      // TODO: MagicalRune: new CharacterMagicalRuneCollection(global, character, raw?.MagicalRune),
      ZibiljaRitual: new CharacterZibiljaRitualCollection(global, character, raw?.ZibiljaRitual),
    }
  }

  @computed
  get adventurePointsTotal(): AdventurePointsCache {
    return Object.values(this.magicalActions).reduce(
      (acc, entry) => acc.add(entry.adventurePointsTotal),
      AdventurePointsCache.empty,
    )
  }

  @computed
  get inactiveForDisplay() {
    return Object.values(this.magicalActions).flatMap(
      (entry): DisplayedInactiveMagicalAction[] => entry.inactiveForDisplay,
    )
  }

  @computed
  get activeForDisplay() {
    return Object.values(this.magicalActions).flatMap(
      (entry): DisplayedActiveMagicalAction[] => entry.activeForDisplay,
    )
  }

  @action
  increment(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].increment(id)
    }
  }

  @action
  incrementToMax(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].incrementToMax(id)
    }
  }

  @action
  decrement(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].decrement(id)
    }
  }

  @action
  decrementToMin(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].decrementToMin(id)
    }
  }

  @action
  activate(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].activate(id)
    }
  }

  @action
  deactivate(entityName: MagicalActionIdentifier["kind"], id: string) {
    if (entityName in this.magicalActions) {
      // TODO: Handle currently disabled magical action entities
      this.magicalActions[entityName as keyof typeof this.magicalActions].deactivate(id)
    }
  }

  toJSON():
    | {
        // TODO: AnimistPower
        // TODO: Bannzeichen
        Curse?: Record<string, { value: number }>
        DominationRitual?: Record<string, { value: number }>
        ElvenMagicalSong?: Record<string, { value: number }>
        GeodeRitual?: Record<string, { value: number }>
        GoblinRitual?: Record<string, { value: number }>
        JesterTrick?: Record<string, { value: number }>
        MagicalDance?: Record<string, { value: number }>
        MagicalMelody?: Record<string, { value: number }>
        // TODO: MagicalRune
        ZibiljaRitual?: Record<string, { value: number }>
      }
    | undefined {
    const result = omitUndefinedKeys({
      // TODO: AnimistPower
      // TODO: Bannzeichen
      Curse: this.magicalActions.Curse.toJSON(),
      DominationRitual: this.magicalActions.DominationRitual.toJSON(),
      ElvenMagicalSong: this.magicalActions.ElvenMagicalSong.toJSON(),
      GeodeRitual: this.magicalActions.GeodeRitual.toJSON(),
      GoblinRitual: this.magicalActions.GoblinRitual.toJSON(),
      JesterTrick: this.magicalActions.JesterTrick.toJSON(),
      MagicalDance: this.magicalActions.MagicalDance.toJSON(),
      MagicalMelody: this.magicalActions.MagicalMelody.toJSON(),
      // TODO: MagicalRune
      ZibiljaRitual: this.magicalActions.ZibiljaRitual.toJSON(),
    })
    return Object.keys(result).length > 0 ? result : undefined
  }
}
