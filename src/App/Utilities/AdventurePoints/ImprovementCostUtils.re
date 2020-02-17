/**
 * `getICMultiplier :: Int -> Int`
 *
 * Get the IC-specific multiplier for calculating AP cost.
 *
 * This is the exact AP cost value for adding (or removing) spells and
 * liturgical chants as well as the improvement cost value for skills up to
 * SR 12 and attributes up to 14.
 */
let getICMultiplier = ic => ic === 5 ? 15 : ic
