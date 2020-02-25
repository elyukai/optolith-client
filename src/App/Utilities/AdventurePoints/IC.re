type t =
  | A
  | B
  | C
  | D
  | E;

/**
 * Get the IC-specific multiplier for calculating AP cost.
 *
 * This is the exact AP cost value for adding (or removing) spells and
 * liturgical chants as well as the improvement cost value for skills up to
 * SR 12 and attributes up to 14.
 */
let getAPCostBaseByIC = ic =>
  switch (ic) {
  | A => 1
  | B => 2
  | C => 3
  | D => 4
  | E => 15
  };

/**
 * Get the IC-specific last SR where the AP cost for one points equals the cost
 * for each previous point.
 */
let getLastSRWithConstantCost = ic => ic === E ? 14 : 12;

/**
 * Returns the value that has to be multiplied with the AP cost base to get the
 * final cost for the given SR.
 */
let getBaseMultiplier = (ic, sr) =>
  sr - getLastSRWithConstantCost(ic) |> Int.max(1);

/**
 * Returns the AP cost for a single SR with a specific IC.
 */
let getCost = (ic, sr) => getAPCostBaseByIC(ic) * getBaseMultiplier(ic, sr);

/**
 * `getAPRange ic fromSR toSR` returns the AP cost for the given SR range.
 */
[@gentype]
let getAPForRange = (ic, fromSR, toSR) =>
  fromSR < toSR
    ? Ix.range((fromSR + 1, toSR))
      |> List.fold_right(sr => getCost(ic, sr) |> (+), _, 0)
    : fromSR > toSR
        ? Ix.range((toSR + 1, fromSR))
          |> List.fold_right(sr => getCost(ic, sr) |> (+), _, 0)
        : 0;

[@gentype]
let intToIc = ic =>
  switch (ic) {
  | 1 => Some(A)
  | 2 => Some(B)
  | 3 => Some(C)
  | 4 => Some(D)
  | 5 => Some(E)
  | _ => None
  };

[@gentype]
let icToStr = ic =>
  switch (ic) {
  | A => "A"
  | B => "B"
  | C => "C"
  | D => "D"
  | E => "E"
  };
