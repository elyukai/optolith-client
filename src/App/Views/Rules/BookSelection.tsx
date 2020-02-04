import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Book } from "../../Models/Wiki/Book"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { Checkbox } from "../Universal/Checkbox"
import { BookSelectionListItem } from "./BookSelectionListItem"

interface Props {
  l10n: L10nRecord
  sortedBooks: List<Record<Book>>
  allRuleBooksEnabled: boolean
  enabledRuleBooks: OrderedSet<string>
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
}

export const BookSelection: React.FC<Props> = props => {
  const {
    l10n,
    sortedBooks,
    allRuleBooksEnabled,
    enabledRuleBooks,
    switchEnableAllRuleBooks,
    switchEnableRuleBook,
  } = props

  return (
    <>
      <Checkbox
        checked={allRuleBooksEnabled}
        onClick={switchEnableAllRuleBooks}
        label={translate (l10n) ("enableallrulebooks")}
        />
      <div className="rule-books">
        {pipe_ (
          sortedBooks,
          map (e => (
            <BookSelectionListItem
              key={Book.A.id (e)}
              areAllRuleBooksEnabled={allRuleBooksEnabled}
              book={e}
              enabledRuleBooks={enabledRuleBooks}
              switchBookEnabled={switchEnableRuleBook}
              />
          )),
          toArray
        )}
      </div>
    </>
  )
}
