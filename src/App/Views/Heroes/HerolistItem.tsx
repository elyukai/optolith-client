import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { bindF, fromMaybe, Just, Maybe } from "../../../Data/Maybe"
import { lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { notMember, OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { User } from "../../Models/Hero/heroTypeHelpers"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { Culture } from "../../Models/Wiki/Culture"
import { Race } from "../../Models/Wiki/Race"
import { RaceVariant } from "../../Models/Wiki/RaceVariant"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { getFullProfessionName } from "../../Utilities/rcpUtils"
import { renderMaybeWith } from "../../Utilities/ReactUtils"
import { AvatarWrapper } from "../Universal/AvatarWrapper"
import { BorderButton } from "../Universal/BorderButton"
import { IconButton } from "../Universal/IconButton"
import { ListItem } from "../Universal/ListItem"
import { ListItemButtons } from "../Universal/ListItemButtons"
import { ListItemName } from "../Universal/ListItemName"
import { ListItemSeparator } from "../Universal/ListItemSeparator"
import { VerticalList } from "../Universal/VerticalList"

const SDA = StaticData.A
const HA = HeroModel.A
const RA = Race.A
const RVA = RaceVariant.A
const CA = Culture.A

export interface HerolistItemOwnProps {
  hero: HeroModelRecord
}

export interface HerolistItemStateProps {
  ap: Maybe<Record<AdventurePointsCategories>>
  staticData: StaticDataRecord
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

export const HerolistItem: React.FC<HerolistItemProps> = props => {
  const {
    ap: map,
    hero,
    staticData,
    users,
    unsavedHeroesById,
    loadHero,
    saveHero,
    saveHeroAsJSON,
    deleteHero,
    duplicateHero,
  } = props

  const id = HA.id (hero)

  return (
    <ListItem>
      <AvatarWrapper src={HA.avatar (hero)} />
      <ListItemName
        name={HA.name (hero)}
        addName={pipe_ (
          hero,
          HA.player,
          bindF (lookupF (users)),
          fmap ((user: User) => user.displayName)
        )}
        large
        >
        <VerticalList className="rcp">
          <span className="race">
            {pipe_ (
              hero,
              HA.race,
              bindF (lookupF (SDA.races (staticData))),
              fmap (RA.name),
              fromMaybe ("")
            )}
            {pipe_ (
              hero,
              HA.raceVariant,
              bindF (lookupF (SDA.raceVariants (staticData))),
              fmap (pipe (RVA.name, x => ` (${x})`)),
              fromMaybe ("")
            )}
          </span>
          <span className="culture">
            {pipe_ (
              hero,
              HA.culture,
              bindF (lookupF (SDA.cultures (staticData))),
              fmap (CA.name),
              fromMaybe ("")
            )}
          </span>
          <span className="profession">
            {getFullProfessionName (staticData)
                                   (SDA.professions (staticData))
                                   (SDA.professionVariants (staticData))
                                   (HA.sex (hero))
                                   (HA.profession (hero))
                                   (HA.professionVariant (hero))
                                   (HA.professionName (hero))}
          </span>
          <span className="totalap">
            {renderMaybeWith (AdventurePointsCategories.A.spent) (map)}
            {" / "}
            {renderMaybeWith (AdventurePointsCategories.A.total) (map)}
            {" "}
            {translate (staticData) ("heroes.list.adventurepoints")}
          </span>
        </VerticalList>
      </ListItemName>
      <ListItemSeparator />
      <ListItemButtons>
        <BorderButton
          className="save"
          label={translate (staticData) ("heroes.saveherobtn")}
          onClick={saveHero}
          disabled={notMember (id) (unsavedHeroesById)}
          />
        <IconButton
          icon="&#xE907;"
          onClick={duplicateHero}
          hint={Just (translate (staticData) ("heroes.duplicateherobtn"))}
          />
        <IconButton
          icon="&#xE914;"
          onClick={saveHeroAsJSON}
          hint={Just (translate (staticData) ("heroes.exportheroasjsonbtn"))}
          />
        <IconButton
          icon="&#xE90b;"
          onClick={deleteHero}
          hint={Just (translate (staticData) ("heroes.deleteherobtn"))}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={loadHero}
          hint={Just (translate (staticData) ("heroes.openherobtn"))}
          />
      </ListItemButtons>
    </ListItem>
  )
}
