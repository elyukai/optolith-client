import { AllRequirements, DependentPrerequisite } from '../../../types/wiki';
import { isCultureRequirement } from './CultureRequirementCreator';
import { isPactRequirement } from './PactRequirementCreator';
import { isRaceRequirement } from './RaceRequirementCreator';
import { isSexRequirement } from './SexRequirementCreator';

export const isDependentPrerequisite =
  (entry: AllRequirements): entry is DependentPrerequisite =>
    entry !== 'RCP'
    && !isRaceRequirement (entry)
    && !isCultureRequirement (entry)
    && !isSexRequirement (entry)
    && !isPactRequirement (entry)
