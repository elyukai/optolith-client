import * as R from 'ramda';
import * as React from 'react';
import { isNumber, isString } from 'util';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Page } from '../../components/Page';
import { TextField } from '../../components/TextField';
import { InputTextEvent, Pact } from '../../types/data';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';
import { getRoman } from '../../utils/NumberUtils';

export interface PactSettingsOwnProps {
  locale: UIMessagesObject;
}

export interface PactSettingsStateProps {
  pact: Maybe<Record<Pact>>;
  isPactValid: boolean;
  isPactEditable: Maybe<boolean>;
}

export interface PactSettingsDispatchProps {
  setPactCategory (category: Maybe<number>): void;
  setPactLevel (level: Maybe<number>): void;
  setTargetType (level: Maybe<number>): void;
  setTargetDomain (domain: Maybe<number | string>): void;
  setTargetName (name: string): void;
}

export type PactSettingsProps =
  PactSettingsStateProps
  & PactSettingsDispatchProps
  & PactSettingsOwnProps;

export function PactSettings (props: PactSettingsProps) {
  const {
    pact: maybePact,
    isPactEditable,
    setPactCategory,
    setPactLevel,
    setTargetDomain,
    setTargetName,
    setTargetType,
    locale,
  } = props;

  const isPactNotEditable = Maybe.elem (false) (isPactEditable);

  return (
    <Page id="pact">
      <div className="pact-content">
        <Dropdown
          label={translate (locale, 'pact.category')}
          options={List.of<DropdownOption> (
            {
              id: Nothing (),
              name: translate (locale, 'pact.nopact'),
            },
            ...translate (locale, 'pact.categories')
              .imap (index => name => ({
                id: Just (index + 1),
                name,
              }))
          )}
          onChange={setPactCategory}
          value={maybePact .fmap (Record.get<Pact, 'category'> ('category'))}
          disabled={isPactNotEditable}
          />
        <Dropdown
          label={translate (locale, 'pact.level')}
          options={List.unfoldr
            ((id: number) => id > 3
              ? Nothing ()
              : Just (
                Tuple.of<DropdownOption, number>
                  ({
                    id: Just (id),
                    name: getRoman (id),
                    disabled: !Maybe.isJust (maybePact)
                      || isPactNotEditable && id <= Maybe.fromJust (maybePact) .get ('level'),
                  })
                  (R.inc (id))
              ))
            (1)}
          onChange={setPactLevel}
          value={maybePact .fmap (Record.get<Pact, 'level'> ('level'))}
          disabled={Maybe.isNothing (maybePact)}
          />
        <Dropdown
          label={translate (locale, 'pact.fairytype')}
          options={
            translate (locale, 'pact.fairytypes')
              .imap (index => name => ({
                id: Just (index + 1),
                name,
              }))
          }
          onChange={setTargetType}
          value={maybePact .fmap (Record.get<Pact, 'type'> ('type'))}
          disabled={isPactNotEditable || Maybe.isNothing (maybePact)}
          />
        <Dropdown
          label={translate (locale, 'domain')}
          options={
            translate (locale, 'pact.fairydomains')
              .imap (index => name => ({
                id: Just (index + 1),
                name,
              }))
          }
          onChange={setTargetDomain}
          value={
            maybePact
              .fmap (Record.get<Pact, 'domain'> ('domain'))
              .bind (Maybe.ensure (isNumber))
          }
          disabled={
            isPactNotEditable
            || !Maybe.isJust (maybePact)
            || Maybe.elem
              (true)
              (maybePact
                .fmap (Record.get<Pact, 'domain'> ('domain'))
                .fmap (domain => typeof domain === 'string' && domain.length > 0))}
          />
        <TextField
          label={`${translate (locale, 'domain')} (${translate (locale, 'userdefined')})`}
          hint={
            maybePact
              .fmap (Record.get<Pact, 'domain'> ('domain'))
              .bind (Maybe.ensure (isNumber))
              .bind (R.pipe (
                R.dec,
                List.subscript (translate (locale, 'pact.fairydomains'))
              ))
          }
          onChange={(event: InputTextEvent) => setTargetDomain (Just (event.target.value))}
          value={
            maybePact
              .fmap (Record.get<Pact, 'domain'> ('domain'))
              .bind (Maybe.ensure (isString))
          }
          disabled={isPactNotEditable || Maybe.isNothing (maybePact)}
          />
        <TextField
          label={translate (locale, 'name')}
          onChange={(event: InputTextEvent) => setTargetName (event.target.value)}
          value={maybePact .fmap (Record.get<Pact, 'name'> ('name'))}
          disabled={isPactNotEditable || Maybe.isNothing (maybePact)}
          />
      </div>
    </Page>
  );
}
