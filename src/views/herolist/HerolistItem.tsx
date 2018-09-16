import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { Hero, User } from '../../types/data';
import { Culture, Profession, ProfessionVariant, Race, RaceVariant, WikiAll } from '../../types/wiki';
import { getAPObject } from '../../utils/adventurePointsSumUtils';
import { Maybe, OrderedMap, OrderedSet, Record } from '../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

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
            {(() => {
              if (Maybe.elem ('P_0') (hero .lookup ('profession'))) {
                return Maybe.fromMaybe (translate (locale, 'professions.ownprofession'))
                                       (hero .lookup ('professionName'));
              }

              const maybeProfession = hero
                .lookup ('profession')
                .bind (
                  id => OrderedMap.lookup<string, Record<Profession>>
                    (id)
                    (wiki .get ('professions'))
                );

              const professionName = maybeProfession
                .fmap (profession => profession .get ('name'))
                .fmap (
                  name => name instanceof Record ? name .get (hero .get ('sex')) : name
                );

              const professionSubName = maybeProfession
                .bind (profession => profession .lookup ('subname'))
                .fmap (
                  subname => subname instanceof Record ? subname .get (hero .get ('sex')) : subname
                );

              const maybeProfessionVariant = hero
                .lookup ('professionVariant')
                .bind (
                  id => OrderedMap.lookup<string, Record<ProfessionVariant>>
                    (id)
                    (wiki .get ('professionVariants'))
                );

              const professionVariantName = maybeProfessionVariant
                .fmap (professionVariant => professionVariant .get ('name'))
                .fmap (
                  name => name instanceof Record ? name .get (hero .get ('sex')) : name
                );

              return Maybe.fromMaybe ('')
                                     (professionName
                                       .fmap (
                                         name => Maybe.fromMaybe (name)
                                                                 (professionSubName
                                                                   .alt (professionVariantName)
                                                                   .fmap (
                                                                     addName =>
                                                                       `${name} (${addName})`
                                                                   ))
                                       ));
            }) ()}
          </span>
          <span className="totalap">
            {adventurePoints.get ('spent')} / {adventurePoints.get ('total')} AP
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator/>
      <ListItemButtons>
        <BorderButton
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
