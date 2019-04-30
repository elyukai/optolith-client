import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { filter, intercalate, List } from "../../../../Data/List";
import { mapMaybe } from "../../../../Data/Maybe";
import { lookupF, memberF, OrderedMap } from "../../../../Data/OrderedMap";
import { fst, isPair, snd } from "../../../../Data/Pair";
import { Record, RecordBase } from "../../../../Data/Record";
import { Book } from "../../../Models/Wiki/Book";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";

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

  const available_src = filter (pipe (SourceLink.A.id, memberF (books))) (src)

  const srcs = mapMaybe ((sl: Record<SourceLink>) => pipe_ (
                          sl,
                          SourceLink.A.id,
                          lookupF (books),
                          fmap (b => {
                            const p = SourceLink.A.page (sl)

                            return `${Book.A.name (b)} ${isPair (p) ? `${fst (p)}–${snd (p)}` : p}`
                          })
                        ))
                        (available_src)

  return (
    <p className="source">
      <span>{pipe_ (srcs, sortStrings (L10n.A.id (l10n)), intercalate (", "))}</span>
    </p>
  )
}
