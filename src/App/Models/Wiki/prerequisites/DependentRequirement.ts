import { AllRequirements, DependentPrerequisite } from "../wikiTypeHelpers";
import { isCultureRequirement } from "./CultureRequirement";
import { isPactRequirement } from "./PactRequirement";
import { RaceRequirement } from "./RaceRequirement";
import { isSexRequirement } from "./SexRequirement";

export const isDependentPrerequisite =
  (entry: AllRequirements): entry is DependentPrerequisite =>
    entry !== "RCP"
    && !RaceRequirement.is (entry)
    && !isCultureRequirement (entry)
    && !isSexRequirement (entry)
    && !isPactRequirement (entry)
