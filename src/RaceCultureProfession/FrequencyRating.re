type t =
  | Common
  | Uncommon
  | Essential;

let hasFrequencyRating = (currentEntryRating, ratingMap, id) =>
  Ley_IntMap.lookup(id, ratingMap) |> Ley_Option.elem(currentEntryRating);

/**
 * Is the entry common in the hero's race, culture or profession?
 */
let isCommon = hasFrequencyRating(Common);

/**
 * Is the entry uncommon in the hero's race, culture or profession?
 */
let isUncommon = hasFrequencyRating(Uncommon);
