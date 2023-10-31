import { Advantage } from "optolith-database-schema/types/Advantage"
import { AncestorBloodPrerequisite } from "optolith-database-schema/types/prerequisites/single/AncestorBloodPrerequisite"
import { ActivatableMap } from "../../activatableEntry.ts"

/**
 * Checks a single ancestor blood prerequisite if it’s matched.
 */
export const checkAncestorBloodPrerequisite = (
  caps: {
    getStaticAdvantage: (id: number) => Advantage | undefined
    getDynamicAdvantages: () => ActivatableMap
  },
  _p: AncestorBloodPrerequisite,
  sourceId: number,
): boolean =>
  // check whether no other entry with this prerequisite is active
  Object.values(caps.getDynamicAdvantages()).every(
    x =>
      x.id !== sourceId &&
      x.instances.length > 0 &&
      caps
        .getStaticAdvantage(x.id)
        ?.prerequisites?.some(
          p =>
            p.prerequisite.tag === "Single" &&
            p.prerequisite.single.tag === "NoOtherAncestorBloodAdvantage",
        ),
  )
