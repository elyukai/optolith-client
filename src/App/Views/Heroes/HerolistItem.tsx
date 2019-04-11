import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { bindF, join, Maybe, maybe } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { notMember, OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { User } from "../../Models/Hero/heroTypeHelpers";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { Culture } from "../../Models/Wiki/Culture";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Race } from "../../Models/Wiki/Race";
import { RaceVariant } from "../../Models/Wiki/RaceVariant";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { getFullProfessionName } from "../../Utilities/rcpUtils";
import { AvatarWrapper } from "../Universal/AvatarWrapper";
import { BorderButton } from "../Universal/BorderButton";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { VerticalList } from "../Universal/VerticalList";

export interface HerolistItemOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface HerolistItemStateProps {
  ap: Maybe<Maybe<Record<AdventurePointsCategories>>>
  wiki: WikiModelRecord
  users: OrderedMap<string, User>
  unsavedHeroesById: OrderedSet<string>
}

export interface HerolistItemDispatchProps {
  loadHero (id: string): void
  showHero (): void
  saveHero (id: string): void
  saveHeroAsJSON (id: string): void
  deleteHero (id: string): void
  duplicateHero (id: string): void
}

export type HerolistItemProps = HerolistItemStateProps
                              & HerolistItemDispatchProps
                              & HerolistItemOwnProps

export function HerolistItem (props: HerolistItemProps) {
  const {
    ap: mmap,
    hero,
    wiki,
    users,
    unsavedHeroesById,
    l10n,
    loadHero,
    saveHero,
    saveHeroAsJSON,
    deleteHero,
    duplicateHero,
  } = props

  const m_ap = join (mmap)

  const id = HeroModel.A.id (hero)

  return (
    <ListItem>
      <AvatarWrapper src={HeroModel.A.avatar (hero)} />
      <ListItemName
        name={HeroModel.A.name (hero)}
        addName={pipe_ (
          hero,
          HeroModel.A.player,
          bindF (lookupF (users)),
          fmap (user => user.displayName)
        )}
        large
        >
        <VerticalList className="rcp">
          <span className="race">
            {pipe_ (
              hero,
              HeroModel.A.race,
              bindF (lookupF (WikiModel.A.races (wiki))),
              fmap (Race.A.name)
            )}
            {pipe_ (
              hero,
              HeroModel.A.raceVariant,
              bindF (lookupF (WikiModel.A.raceVariants (wiki))),
              fmap (pipe (RaceVariant.A.name, x => ` (${x})`))
            )}
          </span>
          <span className="culture">
            {pipe_ (
              hero,
              HeroModel.A.culture,
              bindF (lookupF (WikiModel.A.cultures (wiki))),
              fmap (Culture.A.name)
            )}
          </span>
          <span className="profession">
            {getFullProfessionName (l10n)
                                   (WikiModel.A.professions (wiki))
                                   (WikiModel.A.professionVariants (wiki))
                                   (HeroModel.A.sex (hero))
                                   (HeroModel.A.profession (hero))
                                   (HeroModel.A.professionVariant (hero))
                                   (HeroModel.A.professionName (hero))}
          </span>
          <span className="totalap">
            {maybe (0) (AdventurePointsCategories.A.spent) (m_ap)}
            {" / "}
            {maybe (0) (AdventurePointsCategories.A.total) (m_ap)}
            {" "}
            {translate (l10n) ("adventurepoints.short")}
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator/>
      <ListItemButtons>
        <BorderButton
          className="save"
          label={translate (l10n) ("save")}
          onClick={saveHero.bind (undefined, id)}
          disabled={notMember (id) (unsavedHeroesById)}
          />
        <IconButton icon="&#xE907" onClick={duplicateHero.bind (undefined, id)} />
        <IconButton icon="&#xE914" onClick={saveHeroAsJSON.bind (undefined, id)} />
        <IconButton icon="&#xE90b" onClick={deleteHero.bind (undefined, id)} />
        <IconButton icon="&#xE90e" onClick={loadHero.bind (undefined, id)} />
      </ListItemButtons>
    </ListItem>
  )
}
