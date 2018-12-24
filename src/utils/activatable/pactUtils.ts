import { Pact } from '../../types/data';
import { PactG } from '../heroData/PactCreator';
import { Record } from '../structures/Record';

const { domain, name } = PactG

export const isPactValid = (pact: Record<Pact>) => {
  const currentDomain = domain (pact)
  const validDomain =
    typeof currentDomain === 'number' ? currentDomain > 0 : currentDomain .length > 0
  const validName = name (pact) .length > 0

  return validDomain && validName
}
