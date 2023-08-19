import { ActivatableRated } from "./ratedEntry.ts"

export const getSpellValue = (dynamic: ActivatableRated | undefined): number | undefined =>
  dynamic?.value
