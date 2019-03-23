import * as React from 'react';
import { Hero, User } from '../../App/Models/Hero/heroTypeHelpers';
import { Culture, Race, RaceVariant, WikiAll } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { getFullProfessionName } from '../../App/Utils/rcpUtils';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { getAPObject } from '../../Utilities/adventurePoints/adventurePointsSumUtils';
import { Maybe, OrderedMap, OrderedSet, Record } from '../../Utilities/dataUtils';

export interface HerolistItemProps {
  hero: Hero;
  wiki: Record<WikiAll>;
  users: OrderedMap<string, User>;
  unsavedHeroesById: OrderedSet<string>;
  locale: UIMessagesObject;
  loadHero (id: string): void;
  saveHero (id: string): void;
  saveHeroAsJSON (id: string): void;
  deleteHero (id: string): void;
  duplicateHero (id: string): void;
}

export function HerolistItem (props: HerolistItemProps) {
  const {
    hero,
    wiki,
    users,
    unsavedHeroesById,
    locale,
    loadHero,
    saveHero,
    saveHeroAsJSON,
    deleteHero,
    duplicateHero,
  } = props;

  const adventurePoints = getAPObject (wiki) (locale) (hero);

  return (
    <ListItem>
      <AvatarWrapper src={hero .lookup ('avatar')} />
      <ListItemName
        name={hero .get ('name')}
        addName={
          hero
            .lookup ('player')
            .bind (id => OrderedMap.lookup<string, User> (id) (users))
            .fmap (user => user.displayName)
        }
        large
        >
        <VerticalList className="rcp">
          <span className="race">
            {Maybe.fromMaybe ('')
                             (hero
                               .lookup ('race')
                               .bind (
                                 id => OrderedMap.lookup<string, Record<Race>>
                                   (id)
                                   (wiki .get ('races'))
                               )
                               .fmap (race => race .get ('name')))}
            {Maybe.fromMaybe ('')
                             (hero
                               .lookup ('raceVariant')
                               .bind (
                                 id => OrderedMap.lookup<string, Record<RaceVariant>>
                                   (id)
                                   (wiki .get ('raceVariants'))
                               )
                               .fmap (raceVariant => ` (${raceVariant .get ('name')})`))}
          </span>
          <span className="culture">
            {Maybe.fromMaybe ('')
                             (hero
                               .lookup ('culture')
                               .bind (
                                 id => OrderedMap.lookup<string, Record<Culture>>
                                   (id)
                                   (wiki .get ('cultures'))
                               )
                               .fmap (culture => culture .get ('name')))}
          </span>
          <span className="profession">
            {getFullProfessionName (locale)
                                   (wiki .get ('professions'))
                                   (wiki .get ('professionVariants'))
                                   (hero .get ('sex'))
                                   (hero .lookup ('profession'))
                                   (hero .lookup ('professionVariant'))
                                   (hero .lookup ('professionName'))}
          </span>
          <span className="totalap">
            {adventurePoints.get ('spent')} / {adventurePoints.get ('total')} AP
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator/>
      <ListItemButtons>
        <BorderButton
          className="save"
          label={translate (locale, 'actions.save')}
          onClick={saveHero.bind (undefined, hero.get ('id'))}
          disabled={unsavedHeroesById .notMember (hero.get ('id'))}
          />
        <IconButton icon="&#xE907;" onClick={duplicateHero.bind (undefined, hero.get ('id'))} />
        <IconButton icon="&#xE914;" onClick={saveHeroAsJSON.bind (undefined, hero.get ('id'))} />
        <IconButton icon="&#xE90b;" onClick={deleteHero.bind (undefined, hero.get ('id'))} />
        <IconButton icon="&#xE90e;" onClick={loadHero.bind (undefined, hero.get ('id'))} />
      </ListItemButtons>
    </ListItem>
  );
}
