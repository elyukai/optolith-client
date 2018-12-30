import { fromDefault } from '../structures/Record';

export interface Pact {
  category: number
  level: number
  type: number
  domain: number | string
  name: string
}

export const Pact =
  fromDefault<Pact> ({
    name: '',
    category: 0,
    domain: 0,
    type: 0,
    level: 0,
  })
