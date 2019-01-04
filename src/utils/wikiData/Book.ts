import { fromDefault } from "../structures/Record";

export interface Book {
  id: string
  short: string
  name: string
}

export const Book =
  fromDefault<Book> ({
    id: "",
    name: "",
    short: "",
  })
