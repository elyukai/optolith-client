import { ActivatableRated } from "./ratedEntry.ts"

export const getLiturgicalChantValue = (
  dynamic: ActivatableRated | undefined,
): number | undefined => dynamic?.value
