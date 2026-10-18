import { AncestorBloodPrerequisite } from "@optolith/database-schema/gen"
import { All, GetById } from "../../getTypes.ts"

/**
 * Checks a single ancestor blood prerequisite if it’s matched.
 */
export const checkAncestorBloodPrerequisite = (
  caps: {
    getStaticAdvantageById: GetById.Static.Advantage
    dynamicAdvantages: All.Dynamic.Advantages
  },
  _p: AncestorBloodPrerequisite,
  sourceId: number,
): boolean =>
  // check whether no other entry with this prerequisite is active
  caps.dynamicAdvantages.every(
    x =>
      x.id !== sourceId &&
      x.instances.length > 0 &&
      caps
        .getStaticAdvantageById(x.id)
        ?.prerequisites?.some(
          p =>
            p.prerequisite.tag === "Single" &&
            p.prerequisite.single.tag === "NoOtherAncestorBloodAdvantage",
        ),
  )
