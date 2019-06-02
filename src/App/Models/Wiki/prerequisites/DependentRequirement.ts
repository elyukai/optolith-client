import { AllRequirements, DependentPrerequisite } from "../wikiTypeHelpers";
import { isCultureRequirement } from "./CultureRequirement";
import { isPactRequirement } from "./PactRequirement";
import { isRaceRequirement } from "./RaceRequirement";
import { isSexRequirement } from "./SexRequirement";

export const isDependentPrerequisite =
  (entry: AllRequirements): entry is DependentPrerequisite =>
    entry !== "RCP"
    && !isRaceRequirement (entry)
    && !isCultureRequirement (entry)
    && !isSexRequirement (entry)
    && !isPactRequirement (entry)
