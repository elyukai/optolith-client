import { set } from "../../../Data/Lens";
import { isRequiringActivatable, RequireActivatableL } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { isRequiringIncreasable, RequireIncreasableL } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { AllRequirementObjects } from "../../Models/Wiki/wikiTypeHelpers";

const { id: ra_id } = RequireActivatableL
const { id: ri_id } = RequireIncreasableL

/**
 * Set the `id` property of the passed prerequisite. Note, that this will only
 * affect `RequireActivatable` and `RequireIncreasableL` prerequisites, all
 * others will be left unchanged.
 */
export const setPrerequisiteId =
  (id: string) =>
  (req: AllRequirementObjects) =>
    isRequiringActivatable (req)
    ? set (ra_id) (id) (req)
    : isRequiringIncreasable (req)
    ? set (ri_id) (id) (req)
    : req
