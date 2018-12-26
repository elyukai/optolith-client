import { Book } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';

const BookCreator =
  fromDefault<Book> ({
    id: '',
    name: '',
    short: '',
  })

export const BookG = makeGetters (BookCreator)
