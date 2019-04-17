import * as React from "react";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { RaceCombined } from "../../Models/View/viewTypeHelpers";
import { translate, UIMessagesObject } from "../../Utilities/I18n";
import { Aside } from "../Universal/Aside";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";
import { RacesListItem } from "./RacesListItem";
import { RaceVariants } from "./RaceVariants";

export interface RacesOwnProps {
  locale: UIMessagesObject
}

export interface RacesStateProps {
  currentId: Maybe<string>
  currentVariantId: Maybe<string>
  races: Maybe<List<Record<RaceCombined>>>
  sortOrder: string
  filterText: string
}

export interface RacesDispatchProps {
  selectRace (id: string): (variantId: Maybe<string>) => void
  selectRaceVariant (id: string): void
  setSortOrder (sortOrder: string): void
  switchValueVisibilityFilter (): void
  setFilterText (filterText: string): void
  switchToCultures (): void
}

export type RacesProps = RacesStateProps & RacesDispatchProps & RacesOwnProps

export function Races (props: RacesProps) {
  const { filterText, locale, races: list, sortOrder } = props

  return (
    <Page id="races">
      <Options>
        <TextField
          hint={translate (locale, "options.filtertext")}
          value={filterText}
          onChangeString={props.setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={props.setSortOrder}
          options={List.of<SortNames> ("name", "cost")}
          locale={locale}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (locale, "name")}
          </ListHeaderTag>
          <ListHeaderTag className="cost" hint={translate (locale, "aptext")}>
            {translate (locale, "apshort")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder has-border" />
        </ListHeader>
        <Scroll>
          <ListView>
            {
              Maybe.fromMaybe<NonNullable<React.ReactNode>>
                (
                  <ListPlaceholder
                    locale={locale}
                    type="races"
                    noResults={filterText.length > 0}
                    />
                )
                (list
                  .bind (Maybe.ensure (R.pipe (List.null, R.not)))
                  .fmap (R.pipe (
                    List.map (
                      race => (<RacesListItem {...props} key={race .get ("id")} race={race} />)
                    ),
                    List.toArray
                  )))
            }
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <RaceVariants {...props} />
        <WikiInfoContainer {...props} noWrapper />
      </Aside>
    </Page>
  )
}
