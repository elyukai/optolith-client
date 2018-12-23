import { CommonProfessionObject } from '../../../types/data';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredFunction } from './typeHelpers';

const CommonProfessionObjectCreator =
  fromDefault<CommonProfessionObject> ({
    list: List.empty,
    reverse: false,
  })

export const CommonProfessionObjectG = makeGetters (CommonProfessionObjectCreator)

export const createCommonProfessionObject: RequiredFunction<CommonProfessionObject> =
  CommonProfessionObjectCreator
