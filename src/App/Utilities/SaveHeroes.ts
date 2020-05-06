import { join } from "path"
import { handleE } from "../../Control/Exception"
import { Either, Left, second } from "../../Data/Either"
import { ident } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { set } from "../../Data/Lens"
import { append, consF, List, notNull, reverse, unsnoc } from "../../Data/List"
import { fromJust, isNothing, maybe } from "../../Data/Maybe"
import { filter, lookup, map, OrderedMap } from "../../Data/OrderedMap"
import { fst, snd } from "../../Data/Tuple"
import { IO, pure, writeFile } from "../../System/IO"
import { HeroModel, HeroModelL } from "../Models/Hero/HeroModel"
import { UndoableHero, UndoableHeroModelRecord as Hero } from "../Models/Hero/UndoHero"
import { heroReducer } from "../Reducers/heroReducer"
import { user_data_path } from "../Selectors/envSelectors"
import { composeL } from "./compose"
import { pipe, pipe_ } from "./pipe"
import { convertHeroesForSave } from "./Raw/JSON/Hero/HeroToJSON"

const UHA = UndoableHero.A
const HA = HeroModel.A

type HeroesMap = OrderedMap<string, Hero>

const writeHeroesToFile = writeFile (join (user_data_path, "heroes.json"))

const resetHero: ident<Hero> = hero =>
  pipe_ (
    hero,
    UHA.past,
    unsnoc,
    maybe (hero)
          (p => UndoableHero ({
            past: List (),
            present: snd (p),
            future: pipe_ (
              hero,
              UHA.future,
              consF (UHA.present (hero)),
              append (reverse (fst (p)))
            ),
          }))
  )

const updateSavedHero: ident<Hero> =
  hero =>
    notNull (heroReducer.A.past (hero))
    ? pipe_ (
        hero,
        set (heroReducer.L.past) (List ()),
        set (heroReducer.L.future) (List ()),
        set (composeL (heroReducer.L.present, HeroModelL.dateModified)) (new Date ())
      )
    : hero

const updateSavedHeroes = map (updateSavedHero)

const updateToSaveOrResetHeroes = (id: string) => map ((x: Hero) => HA.id (UHA.present (x)) === id
                                                                    ? updateSavedHero (x)
                                                                    : resetHero (x))

const resetHeroes = map (resetHero)

/**
 * Saves the present version of all heroes in the Map. Returns the updated
 * heroes on success.
 *
 * @param heroes
 */
export const saveAllHeroesToFile: (heroes: HeroesMap) => IO<Either<Error, HeroesMap>> =
  async heroes => {
    const updated_heroes = updateSavedHeroes (heroes)

    return pipe_ (
      updated_heroes,
      convertHeroesForSave,
      JSON.stringify,
      writeHeroesToFile,
      handleE,
      fmap (second (() => updated_heroes))
    )
  }

/**
 * Saves the present version of the hero with the passed id, resets all other
 * heroes to the oldest state and saves both the updated and the resetted
 * heroes. Returns the updated hero on success.
 *
 * @param heroes
 * @param id
 */
export const saveHeroToFile: (heroes: HeroesMap, id: string) => IO<Either<Error, Hero>> =
  async (heroes, id) => {
    const updated_heroes = updateToSaveOrResetHeroes (id) (heroes)

    const mupdated_hero = lookup (id) (updated_heroes)

    if (isNothing (mupdated_hero)) {
      return pure (Left (new Error ("saveHeroToFile: No hero available with passed id")))
    }

    const updated_hero = fromJust (mupdated_hero)

    return pipe_ (
      updated_heroes,
      convertHeroesForSave,
      JSON.stringify,
      writeHeroesToFile,
      handleE,
      fmap (second (() => updated_hero))
    )
  }

/**
 * Removes the hero matching the passed id and saves resetted versions of all
 * other heroes in the Map. Returns the reduced, but not resetted heroes on
 * success.
 *
 * @param heroes
 * @param id
 */
export const deleteHeroFromFile: (heroes: HeroesMap, id: string) => IO<Either<Error, HeroesMap>> =
  async (heroes, id) => {
    const heroes_without = filter (pipe (UHA.present, HA.id, hero_id => hero_id !== id)) (heroes)

    return pipe_ (
      heroes_without,
      resetHeroes,
      convertHeroesForSave,
      JSON.stringify,
      writeHeroesToFile,
      handleE,
      fmap (second (() => heroes_without))
    )
  }
