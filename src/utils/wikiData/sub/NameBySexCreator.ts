import { NameBySex } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredFunction } from './typeHelpers';

const NameBySexCreator =
  fromDefault<NameBySex> ({
    m: '',
    f: '',
  })

export const NameBySexG = makeGetters (NameBySexCreator)

export const createNameBySex: RequiredFunction<NameBySex> = NameBySexCreator
