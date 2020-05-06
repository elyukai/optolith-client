import * as React from "react"
import { isNumber, isString } from "util"
import { equals } from "../../../Data/Eq"
import { flip } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { consF, drop, find, List, map, notNullStr, take } from "../../../Data/List"
import { and, ap, bind, bindF, ensure, fromJust, isJust, isNothing, join, Just, Maybe, maybe, maybeToUndefined } from "../../../Data/Maybe"
import { gte } from "../../../Data/Num"
import { elems, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Pact } from "../../Models/Hero/Pact"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { PactCategory } from "../../Models/Wiki/PactCategory"
import { PactDomain } from "../../Models/Wiki/PactDomain"
import { PactType } from "../../Models/Wiki/PactType"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { getCustomLevelElements } from "../../Utilities/levelUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { misNumberM, misStringM } from "../../Utilities/typeCheckUtils"
import { Checkbox } from "../Universal/Checkbox"
import { Dropdown } from "../Universal/Dropdown"
import { Page } from "../Universal/Page"
import { TextFieldLazy } from "../Universal/TextFieldLazy"

const SDA = StaticData.A
const PA = Pact.A
const PCA = PactCategory.A
const PTA = PactType.A
const PDA = PactDomain.A

export interface PactSettingsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface PactSettingsStateProps {
  pact: Maybe<Record<Pact>>
  isPactValid: boolean
  isPactEditable: boolean
}

export interface PactSettingsDispatchProps {
  setPactCategory (category: Maybe<number>): void
  setPactLevel (level: Maybe<number>): void
  setTargetType (level: Maybe<number>): void
  setTargetDomain (domain: Maybe<number | string>): void
  setTargetName (name: string): void
}

export type PactSettingsProps =
  PactSettingsStateProps
  & PactSettingsDispatchProps
  & PactSettingsOwnProps

export const PactSettings: React.FC<PactSettingsProps> = props => {
  const {
    pact: mpact,
    isPactEditable,
    setPactCategory,
    setPactLevel,
    setTargetDomain,
    setTargetName,
    setTargetType,
    staticData,
    isPactValid,
  } = props

  const checked = maybe (false) (pipe (PA.level, equals (0))) (mpact)

  const pacts = SDA.pacts (staticData)

  const mpact_category = pipe_ (mpact, bindF (pipe (PA.category, lookupF (pacts))))

  const setCustomTargetDomain =
    React.useCallback (
      (text: string) => pipe_ (text, Just, setTargetDomain),
      [ setTargetDomain ]
    )

  const setLesserPactLevel =
    React.useCallback (
      () => checked ? setPactLevel (Just (1)) : setPactLevel (Just (0)),
      [ checked, setPactLevel ]
    )

  return (
    <Page id="pact">
      <div className="pact-content">
        {!isPactValid && isJust (mpact)
          ? (
            <p>{translate (staticData) ("pacts.pactisincompletehint")}</p>
          )
          : null}
        <Dropdown
          label={translate (staticData) ("pacts.pactcategory")}
          options={pipe_ (
                          pacts,
                          elems,
                          map ((pc: Record<PactCategory>) => DropdownOption ({
                                                               id: Just (PactCategory.A.id (pc)),
                                                               name: PactCategory.A.name (pc),
                                                             })),
                          consF (DropdownOption ({
                            name: translate (staticData) ("pacts.nopact"),
                          }))
                      )}
          onChange={setPactCategory}
          value={fmapF (mpact) (Pact.A.category)}
          disabled={!isPactEditable}
          />
        {(maybe (false) (pipe (Pact.A.category, equals (2))) (mpact))
          ? (
            <Checkbox
              label={translate (staticData) ("pacts.minorpact")}
              checked={checked}
              onClick={setLesserPactLevel}
              disabled={
                !isPactEditable
                || isNothing (mpact)
                || pipe (Pact.A.level, gte (2)) (fromJust (mpact))
              }
              />
          )
          : null}
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <Dropdown
              label={translate (staticData) ("pacts.circleofdamnation")}
              options={getCustomLevelElements (level => ({
                                                disabled:
                                                  Just (maybe (!isPactEditable)
                                                              (pipe (Pact.A.level, gte (level)))
                                                              (mpact)),
                                              }))
                                              (7)}
              onChange={setPactLevel}
              value={fmapF (mpact) (Pact.A.level)}
              disabled={isNothing (mpact) || pipe (Pact.A.level, equals (0)) (fromJust (mpact))}
              />
          )
          : (
            <Dropdown
              label={translate (staticData) ("pacts.pactlevel")}
              options={getCustomLevelElements (level => ({
                                                disabled:
                                                  Just (maybe (!isPactEditable)
                                                              (pipe (Pact.A.level, gte (level)))
                                                              (mpact)),
                                              }))
                                              (3)}
              onChange={setPactLevel}
              value={fmapF (mpact) (Pact.A.level)}
              disabled={isNothing (mpact)}
              />
          )}
        <Dropdown
          label={
            maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
            ? translate (staticData) ("pacts.demontype")
            : translate (staticData) ("pacts.fairytype")
          }
          options={pipe_ (
            mpact_category,
            maybe (List<Record<DropdownOption<number>>> ())
                  (pipe (
                    PCA.types,
                    map (pt => DropdownOption ({
                                 id: Just (PTA.id (pt)),
                                 name: PTA.name (pt),
                               }))
                  ))
          )}
          onChange={setTargetType}
          value={fmapF (mpact) (Pact.A.type)}
          disabled={!isPactEditable || isNothing (mpact)}
          />
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <Dropdown
              label={translate (staticData) ("pacts.domain")}
              options={pipe_ (
                mpact_category,
                maybe (List<Record<DropdownOption<number>>> ())
                      (pipe (
                        PCA.domains,
                        map (pd => DropdownOption ({
                                     id: Just (PDA.id (pd)),
                                     name: PDA.name (pd),
                                   }))
                      )),
                maybe (false) (pipe (Pact.A.type, equals (1))) (mpact) ? take (12) : drop (12)
              )}
              onChange={setTargetDomain}
              value={pipe_ (mpact, fmap (Pact.A.domain), misNumberM)}
              disabled={
                !isPactEditable
                || pipe_ (
                     mpact,
                     fmap (pipe (
                       Pact.A.domain,
                       d => isString (d) && notNullStr (d)
                     )),
                     and
                   )
              }
              />
          )
          : (
            <Dropdown
              label={translate (staticData) ("pacts.domain")}
              options={pipe_ (
                mpact_category,
                maybe (List<Record<DropdownOption<number>>> ())
                      (pipe (
                        PCA.domains,
                        map (pd => DropdownOption ({
                                     id: Just (PDA.id (pd)),
                                     name: PDA.name (pd),
                                   }))
                      ))
              )}
              onChange={setTargetDomain}
              value={pipe_ (mpact, fmap (Pact.A.domain), misNumberM)}
              disabled={
                !isPactEditable
                || pipe_ (
                     mpact,
                     fmap (pipe (
                       Pact.A.domain,
                       d => isString (d) && notNullStr (d)
                     )),
                     and
                   )
              }
              />
          )}
        <TextFieldLazy
          label={`${translate (staticData) ("pacts.domain")} (${translate (staticData) ("pacts.userdefined")})`}
          hint={pipe_ (
            bind (mpact) (pipe (Pact.A.domain, ensure (isNumber))),
            ap (pipe_ (
                  mpact_category,
                  fmap (pipe (
                    PCA.domains,
                    flip ((domain: number) => find (pipe (PDA.id, equals (domain))))
                  ))
                )),
            join,
            fmap (PDA.name)
          )}
          onChange={setCustomTargetDomain}
          value={pipe_ (mpact, fmap (Pact.A.domain), misStringM, maybeToUndefined)}
          disabled={
            !isPactEditable
            || isNothing (mpact)
            || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          }
          />
        <TextFieldLazy
          label={translate (staticData) ("pacts.name")}
          onChange={setTargetName}
          value={maybeToUndefined (fmapF (mpact) (Pact.A.name))}
          disabled={
            !isPactEditable
            || isNothing (mpact)
            || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          }
          />
      </div>
    </Page>
  )
}
