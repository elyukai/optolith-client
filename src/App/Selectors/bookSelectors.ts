import { append, partition } from "../../Data/List"
import { elems } from "../../Data/OrderedMap"
import { bimap, fst, snd } from "../../Data/Tuple"
import { uncurryN } from "../../Data/Tuple/Curry"
import { Book } from "../Models/Wiki/Book"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { compareLocale } from "../Utilities/I18n"
import { pipe } from "../Utilities/pipe"
import { comparingR, sortByMulti, sortRecordsByName } from "../Utilities/sortBy"
import { getWiki, getWikiBooks } from "./stateSelectors"

export const getSortedBooks = createMaybeSelector (
  getWiki,
  getWikiBooks,
  uncurryN (staticData => pipe (
                            elems,
                            partition (Book.A.isCore),
                            bimap (sortByMulti ([ comparingR (Book.A.id)
                                                             (compareLocale (staticData)) ]))
                                  (sortRecordsByName (staticData)),
                            p => append (fst (p)) (snd (p))
                          ))
)
