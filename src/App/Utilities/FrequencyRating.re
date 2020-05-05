type t =
  | Common
  | Uncommon
  | Essential;

let hasFrequencyRating = (currentEntryRating, ratingMap, id) =>
  IntMap.lookup(id, ratingMap) |> Maybe.Foldable.elem(currentEntryRating);

/**
 * Is the entry common in the hero's race, culture or profession?
 */
let isCommon = hasFrequencyRating(Common);

/**
 * Is the entry uncommon in the hero's race, culture or profession?
 */
let isUncommon = hasFrequencyRating(Uncommon);
