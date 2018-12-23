import { Pact } from '../types/data';
import { AllRequirements } from '../types/wiki';
import { isPactValid } from '../utils/activatable/pactUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, Record } from '../utils/dataUtils';
import { isPactRequirement } from '../utils/wikiData/prerequisites/DependentRequirement';
import { getPact, getSpecialAbilities, getWikiSpecialAbilities } from './stateSelectors';

export const getIsPactValid = createMaybeSelector (
  getPact,
  Maybe.maybe<Record<Pact>, boolean> (false) (isPactValid)
);

export const getValidPact = createMaybeSelector (
  getPact,
  getIsPactValid,
  (pact, isValid) => pact.bind (Maybe.ensure (() => isValid))
);

export const isPactEditable = createMaybeSelector (
  getSpecialAbilities,
  getWikiSpecialAbilities,
  (maybeSpecialAbilities, wiki) =>
    maybeSpecialAbilities.fmap (
      specialAbilities => !specialAbilities.elems ().any (e => {
        if (e.get ('active').null ()) {
          return false;
        }

        const wikiEntry = wiki.lookup (e.get ('id'));

        if (Maybe.isJust (wikiEntry)) {
          const prerequisites = Maybe.fromJust (wikiEntry).get ('prerequisites');

          if (prerequisites instanceof List) {
            return prerequisites.any (req => req !== 'RCP' && isPactRequirement (req));
          }
          else if (prerequisites.member (1)) {
            return Maybe.fromJust (prerequisites.lookup (1) as Just<List<AllRequirements>>)
              .any (req => req !== 'RCP' && isPactRequirement (req));
          }
        }

        return false;
      })
    )
);
