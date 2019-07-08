import { set } from "../../../Data/Lens";
import { RequireActivatable, RequireActivatableL } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { RequireIncreasable, RequireIncreasableL } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
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
    RequireActivatable.is (req)
    ? set (ra_id) (id) (req)
    : RequireIncreasable.is (req)
    ? set (ri_id) (id) (req)
    : req
