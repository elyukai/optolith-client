import * as React from 'react';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../utils/I18n';
import { Book, Culture, Race, RaceVariant } from '../../utils/wikiData/wikiTypeHelpers';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';
import { WikiProperty } from './WikiProperty';

export interface WikiRaceInfoProps {
  books: Map<string, Book>;
  cultures: Map<string, Culture>;
  currentObject: Race;
  locale: UIMessages;
  raceVariants: Map<string, RaceVariant>;
}

export function WikiRaceInfo(props: WikiRaceInfoProps) {
  const { cultures, currentObject, locale, raceVariants } = props;

  const {
    name
  } = currentObject;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="race" title={name}>
        <WikiProperty locale={locale} title="info.apvalue">{currentObject.ap} {translate(locale, 'aptext')}</WikiProperty>
        <WikiProperty locale={locale} title="info.lifepointbasevalue">{currentObject.lp}</WikiProperty>
        <WikiProperty locale={locale} title="info.spiritbasevalue">{currentObject.spi}</WikiProperty>
        <WikiProperty locale={locale} title="info.toughnessbasevalue">{currentObject.tou}</WikiProperty>
        <WikiProperty locale={locale} title="info.movementbasevalue">{currentObject.mov}</WikiProperty>
        <WikiSource {...props} />
      </WikiBoxTemplate>
    );
  }

  const variants = currentObject.variants.filter(v => raceVariants.has(v)).map(v => raceVariants.get(v)!);

  const sameCommonCultures = variants.every(e => e.commonCultures.length === 0) || variants.every(e => e.commonCultures.length === 1);
  const sameCommonAdvantages = variants.every(e => e.commonAdvantagesText === undefined);
  const sameCommonDisadvantages = variants.every(e => e.commonDisadvantagesText === undefined);
  const sameUncommonAdvantages = variants.every(e => e.uncommonAdvantagesText === undefined);
  const sameUncommonDisadvantages = variants.every(e => e.uncommonDisadvantagesText === undefined);

  return (
    <WikiBoxTemplate className="race" title={name}>
      <WikiProperty locale={locale} title="info.apvalue">{currentObject.ap} {translate(locale, 'aptext')}</WikiProperty>
      <WikiProperty locale={locale} title="info.lifepointbasevalue">{currentObject.lp}</WikiProperty>
      <WikiProperty locale={locale} title="info.spiritbasevalue">{currentObject.spi}</WikiProperty>
      <WikiProperty locale={locale} title="info.toughnessbasevalue">{currentObject.tou}</WikiProperty>
      <WikiProperty locale={locale} title="info.movementbasevalue">{currentObject.mov}</WikiProperty>
      <WikiProperty locale={locale} title="info.attributeadjustments">{currentObject.attributeAdjustmentsText}</WikiProperty>
      {currentObject.automaticAdvantagesText && <WikiProperty locale={locale} title="info.automaticadvantages">
        {currentObject.automaticAdvantagesText}
      </WikiProperty>}
      {currentObject.stronglyRecommendedAdvantagesText && <WikiProperty locale={locale} title="info.stronglyrecommendedadvantages">
        {currentObject.stronglyRecommendedAdvantagesText}
      </WikiProperty>}
      {currentObject.stronglyRecommendedDisadvantagesText && <WikiProperty locale={locale} title="info.stronglyrecommendeddisadvantages">
        {currentObject.stronglyRecommendedDisadvantagesText}
      </WikiProperty>}
      <WikiProperty locale={locale} title="info.commoncultures">
        {sameCommonCultures && <span>{sortStrings((currentObject.commonCultures.length > 0 ? currentObject.commonCultures.filter(id => cultures.has(id)).map(id => cultures.get(id)!.name) : variants.map(e => e.name)), locale.id).intercalate(', ')}</span>}
      </WikiProperty>
      {!sameCommonCultures && <ul className="race-variant-options">
        {variants.map(e => {
          const commonCultures = e.commonCultures.map(id => cultures.has(id) ? cultures.get(id)!.name : '...');
          return <li key={e.id}>
            <span>{e.name}</span>
            <span>{sortStrings(commonCultures, locale.id).intercalate(', ')}</span>
          </li>;
        })}
      </ul>}
      <WikiProperty locale={locale} title="info.commonadvantages">
        {sameCommonAdvantages && <span>{currentObject.commonAdvantagesText || translate(locale, 'info.none')}</span>}
      </WikiProperty>
      {!sameCommonAdvantages && <ul className="race-variant-options">
        {variants.filter(e => typeof e.commonAdvantagesText === 'string').map(e => {
          return <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.commonAdvantagesText}</span>
          </li>;
        })}
      </ul>}
      <WikiProperty locale={locale} title="info.commondisadvantages">
        {sameCommonDisadvantages && <span>{currentObject.commonDisadvantagesText || translate(locale, 'info.none')}</span>}
      </WikiProperty>
      {!sameCommonDisadvantages && <ul className="race-variant-options">
        {variants.filter(e => typeof e.commonDisadvantagesText === 'string').map(e => {
          return <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.commonDisadvantagesText}</span>
          </li>;
        })}
      </ul>}
      <WikiProperty locale={locale} title="info.uncommonadvantages">
        {sameUncommonAdvantages && <span>{currentObject.uncommonAdvantagesText || translate(locale, 'info.none')}</span>}
      </WikiProperty>
      {!sameUncommonAdvantages && <ul className="race-variant-options">
        {variants.filter(e => typeof e.uncommonAdvantagesText === 'string').map(e => {
          return <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.uncommonAdvantagesText}</span>
          </li>;
        })}
      </ul>}
      <WikiProperty locale={locale} title="info.uncommondisadvantages">
        {sameUncommonDisadvantages && <span>{currentObject.uncommonDisadvantagesText || translate(locale, 'info.none')}</span>}
      </WikiProperty>
      {!sameUncommonDisadvantages && <ul className="race-variant-options">
        {variants.filter(e => typeof e.uncommonDisadvantagesText === 'string').map(e => {
          return <li key={e.id}>
            <span>{e.name}</span>
            <span>{e.uncommonDisadvantagesText}</span>
          </li>;
        })}
      </ul>}
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
