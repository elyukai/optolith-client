import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import type {
  PactCategory_ID,
  PactDomain_ID,
  PactPrerequisite,
} from "@optolith/database-schema/gen"
import { CharacterPact } from "../../pact.ts"

/**
 * Checks a single pact prerequisite if it’s matched.
 */
export const checkPactPrerequisite = (
  caps: {
    pact: CharacterPact | undefined
  },
  p: PactPrerequisite,
): boolean => {
  const { pact } = caps

  if (pact === undefined) {
    return false
  }

  const checkCategory = (pCategory: PactCategory_ID, i: CharacterPact): boolean =>
    i.categoryId === pCategory

  const checkLevel = (pLevel: number, i: CharacterPact): boolean => i.level >= pLevel

  const checkDomain = (pDomain: PactDomain_ID[], i: CharacterPact): boolean =>
    pDomain.some(domain => /* TODO i.domain.kind === "Predefined" && */ i.domainId === domain)

  // all checks must satisfy, if applicable depending on the prerequisite
  const checks: (((i: CharacterPact) => boolean) | undefined)[] = [
    i => checkCategory(p.category, i),
    mapNullable(p.level, pLevel => i => checkLevel(pLevel, i)),
    mapNullable(p.domain, pDomain => i => checkDomain(pDomain, i)),
  ]

  return checks.filter(isNotNullish).every(f => f(pact))
}
