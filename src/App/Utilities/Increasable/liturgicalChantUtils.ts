/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { consF, fnull, intercalate, List } from "../../../Data/List"
import { bindF, ensure, fromMaybe, guard, Just, mapMaybe, Maybe, maybe, Nothing, thenF } from "../../../Data/Maybe"
import { find, findWithDefault, lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { Aspect, BlessedTradition } from "../../Constants/Groups"
import { ChantsSortOptions } from "../../Models/Config"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements } from "../../Models/View/LiturgicalChantWithRequirements"
import { BlessedTradition as BlessedTraditionR } from "../../Models/Wiki/BlessedTradition"
import { Blessing } from "../../Models/Wiki/Blessing"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe, pipe_ } from "../pipe"
import { sortStrings } from "../sortBy"


/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = pipe (
  (key : BlessedTradition) => findWithDefault (List<Aspect> ()) (key) (aspectsByTradition),
  consF<Aspect> (Aspect.General)
)

export type LiturgicalChantBlessingCombined = Record<LiturgicalChantWithRequirements>
                                            | Record<BlessingCombined>

const wikiEntryCombined =
  (x : LiturgicalChantBlessingCombined) : Record<LiturgicalChant> | Record<Blessing> =>
    LiturgicalChantWithRequirements.is (x)
      ? LiturgicalChantWithRequirements.A.wikiEntry (x)
      : BlessingCombined.A.wikiEntry (x)

/**
 * Combined `LiturgicalChantWithRequirements` and `BlessingCombined` accessors.
 */
export const LCBCA = {
  active: (x : LiturgicalChantBlessingCombined) : boolean =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.stateEntry,
          ActivatableSkillDependent.A.active
        )
      : BlessingCombined.A.active (x),
  gr: (x : LiturgicalChantBlessingCombined) : Maybe<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.gr,
          Just
        )
      : Nothing,
  aspects: (x : LiturgicalChantBlessingCombined) : List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.aspects
        )
      : List (1),
  tradition: (x : LiturgicalChantBlessingCombined) : List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.tradition
        )
      : List (1),
  id: pipe (wikiEntryCombined, Blessing.AL.id),
  name: pipe (wikiEntryCombined, Blessing.AL.name),
}


const isAspectOfTraditionFromPair = (fromPair : <A> (x : Pair<A, A>) => A) =>
                                    (trad : Record<BlessedTraditionR>) =>
                                    (aspect : number) : boolean =>
                                      pipe_ (
                                        trad,
                                        BTA.aspects,
                                        maybe (false)
                                              (aspects => fromPair (aspects) === aspect)
                                      )


const isAspectOfTradition = (trad : Record<BlessedTraditionR>) =>
                            (aspect : number) : boolean =>
                              isAspectOfTraditionFromPair (fst) (trad) (aspect)
                              || isAspectOfTraditionFromPair (snd) (trad) (aspect)


/**
 * Returns the Aspects string for list display.
 */
export const getAspectsStr =
  (staticData : StaticDataRecord) =>
  (curr : LiturgicalChantBlessingCombined) =>
  (mtradition_id : Maybe<BlessedTradition>) : string =>
    pipe_ (
      mtradition_id,
      bindF (tradition_id => pipe_ (
                               staticData,
                               SDA.blessedTraditions,
                               find (trad => BTA.numId (trad) === tradition_id)
                             )),
      fmap (tradition =>
        pipe_ (
          curr,
          LCBCA.aspects,
          mapMaybe (pipe (
                     ensure (isAspectOfTradition (tradition)),
                     bindF (lookupF (SDA.aspects (staticData))),
                     fmap (NumIdName.A.name)
                   )),
        List.elem (14) (LCBCA.tradition (curr))
          ? consF (BTA.name (tradition))
          : ident,
        xs => fnull (xs)
              ? mapMaybe (pipe (
                           lookupF (SDA.aspects (staticData)),
                           fmap (NumIdName.A.name)
                         ))
                         (LCBCA.aspects (curr))
              : xs,
        sortStrings (staticData),
        intercalate (", ")
      )),
      fromMaybe ("")
    )

/**
 * Returns the final Group/Aspects string for list display.
 */
export const getLCAddText =
  (staticData : StaticDataRecord) =>
  (sortOrder : ChantsSortOptions) =>
  (aspects_str : string) =>
  (curr : Record<LiturgicalChantWithRequirements>) =>
    pipe_ (
      guard (sortOrder === "group"),
      thenF (lookup (LCWRA_.gr (curr))
                    (SDA.liturgicalChantGroups (staticData))),
      maybe (aspects_str)
            (pipe (NumIdName.A.name, gr_str => `${aspects_str} / ${gr_str}`))
    )
