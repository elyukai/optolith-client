import { PactG } from '../../App/Models/Hero/Pact';
import { Record } from '../../Data/Record';
import { Pact } from '../../types/data';

const { domain, name } = PactG

export const isPactValid = (pact: Record<Pact>) => {
  const currentDomain = domain (pact)
  const validDomain =
    typeof currentDomain === 'number' ? currentDomain > 0 : currentDomain .length > 0
  const validName = name (pact) .length > 0

  return validDomain && validName
}
