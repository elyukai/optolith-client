import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { member, OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { Checkbox } from "../Universal/Checkbox";

export interface BookSelectionProps {
  l10n: L10nRecord
  sortedBooks: List<Record<Book>>
  allRuleBooksEnabled: boolean
  enabledRuleBooks: OrderedSet<string>
  switchEnableAllRuleBooks (): void
  switchEnableRuleBook (id: string): void
}

export function BookSelection (props: BookSelectionProps) {
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
      {pipe_ (
        sortedBooks,
        map (e => {
          const id = Book.A.id (e)
          const name = Book.A.name (e)
          const isCore = Book.A.isCore (e)
          const isAdultContent = Book.A.isAdultContent (e)

          return (
            <Checkbox
              className={isAdultContent ? "adult-content" : undefined}
              key={Book.A.id (e)}
              checked={
                isCore
                || member (id) (enabledRuleBooks)
                || !isAdultContent && allRuleBooksEnabled
              }
              onClick={() => switchEnableRuleBook (id)}
              label={name}
              disabled={allRuleBooksEnabled && !isAdultContent || isCore}
              />
          )
        }),
        toArray
      )}
    </>
  )
}
