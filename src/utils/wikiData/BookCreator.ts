import { Book } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';

export const BookCreator =
  fromDefault<Book> ({
    id: '',
    name: '',
    short: '',
  })

export const BookG = makeGetters (BookCreator)
