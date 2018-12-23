import { Book } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredFunction } from './sub/typeHelpers';

const BookCreator =
  fromDefault<Book> ({
    id: '',
    name: '',
    short: '',
  })

export const BookG = makeGetters (BookCreator)

export const createBook: RequiredFunction<Book> =
  BookCreator
