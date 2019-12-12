import * as React from "react";
import { fmap } from "../../../Data/Functor";
import { bindF, fromMaybe, Just, Maybe } from "../../../Data/Maybe";
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
import { renderMaybeWith } from "../../Utilities/ReactUtils";
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
  ap: Maybe<Record<AdventurePointsCategories>>
  wiki: WikiModelRecord
  users: OrderedMap<string, User>
  unsavedHeroesById: OrderedSet<string>
}

export interface HerolistItemDispatchProps {
  loadHero (): void
  showHero (): void
  saveHero (): void
  saveHeroAsJSON (): void
  deleteHero (): void
  duplicateHero (): void
}

export type HerolistItemProps = HerolistItemStateProps
                              & HerolistItemDispatchProps
                              & HerolistItemOwnProps

export function HerolistItem (props: HerolistItemProps) {
  const {
    ap: map,
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
              fmap (Race.A.name),
              fromMaybe ("")
            )}
            {pipe_ (
              hero,
              HeroModel.A.raceVariant,
              bindF (lookupF (WikiModel.A.raceVariants (wiki))),
              fmap (pipe (RaceVariant.A.name, x => ` (${x})`)),
              fromMaybe ("")
            )}
          </span>
          <span className="culture">
            {pipe_ (
              hero,
              HeroModel.A.culture,
              bindF (lookupF (WikiModel.A.cultures (wiki))),
              fmap (Culture.A.name),
              fromMaybe ("")
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
            {renderMaybeWith (AdventurePointsCategories.A.spent) (map)}
            {" / "}
            {renderMaybeWith (AdventurePointsCategories.A.total) (map)}
            {" "}
            {translate (l10n) ("adventurepoints.short")}
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator />
      <ListItemButtons>
        <BorderButton
          className="save"
          label={translate (l10n) ("save")}
          onClick={saveHero}
          disabled={notMember (id) (unsavedHeroesById)}
          />
        <IconButton
          icon="&#xE907;"
          onClick={duplicateHero}
          hint={Just (translate (l10n) ("duplicatehero"))}
          />
        <IconButton
          icon="&#xE914;"
          onClick={saveHeroAsJSON}
          hint={Just (translate (l10n) ("exportheroasjson"))}
          />
        <IconButton
          icon="&#xE90b;"
          onClick={deleteHero}
          hint={Just (translate (l10n) ("deletehero.novar"))}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={loadHero}
          hint={Just (translate (l10n) ("openhero"))}
          />
      </ListItemButtons>
    </ListItem>
  )
}
