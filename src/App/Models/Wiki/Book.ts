import { fromDefault } from "../../../Data/Record";

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
