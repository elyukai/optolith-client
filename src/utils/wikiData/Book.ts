import { fromDefault, makeGetters } from '../structures/Record';

export interface Book {
  id: string
  short: string
  name: string
}

export const Book =
  fromDefault<Book> ({
    id: '',
    name: '',
    short: '',
  })

export const BookG = makeGetters (Book)
