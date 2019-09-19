import * as React from "react";
import { isNumber, isString } from "util";
import { equals } from "../../../Data/Eq";
import { fmap, fmapF } from "../../../Data/Functor";
import { consF, drop, imap, notNullStr, subscript, take, unfoldr } from "../../../Data/List";
import { and, bindF, ensure, fromJust, isJust, isNothing, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { dec, gte, inc } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Pact } from "../../Models/Hero/Pact";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { toRoman } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { misNumberM, misStringM } from "../../Utilities/typeCheckUtils";
import { Checkbox } from "../Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { Page } from "../Universal/Page";
import { TextField } from "../Universal/TextField";

export interface PactSettingsOwnProps {
  l10n: L10nRecord
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
    l10n,
    isPactValid,
  } = props

  const checked = maybe (false) (pipe (Pact.A.level, equals (0))) (mpact)

  const setCustomTargetDomain =
    React.useCallback (
      (text: string) => pipe_ (text, Just, setTargetDomain),
      [setTargetDomain]
    )

  const setLesserPactLevel =
    React.useCallback (
      () => checked ? setPactLevel (Just (1)) : setPactLevel (Just (0)),
      [checked, setPactLevel]
    )

  return (
    <Page id="pact">
      <div className="pact-content">
        {!isPactValid && isJust (mpact)
          ? (
            <p>{translate (l10n) ("pactisincompletehint")}</p>
          )
          : null}
        <Dropdown
          label={translate (l10n) ("pactcategory")}
          options={pipe_ (
                          translate (l10n) ("pactcategories"),
                          imap (i => (name: string) => DropdownOption ({
                          id: Just (i + 1),
                          name,
                        })),
                          consF (DropdownOption ({
                          name: translate (l10n) ("nopact"),
                        }))
                      )}
          onChange={setPactCategory}
          value={fmapF (mpact) (Pact.A.category)}
          disabled={!isPactEditable}
          />
        {(maybe (false) (pipe (Pact.A.category, equals (2))) (mpact))
          ? (
            <Checkbox
              label={translate (l10n) ("lesserpact")}
              checked={checked}
              onClick={setLesserPactLevel}
              disabled={!isPactEditable || isNothing (mpact)
                || pipe (Pact.A.level, gte (2)) (fromJust (mpact))}
              />
          )
          : null}
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <Dropdown
              label={translate (l10n) ("circleofdamnation")}
              options={
                unfoldr ((id: number) => id > 7
                          ? Nothing
                          : Just (
                                Pair (
                                  DropdownOption ({
                                    id: Just (id),
                                    name: toRoman (id),
                                    disabled: Just (maybe (!isPactEditable)
                                                          (pipe (Pact.A.level, gte (id)))
                                                          (mpact)),
                                  }),
                                  inc (id)
                                )
                            ))
                        (1)
              }
              onChange={setPactLevel}
              value={fmapF (mpact) (Pact.A.level)}
              disabled={isNothing (mpact) || pipe (Pact.A.level, equals (0)) (fromJust (mpact))}
              />
          )
          : (
            <Dropdown
              label={translate (l10n) ("pactlevel")}
              options={
                unfoldr ((id: number) => id > 3
                          ? Nothing
                          : Just (
                            Pair (
                              DropdownOption ({
                                id: Just (id),
                                name: toRoman (id),
                                disabled: Just (maybe (!isPactEditable)
                                                      (pipe (Pact.A.level, gte (id)))
                                                      (mpact)),
                              }),
                              inc (id)
                            )
                          ))
                        (1)
              }
              onChange={setPactLevel}
              value={fmapF (mpact) (Pact.A.level)}
              disabled={isNothing (mpact)}
              />
          )}
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <Dropdown
              label={translate (l10n) ("demontype")}
              options={(imap (i => (name: string) => DropdownOption ({
                               id: Just (i + 1),
                               name,
                             }))
                             (translate (l10n) ("demontypes")))}
              onChange={setTargetType}
              value={fmapF (mpact) (Pact.A.type)}
              disabled={!isPactEditable || isNothing (mpact)}
              />
          )
          : (
            <Dropdown
              label={translate (l10n) ("fairytype")}
              options={imap (i => (name: string) => DropdownOption ({
                              id: Just (i + 1),
                              name,
                            }))
                            (translate (l10n) ("fairytypes"))}
              onChange={setTargetType}
              value={fmapF (mpact) (Pact.A.type)}
              disabled={!isPactEditable || isNothing (mpact)}
              />
          )}
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <Dropdown
              label={translate (l10n) ("domain")}
              options={
                maybe (false) (pipe (Pact.A.type, equals (1))) (mpact)
                ? take (12)
                       (imap (i => (name: string) => DropdownOption ({
                               id: Just (i + 1),
                               name,
                             }))
                             (translate (l10n) ("demondomains")))
                : drop (12)
                       (imap (i => (name: string) => DropdownOption ({
                         id: Just (i + 1),
                         name,
                       }))
                       (translate (l10n) ("demondomains")))
              }
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
              label={translate (l10n) ("domain")}
              options={imap (i => (name: string) => DropdownOption ({
                              id: Just (i + 1),
                              name,
                            }))
                            (translate (l10n) ("fairydomains"))}
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
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <TextField
              label={`${translate (l10n) ("domain")} (${translate (l10n) ("userdefined")})`}
              hint={pipe_ (
                mpact,
                bindF (pipe (Pact.A.domain, ensure (isNumber))),
                bindF (pipe (dec, subscript (translate (l10n) ("demondomains"))))
              )}
              onChange={setCustomTargetDomain}
              value={pipe_ (mpact, fmap (Pact.A.domain), misStringM)}
              disabled={
                !isPactEditable
                || isNothing (mpact)
                || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
              }
              />
          )
          : (
            <TextField
              label={`${translate (l10n) ("domain")} (${translate (l10n) ("userdefined")})`}
              hint={pipe_ (
                mpact,
                bindF (pipe (Pact.A.domain, ensure (isNumber))),
                bindF (pipe (dec, subscript (translate (l10n) ("fairydomains"))))
              )}
              onChange={setCustomTargetDomain}
              value={pipe_ (mpact, fmap (Pact.A.domain), misStringM)}
              disabled={
                !isPactEditable
                || isNothing (mpact)
                || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
              }
              />
          )}
        {maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
          ? (
            <TextField
              label={translate (l10n) ("name")}
              hint={pipe_ (
                mpact,
                bindF (pipe (Pact.A.domain, ensure (isNumber))),
                bindF (pipe (dec, subscript (translate (l10n) ("demondomains"))))
              )}
              onChange={setTargetName}
              value={fmapF (mpact) (Pact.A.name)}
              disabled={
                !isPactEditable
                || isNothing (mpact)
                || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
              }
              />
          )
          : (
            <TextField
              label={translate (l10n) ("name")}
              onChange={setTargetName}
              value={fmapF (mpact) (Pact.A.name)}
              disabled={
                !isPactEditable
                || isNothing (mpact)
                || maybe (false) (pipe (Pact.A.category, equals (2))) (mpact)
              }
              />
          )}
      </div>
    </Page>
  )
}
