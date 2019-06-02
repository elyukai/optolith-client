import { fromDefault } from "../../../Data/Record";

export interface Book {
  id: string
  short: string
  name: string
  isCore: boolean
  isAdultContent: boolean
}

export const Book =
  fromDefault<Book> ({
    id: "",
    name: "",
    short: "",
    isCore: false,
    isAdultContent: false,
  })
