import * as React from "react"
import { member, OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Book } from "../../Models/Wiki/Book"
import { Checkbox } from "../Universal/Checkbox"

const BA = Book.A

interface Props {
  book: Record<Book>
  enabledRuleBooks: OrderedSet<string>
  areAllRuleBooksEnabled: boolean
  switchBookEnabled: (id: string) => void
}

export const BookSelectionListItem: React.FC<Props> = props => {
  const { areAllRuleBooksEnabled, book, enabledRuleBooks, switchBookEnabled } = props

  const id = BA.id (book)
  const name = BA.name (book)
  const isCore = BA.isCore (book)
  const isAdultContent = BA.isAdultContent (book)

  const handleSwitch = React.useCallback (
    () => switchBookEnabled (id),
    [ id, switchBookEnabled ]
  )

  return (
    <Checkbox
      className={isAdultContent ? "adult-content" : undefined}
      checked={
        isCore
        || member (id) (enabledRuleBooks)
        || (!isAdultContent && areAllRuleBooksEnabled)
      }
      onClick={handleSwitch}
      label={name}
      disabled={(areAllRuleBooksEnabled && !isAdultContent) || isCore}
      />
  )
}
