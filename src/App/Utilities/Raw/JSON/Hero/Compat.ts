import { gte, lt, lte } from "semver"
import { RawHero as RawHeroFromSchema } from "../../../../../../app/Schema/Hero/Hero"
import { notP } from "../../../../../Data/Bool"
import { fmap } from "../../../../../Data/Functor"
import { all } from "../../../../../Data/List"
import { bindF, ensure, fromMaybe, Maybe, maybe_ } from "../../../../../Data/Maybe"
import { lookupF } from "../../../../../Data/OrderedMap"
import { Culture } from "../../../../Models/Wiki/Culture"
import { L10n } from "../../../../Models/Wiki/L10n"
import { IncreaseSkill } from "../../../../Models/Wiki/sub/IncreaseSkill"
import { StaticData, StaticDataRecord } from "../../../../Models/Wiki/WikiModel"
import { current_version } from "../../../../Selectors/envSelectors"
import { getBlessedTradStrIdFromNumId, getMagicalTraditionInstanceIdByNumericId } from "../../../IDUtils"
import { hasOwnProperty } from "../../../Object"
import { pipe, pipe_ } from "../../../pipe"
import { isNumber } from "../../../typeCheckUtils"
import { RawCustomItem120alpha11, RawCustomItem130alpha2, RawHero, RawHero120alpha11, RawHero130alpha2, RawHeroBase } from "../../RawData"

const SDA = StaticData.A

export const MIN_SUPPORTED_VERSION = "0.49.5"
export const MAX_SUPPORTED_VERSION = current_version

const shallowClone = <A extends object> (x: A): A => ({ ...x })

const fromEntries =
  <A> (xs: [string, A][]): { [key: string]: A } => {
    const obj: { [key: string]: A } = {}

    xs.forEach (x => {
      obj [x[0]] = x[1]
    })

    return obj
  }

const convertLT =
  (lower_than_version: string) =>
  <H1 extends RawHeroBase, H2 extends RawHeroBase> (f: (old: H1) => H2) =>
  (hero: H1): H2 =>
    lt (hero.clientVersion, lower_than_version)
      ? { ...(f (hero)), clientVersion: lower_than_version }
      : hero as unknown as H2

export const convertHero =
  (staticData: StaticDataRecord): (orig_hero: RawHeroFromSchema) => Maybe<RawHero> =>
    pipe (
      shallowClone,
      ensure ((hero: RawHeroFromSchema) => gte (hero .clientVersion, MIN_SUPPORTED_VERSION)
                                           && lte (hero .clientVersion, MAX_SUPPORTED_VERSION)),
      fmap (pipe (
        pipe (
          convertLT ("0.51.1-alpha.2")
                    (hero => {
                      const entry = { ...hero }

                      const oldRaceId = entry.r

                      switch (oldRaceId) {
                        case "R_1":
                          entry.r = "R_1"
                          entry.rv = "RV_1"
                          break
                        case "R_2":
                          entry.r = "R_1"
                          entry.rv = "RV_2"
                          break
                        case "R_3":
                          entry.r = "R_1"
                          entry.rv = "RV_3"
                          break
                        case "R_4":
                          entry.r = "R_1"
                          entry.rv = "RV_4"
                          break
                        case "R_5":
                          entry.r = "R_1"
                          entry.rv = "RV_5"
                          break
                        case "R_6":
                          entry.r = "R_1"
                          entry.rv = "RV_6"
                          break
                        case "R_7":
                          entry.r = "R_1"
                          entry.rv = "RV_7"
                          break
                        case "R_8":
                          entry.r = "R_2"
                          entry.rv = "RV_1"
                          break
                        case "R_9":
                          entry.r = "R_2"
                          entry.rv = "RV_2"
                          break
                        case "R_10":
                          entry.r = "R_2"
                          entry.rv = "RV_3"
                          break
                        case "R_11":
                          entry.r = "R_3"
                          break
                        case "R_12":
                          entry.r = "R_4"
                          break
                        default:
                          break
                      }

                      entry.rules = {
                        ...entry.rules,
                        enableAllRuleBooks: true,
                        enabledRuleBooks: [],
                      }

                      entry.clientVersion = "0.51.1"

                      return entry as RawHero120alpha11
                    }),
          convertLT ("0.51.3-alpha.4")
                    (hero => {
                      const entry = { ...hero }

                      if (hasOwnProperty ("SA_243") (entry.activatable)
                          && hasOwnProperty ("SA_255") (entry.activatable)) {
                        const { SA_255: _, ...other } = entry.activatable
                        entry.activatable = other

                        // @ts-ignore
                        entry.ap.spent -= 10
                      }
                      else if (hasOwnProperty ("SA_255") (entry.activatable)) {
                        const { SA_255: arr, ...other } = entry.activatable
                        entry.activatable = {
                          ...other,
                          SA_243: arr,
                        }
                      }

                      entry.clientVersion = "0.51.3"

                      return entry
                    }),
          convertLT ("0.51.4-alpha.7")
                    (hero => {
                      const entry = { ...hero }

                      if (hasOwnProperty ("SA_344") (entry.activatable)) {
                        entry.activatable = {
                          ...entry.activatable,
                          SA_344: [ { sid: "CT_3" } ],
                        }
                      }

                      if (hasOwnProperty ("SA_345") (entry.activatable)) {
                        const { SA_344: arr, ...other } = entry.activatable
                        if (Array.isArray (arr)) {
                          entry.activatable = {
                            ...other,
                            SA_344: [ ...arr, { sid: "CT_12" } ],
                          }
                        }
                        else {
                          entry.activatable = {
                            ...other,
                            SA_344: [ { sid: "CT_12" } ],
                          }
                        }
                      }

                      if (hasOwnProperty ("SA_346") (entry.activatable)) {
                        const { SA_344: arr, ...other } = entry.activatable
                        if (Array.isArray (arr)) {
                          entry.activatable = {
                            ...other,
                            SA_344: [ ...arr, { sid: "CT_16" } ],
                          }
                        }
                        else {
                          entry.activatable = {
                            ...other,
                            SA_344: [ { sid: "CT_16" } ],
                          }
                        }
                      }

                      if (hasOwnProperty ("SA_70") (entry.activatable)) {
                        const { SA_70: arr, ...other } = entry.activatable
                        entry.activatable = other
                        for (const active of arr) {
                          const { sid, sid2 } = active
                          const id = getMagicalTraditionInstanceIdByNumericId (sid as number)

                          // @ts-ignore
                          entry.activatable[fromMaybe ("SA_70") (id)] = [ { sid: sid2 } ]
                        }
                      }

                      if (hasOwnProperty ("SA_86") (entry.activatable)) {
                        const { SA_86: arr, ...other } = entry.activatable
                        entry.activatable = other
                        for (const active of arr) {
                          const { sid, sid2 } = active
                          const id = getBlessedTradStrIdFromNumId (sid as number)

                          // @ts-ignore
                          entry.activatable[fromMaybe ("SA_86") (id)] = [ { sid: sid2 } ]
                        }
                      }

                      if (hasOwnProperty ("DISADV_34") (entry.activatable)) {
                        entry.activatable = {
                          ...entry.activatable,
                          DISADV_34: entry.activatable.DISADV_34.map (e => {
                            switch (e.sid) {
                              case 5:
                                return { sid: 1, tier: 2 }
                              case 6:
                                return { sid: 5, tier: 2 }
                              case 7:
                                return { sid: 6, tier: 2 }
                              case 8:
                                return { sid: 7, tier: 2 }
                              case 9:
                                return { sid: 8, tier: 2 }
                              case 10:
                                return { sid: 9, tier: 2 }
                              case 11:
                                return { sid: 10, tier: 2 }
                              case 12:
                                return { sid: 11, tier: 2 }
                              case 13:
                                return { sid: 1, tier: 3 }
                              case 14:
                                return { sid: 12, tier: 3 }
                              default:
                                return e
                            }
                          }),
                        }
                      }

                      entry.clientVersion = "0.51.4"

                      return entry
                    }),
          convertLT ("1.0.0")
                    (hero => {
                      const entry = { ...hero }

                      if (
                        hasOwnProperty ("DISADV_45") (entry.activatable)
                        && entry.activatable.DISADV_45.some (e => e.sid === 1)
                      ) {
                        entry.pers.haircolor = 24
                        entry.pers.eyecolor = 19
                      }

                      return entry
                    }),
          convertLT ("1.0.2")
                    (hero => {
                      const adjValue = hero.r === "R_1" || hero.r === "R_3"
                                       ? 1
                                       : hero.r === "R_2" || hero.r === "R_4"
                                       ? -2
                                       : 0

                      // @ts-ignore
                      let index = hero.attr.values.findIndex (e => e[2] === adjValue)

                      if (index === -1) {
                        // @ts-ignore
                        index = hero.attr.values.findIndex (e => e[2] !== 0)
                      }

                      return {
                        ...hero,
                        attr: {
                          ...hero.attr,
                          values: hero.attr.values.map ((e, i) => {
                            // @ts-ignore
                            const inter = [ ...e ] as [string, number, number]
                            inter[2] = i === index ? adjValue : 0

                            return inter
                          }),
                        },
                      } as unknown as RawHero
                    }),
          convertLT ("1.1.0-alpha.1")
                    (hero =>
                    ({
                      ...hero,
                      attr: {
                        ...hero.attr,

                        // @ts-ignore
                        values: hero .attr .values .map (e => ({ id: e[0], value: e[1] })),
                        attributeAdjustmentSelected: [ "R_1", "R_3" ] .includes (hero .r!)
                          ? hero .attr .values .reduce (

                            // @ts-ignore
                            (acc, e) => e[2] === 1 ? e[0] : acc,
                            "ATTR_1"
                          )
                          : hero .r === "R_2"
                          ? hero .attr .values .reduce (

                            // @ts-ignore
                            (acc, e) => e[0] === "ATTR_2" && e[2] === 1 ? e[0] : acc,
                            "ATTR_8"
                          )
                          : hero .attr .values .reduce (

                            // @ts-ignore
                            (acc, e) => e[0] === "ATTR_4" && e[2] === 1 ? e[0] : acc,
                            "ATTR_6"
                          ),
                      },

                      // ct: Object.entries (hero.ct)
                      //   .reduce<StringKeyObject<number>> ((acc, e) => ({ ...acc, [e[0]]: e[1] - 6 }), {}),
                    })),
          convertLT ("1.1.0-alpha.9")
                    ((hero): RawHero120alpha11 => ({
                      ...hero,
                      locale: L10n.A.id (SDA.ui (staticData)),
                      belongings: {
                        ...hero.belongings,
                        items: pipe_ (
                          hero.belongings.items,
                          Object.entries,
                          (xs: [string, RawCustomItem120alpha11][]) =>
                            xs .map<[string, RawCustomItem120alpha11]> (
                              x => [
                                x[0],
                                {
                                  ...x[1],
                                  reloadTime:
                                    isNumber (x[1].reloadTime)
                                      ? (x[1].reloadTime as number).toString ()
                                      : x[1].reloadTime,
                                  stp:
                                    isNumber (x[1].stp)
                                      ? (x[1].stp as number).toString ()
                                      : x[1].stp,
                                },
                              ]
                            ),
                          fromEntries
                        ),
                      },
                    })),
          convertLT ("1.1.0-alpha.18")
                    (hero => hero.activatable.DISADV_48 === undefined
                      ? hero
                      : ({
                          ...hero,
                          activatable: {
                            ...hero.activatable,
                            DISADV_48:
                              hero.activatable.DISADV_48
                                .filter (activeObj => typeof activeObj .sid === "string"
                                                      && /^TAL_/u .test (activeObj .sid)),
                          },
                        })),
          convertLT ("1.1.0-alpha.20")
                    (hero => {
                      let activatable = { ...hero.activatable }

                      const editBase = (base: string) => {
                        if (activatable [base] !== undefined && activatable [base] .length === 1) {
                          activatable = {
                            ...activatable,
                            [base]: [ { sid: 1 } ],
                          }
                        }
                      }

                      const editOther = (base: string) => (id: string) => (sid: number) => {
                        if (activatable [id] !== undefined && activatable [id] .length === 1) {
                          activatable = {
                            ...activatable,
                            [base]: activatable [base] === undefined
                              ? [ { sid } ]
                              : [ ...activatable [base], { sid } ],
                          }
                        }
                      }

                      editBase ("ADV_18")
                      editOther ("ADV_18") ("ADV_19") (2)
                      editOther ("ADV_18") ("ADV_20") (3)
                      editOther ("ADV_18") ("ADV_21") (4)

                      editBase ("DISADV_7")
                      editOther ("DISADV_7") ("DISADV_8") (2)
                      editOther ("DISADV_7") ("DISADV_9") (3)
                      editOther ("DISADV_7") ("DISADV_10") (4)

                      return ({
                        ...hero,
                        activatable,
                      })
                    }),
          convertLT ("1.2.0-alpha.6")
                    (hero => pipe_ (

                      // Try to infer if player used cultural package
                      // To check that, we compare all skills of the cultural package
                      // if the actual SRs from the character are at least as high
                      // as the bonus from the package is
                      Maybe (hero .c),
                      bindF (lookupF (SDA.cultures (staticData))),
                      maybe_ (() => ({
                               ...hero,
                               isCulturalPackageActive: false,
                             }))
                             (pipe (
                               Culture.A.culturalPackageSkills,
                               all (skill => hero .talents [IncreaseSkill.A.id (skill)]
                                             >= IncreaseSkill.A.value (skill)),
                               isCulturalPackageActive => ({
                                 ...hero,
                                 isCulturalPackageActive,
                               })
                             ))
                    )),
          convertLT ("1.2.0-alpha.7")

                    // Fix Stigma (Green Hair) actually allow green hair in
                    // personal data
                    ((hero: RawHero120alpha11) =>
                      hasOwnProperty ("DISADV_45") (hero .activatable)
                      && hero .activatable .DISADV_45 .some (e => e .sid === 3)
                      ? {
                        ...hero,
                        pers: {
                          ...hero.pers,
                          haircolor: 25,
                        },
                      }
                      : hero)
        ),
        pipe (
          convertLT ("1.2.0-alpha.11")

                    // Fix Stigma (Green Hair) actually allow green hair in
                    // personal data
                    (hero => hasOwnProperty ("SA_250") (hero .activatable)
                      && hero .activatable .SA_250
                        .some (e => Object.keys (hero .spells) .every (id => id !== e.sid))
                      ? {
                        ...hero,
                        activatable: {
                          SA_250: [],
                        },
                      }
                      : hero),
          convertLT ("1.3.0-alpha.2")

                    // Fix different types for structure points and reload time
                    // for items
                    ((hero: RawHero120alpha11): RawHero130alpha2 => ({
                      ...hero,
                      belongings: {
                        ...hero.belongings,
                        items: pipe_ (
                          hero.belongings.items,
                          Object.entries,
                          items => items.map (
                            ([ k, h ]: [string, RawCustomItem120alpha11]):
                              [string, RawCustomItem130alpha2] => [
                                k,
                                {
                                  ...h,
                                  reloadTime: h.reloadTime === undefined
                                              ? undefined
                                              : pipe_ (
                                                  h.reloadTime
                                                    .split ("/")
                                                    .map (x => Number.parseInt (x, 10))
                                                    .filter (notP (Number.isNaN)),
                                                  xs => xs.length === 0
                                                        ? undefined
                                                        : xs.length === 1
                                                        ? xs[0]
                                                        : xs
                                                ),
                                  stp: h.reloadTime === undefined
                                       ? undefined
                                       : pipe_ (
                                           h.reloadTime
                                             .split ("/")
                                             .map (x => Number.parseInt (x, 10))
                                             .filter (notP (Number.isNaN)),
                                           xs => xs.length === 0
                                                 ? undefined
                                                 : xs.length === 1
                                                 ? xs[0]
                                                 : xs
                                         ),
                                  primaryThreshold: h.primaryThreshold === undefined
                                                    ? undefined
                                                    : h.primaryThreshold.primary === undefined
                                                    ? h.primaryThreshold
                                                    : {
                                                      ...h.primaryThreshold,
                                                      primary:
                                                        h.primaryThreshold.primary === "ATTR_6_8"
                                                        ? [ "ATTR_6", "ATTR_8" ]
                                                        : h.primaryThreshold.primary,
                                                    },
                                },
                              ]
                          ),
                          Object.fromEntries
                        ),
                      },
                    }))
        )
      ))
    )
