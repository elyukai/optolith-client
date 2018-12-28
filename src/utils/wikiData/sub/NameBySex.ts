import { fromDefault, makeGetters } from '../../structures/Record';

export interface NameBySex {
  m: string
  f: string
}

export const NameBySex =
  fromDefault<NameBySex> ({
    m: '',
    f: '',
  })

export const NameBySexG = makeGetters (NameBySex)
