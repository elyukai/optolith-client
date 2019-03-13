import * as React from 'react';
import { Attribute, Book, CombatTechnique, ItemTemplate } from '../../App/Models/Wiki/wikiTypeHelpers';
import { localizeNumber, localizeSize, localizeWeight, translate, UIMessages } from '../../App/Utils/I18n';
import { convertPrimaryAttributeToArray } from '../../App/Utils/ItemUtils';
import { sign, signNull } from '../../App/Utils/NumberUtils';
import { Markdown } from '../../components/Markdown';
import { WikiSource } from './elements/WikiSource';
import { WikiBoxTemplate } from './WikiBoxTemplate';

export interface WikiEquipmentInfoProps {
  attributes: Map<string, Attribute>;
  books: Map<string, Book>;
  combatTechniques: Map<string, CombatTechnique>;
  currentObject: ItemTemplate;
  locale: UIMessages;
  templates: Map<string, ItemTemplate>;
}

export function WikiEquipmentInfo(props: WikiEquipmentInfoProps) {
  const { attributes, currentObject, locale, combatTechniques, templates } = props;
  const { gr, name, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, movMod, iniMod, addPenalties, src } = currentObject;

  const ammunitionTemplate = typeof ammunition === 'string' && templates.get(ammunition);

  const addPenaltiesArr = [];

  if (addPenalties === true) {
    addPenaltiesArr.push(`-${1 + (movMod || 0)} GS`);
  }

  if (addPenalties === true) {
    addPenaltiesArr.push(`-${1 + (iniMod || 0)} INI`);
  }

  const combatTechniqueInstance = combatTechnique && combatTechniques.get(combatTechnique);

  const primaryAttributeIdArray = damageBonus && typeof damageBonus.primary === 'string' && convertPrimaryAttributeToArray(damageBonus.primary) || combatTechniqueInstance && combatTechniqueInstance.primary;

  return (
    <WikiBoxTemplate
      className="item"
      title={name}
      subtitle={gr === 3 && (
        <p className="title">
          {translate(locale, 'equipment.view.list.ammunitionsubtitle')}
        </p>
      )}
      >
      {gr === 3 && <p className="ammunition">{translate(locale, 'equipment.view.list.ammunitionsubtitle')}</p>}
      { ![1, 2, 4].includes(gr) && <table className="melee">
        <tbody>
          {typeof weight === 'number' && weight > 0 && <tr>
            <td>{translate(locale, 'equipment.view.list.weight')}</td>
            <td>{`${localizeNumber(localizeWeight(weight, locale.id), locale.id)} ${translate(locale, 'equipment.view.list.weightunit')}`}</td>
          </tr>}
          {typeof price === 'number' && price > 0 && <tr>
            <td>{translate(locale, 'equipment.view.list.price')}</td>
            <td>{`${localizeNumber(price, locale.id)} ${translate(locale, 'equipment.view.list.priceunit')}`}</td>
          </tr>}
        </tbody>
      </table>}
      { gr === 1 ? <table className="melee">
        <tbody>
          <tr>
            <td>{translate(locale, 'equipment.view.list.combattechnique')}</td>
            <td>
              {combatTechniqueInstance && combatTechniqueInstance.name}
            </td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.damage')}</td>
            <td>
              {damageDiceNumber}
              {translate(locale, 'equipment.view.list.dice')}
              {damageDiceSides}
              {typeof damageFlat === 'number' ? signNull(damageFlat) : null}
            </td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.primaryattributedamagethreshold')}</td>
            <td>{combatTechnique === 'CT_7' && '-' || primaryAttributeIdArray && damageBonus && (Array.isArray(damageBonus.threshold) ? primaryAttributeIdArray.map((attr, index) => `${attributes.get(attr)!.short} ${(damageBonus.threshold as number[])[index]}`).join('/') : `${primaryAttributeIdArray.map(attr => attributes.get(attr)!.short).join('/')} ${damageBonus.threshold}`)}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.atpamod')}</td>
            <td>{combatTechnique === 'CT_7' ? '-' : `${at && sign(at)}/${pa && sign(pa)}`}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.reach')}</td>
            <td>{combatTechnique === 'CT_7' && '-' || reach && translate(locale, 'equipment.view.list.reachlabels')[reach - 1]}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.weight')}</td>
            <td>{weight && `${localizeNumber(localizeWeight(weight, locale.id), locale.id)} ${translate(locale, 'equipment.view.list.weightunit')}`}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.length')}</td>
            <td>{localizeNumber(localizeSize(length, locale.id), locale.id)} {translate(locale, 'equipment.view.list.lengthunit')}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.price')}</td>
            <td>{price && `${localizeNumber(price, locale.id)} ${translate(locale, 'equipment.view.list.priceunit')}`}</td>
          </tr>
        </tbody>
      </table> : null}
      { gr === 2 ? <table className="ranged">
        <tbody>
          <tr>
            <td>{translate(locale, 'equipment.view.list.combattechnique')}</td>
            <td>
              {combatTechniqueInstance && combatTechniqueInstance.name}
            </td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.damage')}</td>
            <td>
              {damageDiceNumber}
              {translate(locale, 'equipment.view.list.dice')}
              {damageDiceSides}
              {typeof damageFlat === 'number' ? signNull(damageFlat) : null}
            </td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.reloadtime')}</td>
            <td>{reloadTime} {translate(locale, 'equipment.view.list.reloadtimeunit')}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.range')}</td>
            <td>{range && range.join('/')}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.ammunition')}</td>
            <td>{(ammunitionTemplate || { name: translate(locale, 'options.none')} ).name}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.weight')}</td>
            <td>{weight && `${localizeNumber(localizeWeight(weight, locale.id), locale.id)} ${translate(locale, 'equipment.view.list.weightunit')}`}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.length')}</td>
            <td>{localizeNumber(localizeSize(length, locale.id), locale.id)} {translate(locale, 'equipment.view.list.lengthunit')}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.price')}</td>
            <td>{price && `${localizeNumber(price, locale.id)} ${translate(locale, 'equipment.view.list.priceunit')}`}</td>
          </tr>
        </tbody>
      </table> : null}
      { gr === 4 ? <table className="armor">
        <tbody>
          <tr>
            <td>{translate(locale, 'equipment.view.list.pro')}</td>
            <td>{pro}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.enc')}</td>
            <td>{enc}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.weight')}</td>
            <td>{weight && `${localizeNumber(localizeWeight(weight, locale.id), locale.id)} ${translate(locale, 'equipment.view.list.weightunit')}`}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.price')}</td>
            <td>{price && `${localizeNumber(price, locale.id)} ${translate(locale, 'equipment.view.list.priceunit')}`}</td>
          </tr>
          <tr>
            <td>{translate(locale, 'equipment.view.list.additionalpenalties')}</td>
            <td>{addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}</td>
          </tr>
        </tbody>
      </table> : null}
      {currentObject.isTemplateLocked && currentObject.note && <Markdown source={`**${translate(locale, 'info.note')}:** ${currentObject.note}`} />}
      {currentObject.isTemplateLocked && currentObject.rules && <Markdown source={`**${translate(locale, 'info.equipment.rules')}:** ${currentObject.rules}`} />}
      {currentObject.isTemplateLocked && [1, 2, 4].includes(currentObject.gr) && <Markdown source={`**${[1, 2].includes(currentObject.gr) ? translate(locale, 'info.weaponadvantage') : translate(locale, 'info.armoradvantage')}:** ${currentObject.advantage || translate(locale, 'info.none')}`} />}
      {currentObject.isTemplateLocked && [1, 2, 4].includes(currentObject.gr) && <Markdown source={`**${[1, 2].includes(currentObject.gr) ? translate(locale, 'info.weapondisadvantage') : translate(locale, 'info.armordisadvantage')}:** ${currentObject.disadvantage || translate(locale, 'info.none')}`} />}
      {src && <WikiSource {...props} currentObject={{ src }} />}
    </WikiBoxTemplate>
  );
}
