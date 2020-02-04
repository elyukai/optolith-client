import { unfoldr } from "../../Data/List"
import { Just, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { Pair } from "../../Data/Tuple"
import { DropdownOption } from "../Models/View/DropdownOption"
import { toRoman } from "./NumberUtils"

const getElements =
  (display_range: boolean) =>
  (max: number) =>
    unfoldr<Record<DropdownOption<number>>, number>
      (current => current > max
        ? Nothing
        : current === 0
        ? Just (
          Pair
            (DropdownOption<number> ({ name: "0" }))
            (current + 1)
        )
        : Just (
          Pair
            (DropdownOption ({
                              id: Just (current),
                              name: current > 1 && display_range
                                ? `I–${toRoman (current)}`
                                : toRoman (current) }))
            (current + 1)
        ))

export const getLevelElements =
  (max: number) => getElements (false) (max) (1)

export const getLevelElementsWithMin =
  (min: number) => (max: number) => getElements (false) (max) (min)

export const getLevelElementsWithMaybeRangeMin =
  (display_range: boolean) => (min: number) => (max: number) =>
    getElements (display_range) (max) (min)

export const getLevelElementsWithZero =
  (max: number) => getElements (false) (max) (0)
