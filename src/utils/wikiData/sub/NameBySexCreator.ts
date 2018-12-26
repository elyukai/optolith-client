import { NameBySex } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const NameBySexCreator =
  fromDefault<NameBySex> ({
    m: '',
    f: '',
  })

export const NameBySexG = makeGetters (NameBySexCreator)

export const createNameBySex = NameBySexCreator
