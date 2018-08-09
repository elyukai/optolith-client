import { AllRequirements } from '../types/wiki';
import { isPactRequirement } from '../utils/checkPrerequisiteUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe } from '../utils/dataUtils';
import { getPact, getSpecialAbilities, getWikiSpecialAbilities } from './stateSelectors';

export const getIsPactValid = createMaybeSelector(
  getPact,
  maybePact => {
    if (Maybe.isJust(maybePact)) {
      const pact = Maybe.fromJust(maybePact);
      const domain = pact.get('domain');
      const validDomain = typeof domain === 'number' || domain.length > 0;
      const validName = pact.get('name').length > 0;

      return validDomain && validName;
    }

    return false;
  }
);

export const getValidPact = createMaybeSelector(
  getPact,
  getIsPactValid,
  (pact, isValid) => pact.bind(Maybe.ensure(() => isValid))
);

export const isPactEditable = createMaybeSelector(
  getSpecialAbilities,
  getWikiSpecialAbilities,
  (maybeSpecialAbilities, wiki) =>
    maybeSpecialAbilities.map(
      specialAbilities => !specialAbilities.elems().any(e => {
        if (e.get('active').null()) {
          return false;
        }

        const wikiEntry = wiki.lookup(e.get('id'));

        if (Maybe.isJust(wikiEntry)) {
          const prerequisites = Maybe.fromJust(wikiEntry).get('prerequisites');

          if (prerequisites instanceof List) {
            return prerequisites.any(req => req !== 'RCP' && isPactRequirement(req));
          }
          else if (prerequisites.member(1)) {
            return Maybe.fromJust(prerequisites.lookup(1) as Just<List<AllRequirements>>)
              .any(req => req !== 'RCP' && isPactRequirement(req));
          }
        }

        return false;
      })
    )
);
