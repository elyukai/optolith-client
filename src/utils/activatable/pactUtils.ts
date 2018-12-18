import { Pact } from '../../types/data';
import { Record } from './dataUtils';

export const isPactValid = (pact: Record<Pact>) => {
  const domain = pact.get ('domain');
  const validDomain = typeof domain === 'number' || domain.length > 0;
  const validName = pact.get ('name').length > 0;

  return validDomain && validName;
};
