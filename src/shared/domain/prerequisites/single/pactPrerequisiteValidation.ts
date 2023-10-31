import {
  PactCategoryReference,
  PactDomainReference,
} from "optolith-database-schema/types/_SimpleReferences"
import { PactPrerequisite } from "optolith-database-schema/types/prerequisites/single/PactPrerequisite"
import { filterNonNullable } from "../../../utils/array.ts"
import { mapNullable } from "../../../utils/nullable.ts"
import { Pact } from "../../pact.ts"

/**
 * Checks a single pact prerequisite if it’s matched.
 */
export const checkPactPrerequisite = (
  caps: {
    getPact: () => Pact | undefined
  },
  p: PactPrerequisite,
): boolean => {
  const pact = caps.getPact()

  if (pact === undefined) {
    return false
  }

  const checkCategory = (pCategory: PactCategoryReference, i: Pact): boolean =>
    i.category === pCategory.id.pact_category

  const checkLevel = (pLevel: number, i: Pact): boolean => i.level >= pLevel

  const checkDomain = (pDomain: PactDomainReference[], i: Pact): boolean =>
    pDomain.some(domain => i.domain.kind === "Predefined" && i.domain.id === domain.id.pact_domain)

  // all checks must satisfy, if applicable depending on the prerequisite
  const checks = filterNonNullable<((i: Pact) => boolean) | undefined>([
    i => checkCategory(p.category, i),
    mapNullable(p.level, pLevel => i => checkLevel(pLevel, i)),
    mapNullable(p.domain_id, pDomain => i => checkDomain(pDomain, i)),
  ])

  return checks.every(f => f(pact))
}
