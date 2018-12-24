import { Pact } from '../../types/data';
import { fromDefault, makeGetters } from '../structures/Record';

export const PactCreator =
  fromDefault<Pact> ({
    name: '',
    category: 0,
    domain: 0,
    type: 0,
    level: 0,
  })

export const PactG = makeGetters (PactCreator)
