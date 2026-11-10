import { isNotNullish } from "@elyukai/utils/nullable"
import { omitUndefinedKeys } from "@elyukai/utils/object"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { MagicalActionIdentifier } from "@optolith/database-schema/gen"
import { computed } from "mobx"
import type { Global } from "../../global.ts"
import { AdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BaseCharacter } from "../character.ts"
import {
  CharacterActivatableRatedEntries,
  CharacterActivatableRatedEntry,
  type ConsParamsTrim,
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
    return false // TODO: Implement availability check based on tradition
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
}

export class CharacterCurse extends CharacterMagicalAction<"Curse"> {
  readonly improvementCost = this.global.settings.magicalActions.curseImprovementCost.kind
}

export class CharacterDominationRitual extends CharacterMagicalAction<"DominationRitual"> {
  readonly improvementCost =
    this.global.settings.magicalActions.dominationRitualImprovementCost.kind
}

export class CharacterElvenMagicalSong extends CharacterMagicalAction<"ElvenMagicalSong"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
}

export class CharacterGeodeRitual extends CharacterMagicalAction<"GeodeRitual"> {
  readonly improvementCost = this.global.settings.magicalActions.geodeRitualImprovementCost.kind
}

export class CharacterGoblinRitual extends CharacterMagicalAction<"GoblinRitual"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
}

export class CharacterJesterTrick extends CharacterMagicalAction<"JesterTrick"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
}

export class CharacterMagicalDance extends CharacterMagicalAction<"MagicalDance"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
}

export class CharacterMagicalMelody extends CharacterMagicalAction<"MagicalMelody"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
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
}

export class CharacterZibiljaRitual extends CharacterMagicalAction<"ZibiljaRitual"> {
  readonly improvementCost = this.dbEntry.improvement_cost.kind
}

export class CharacterAnimistPowerCollection extends CharacterActivatableRatedEntries<
  "AnimistPower",
  CharacterAnimistPower
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterAnimistPower, "AnimistPower", ...args)
  }
}

export class CharacterBannzeichenCollection extends CharacterActivatableRatedEntries<
  "Bannzeichen",
  CharacterBannzeichen
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterBannzeichen, "Bannzeichen", ...args)
  }
}

export class CharacterCurseCollection extends CharacterActivatableRatedEntries<
  "Curse",
  CharacterCurse
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterCurse, "Curse", ...args)
  }
}

export class CharacterDominationRitualCollection extends CharacterActivatableRatedEntries<
  "DominationRitual",
  CharacterDominationRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterDominationRitual, "DominationRitual", ...args)
  }
}

export class CharacterElvenMagicalSongCollection extends CharacterActivatableRatedEntries<
  "ElvenMagicalSong",
  CharacterElvenMagicalSong
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterElvenMagicalSong, "ElvenMagicalSong", ...args)
  }
}

export class CharacterGeodeRitualCollection extends CharacterActivatableRatedEntries<
  "GeodeRitual",
  CharacterGeodeRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterGeodeRitual, "GeodeRitual", ...args)
  }
}

export class CharacterGoblinRitualCollection extends CharacterActivatableRatedEntries<
  "GoblinRitual",
  CharacterGoblinRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterGoblinRitual, "GoblinRitual", ...args)
  }
}

export class CharacterJesterTrickCollection extends CharacterActivatableRatedEntries<
  "JesterTrick",
  CharacterJesterTrick
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterJesterTrick, "JesterTrick", ...args)
  }
}

export class CharacterMagicalDanceCollection extends CharacterActivatableRatedEntries<
  "MagicalDance",
  CharacterMagicalDance
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterMagicalDance, "MagicalDance", ...args)
  }
}

export class CharacterMagicalMelodyCollection extends CharacterActivatableRatedEntries<
  "MagicalMelody",
  CharacterMagicalMelody
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterMagicalMelody, "MagicalMelody", ...args)
  }
}

export class CharacterMagicalRuneCollection extends CharacterActivatableRatedEntries<
  "MagicalRune",
  CharacterMagicalRune
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
    super(CharacterMagicalRune, "MagicalRune", ...args)
  }
}

export class CharacterZibiljaRitualCollection extends CharacterActivatableRatedEntries<
  "ZibiljaRitual",
  CharacterZibiljaRitual
> {
  constructor(...args: ConsParamsTrim<typeof CharacterActivatableRatedEntries, 2>) {
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
