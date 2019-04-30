import * as React from "react";
import { filter, List } from "../../../../Data/List";
import { memberF, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordBase } from "../../../../Data/Record";
import { Book } from "../../../Models/Wiki/Book";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink";
import { pipe } from "../../../Utilities/pipe";

interface Accessors<A extends RecordBase> {
  src: (r: Record<A>) => List<Record<SourceLink>>
}

export interface WikiSourceProps<A extends RecordBase> {
  books: OrderedMap<string, Record<Book>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSource<A extends RecordBase> (props: WikiSourceProps<A>) {
  const {
    books,
    x,
    acc,
    l10n,
  } = props

  const src = acc.src (x)

  const availableSources = filter (pipe (SourceLink.A.id, memberF (books))) (src)

  const sourceList = availableSources.map(e => {
    const book = books.get(e.id)!.name
    if (typeof e.page === "number") {
      return `${book} ${e.page}`
    }
    return book
  })

  return (
    <p className="source">
      <span>{sortStrings(sourceList, locale.id).intercalate(", ")}</span>
    </p>
  )

  return (
    <p className="source">
      <span>{books.get("US25001")!.name} {src}</span>
    </p>
  )
}
