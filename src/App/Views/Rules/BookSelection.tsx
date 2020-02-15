import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Book } from "../../Models/Wiki/Book"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { Checkbox } from "../Universal/Checkbox"
import { BookSelectionListItem } from "./BookSelectionListItem"

interface Props {
  staticData: StaticDataRecord
  sortedBooks: List<Record<Book>>
  allRuleBooksEnabled: boolean
  enabledRuleBooks: OrderedSet<string>
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
}

export const BookSelection: React.FC<Props> = props => {
  const {
    staticData,
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
        label={translate (staticData) ("rules.enableallrulebooks")}
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
