import * as React from "react"
import { thrush } from "../../../../Data/Function"
import { append, List, map, notNull, notNullStr } from "../../../../Data/List"
import { bindF, ensure, joinMaybeList, Maybe, maybe_, normalize, Nothing } from "../../../../Data/Maybe"
import { Record, RecordIBase } from "../../../../Data/Record"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { Nullable } from "../../../Utilities/Maybe"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { combineShowSources, combineShowSourcesWithout } from "../../../Utilities/SourceUtils"

interface Accessors<A extends RecordIBase<any>> {
  select?: (r: Record<A>) => Maybe<List<Record<SelectOption>>>
  src: (r: Record<A>) => List<Record<SourceLink>>
}

export interface WikiSourceProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc?: Accessors<A>
  staticData: StaticDataRecord
  addSrcs?: List<List<Record<SourceLink>>>
}

type FC = <A extends RecordIBase<any>> (props: WikiSourceProps<A>) => ReturnType<React.FC>

export const WikiSource: FC = props => {
  const {
    x,
    acc: macc,
    staticData,
    addSrcs,
  } = props

  const base_src = Nullable(macc).map(acc => acc.src (x)).fromMaybe(List<Record<SourceLink>>())

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
      combineShowSourcesWithout (staticData) (main_src),
      ensure (notNullStr)
    )),
    maybe_ (() => (
             <p className="source">
               <span>{combineShowSources (staticData) (main_src)}</span>
             </p>
           ))
           (compl_src => (
             <>
               <p className="source">
                 <span>{combineShowSources (staticData) (main_src)}</span>
               </p>
               <p className="source">
                 <span>
                   <strong>
                     {translate (staticData) ("inlinewiki.complementarysources")}
                     {":"}
                   </strong>
                   {" "}
                   {compl_src}
                 </span>
               </p>
             </>
           ))
  )
}
