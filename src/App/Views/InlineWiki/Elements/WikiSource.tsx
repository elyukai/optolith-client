import * as React from "react";
import { thrush } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { append, List, map, notNull, notNullStr } from "../../../../Data/List";
import { bindF, ensure, joinMaybeList, Maybe, maybe_, normalize, Nothing } from "../../../../Data/Maybe";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Book } from "../../../Models/Wiki/Book";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { combineShowSources, combineShowSourcesWithout } from "../../../Utilities/SourceUtils";

interface Accessors<A extends RecordIBase<any>> {
  select?: (r: Record<A>) => Maybe<List<Record<SelectOption>>>
  src: (r: Record<A>) => List<Record<SourceLink>>
}

export interface WikiSourceProps<A extends RecordIBase<any>> {
  books: OrderedMap<string, Record<Book>>
  x: Record<A>
  acc?: Accessors<A>
  l10n: L10nRecord
  addSrcs?: List<List<Record<SourceLink>>>
}

export function WikiSource<A extends RecordIBase<any>> (props: WikiSourceProps<A>) {
  const {
    books,
    x,
    acc: macc,
    l10n,
    addSrcs,
  } = props

  const base_src = pipe_ (Maybe (macc), fmap (acc => acc.src (x)), joinMaybeList)

  const select_src =
    pipe_ (
      Maybe (macc),
      bindF (acc => Maybe (acc.select)),
      bindF (thrush (x)),
      joinMaybeList,
      map (SelectOption.A.src)
    )

  const add_src = pipe_ (addSrcs, normalize, joinMaybeList, append (select_src))

  const main_src = macc === undefined ? add_src : List (base_src)

  const mcompl_src =
    macc === undefined
      ? Nothing
      : ensure (notNull) (append (add_src) (select_src))

  return pipe_ (
    mcompl_src,
    bindF (pipe (
      combineShowSourcesWithout (l10n) (books) (main_src),
      ensure (notNullStr)
    )),
    maybe_ (() => (
             <p className="source">
               <span>{combineShowSources (l10n) (books) (main_src)}</span>
             </p>
           ))
           (compl_src => (
             <>
               <p className="source">
                 <span>{combineShowSources (l10n) (books) (main_src)}</span>
               </p>
               <p className="source">
                 <span>
                   <strong>{translate (l10n) ("complementarysources")}:</strong> {compl_src}
                 </span>
               </p>
             </>
           ))
  )
}
