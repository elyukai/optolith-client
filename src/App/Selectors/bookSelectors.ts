import { elems } from "../../Data/OrderedMap";
import { uncurryN } from "../../Data/Pair";
import { Book } from "../Models/Wiki/Book";
import { L10n } from "../Models/Wiki/L10n";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { compareLocale } from "../Utilities/I18n";
import { pipe } from "../Utilities/pipe";
import { comparingR, sortRecordsBy } from "../Utilities/sortBy";
import { getLocaleAsProp, getWikiBooks } from "./stateSelectors";

export const getSortedBooks = createMaybeSelector (
  getLocaleAsProp,
  getWikiBooks,
  uncurryN (l10n => pipe (
                           elems,
                           sortRecordsBy ([
                                           comparingR (Book.A.id)
                                                      (compareLocale (L10n.A.id (l10n))),
                                          ])))
)
