import type { Cache } from "@optolith/database-schema/cache"
import type { ExperienceLevelTranslation, Settings } from "@optolith/database-schema/gen"
import type { GetAllResolvedSelectOptions } from "@optolith/entity-descriptions"
import type { GetResolvedSelectOptionById } from "@optolith/entity-descriptions/entities/partial/prerequisites/single/activatable"
import type { Database } from "./database.ts"
import type { LocaleEnvironment, LocaleMap } from "./utils/locale.ts"

export type Global = {
  readonly db: Database
  readonly locale: LocaleEnvironment
  readonly settings: Settings
  readonly cache: Cache
  readonly getResolvedSelectOptionById: GetResolvedSelectOptionById
  readonly getAllResolvedSelectOptions: GetAllResolvedSelectOptions
  readonly sortedExperienceLevels: ReadonlyArray<{
    id: string
    translations: LocaleMap<ExperienceLevelTranslation>
    adventurePoints: number
  }>
}
