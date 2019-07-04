import { unfoldr } from "../../Data/List";
import { Just, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { Pair } from "../../Data/Tuple";
import { DropdownOption } from "../Views/Universal/Dropdown";
import { toRoman } from "./NumberUtils";

const getElements =
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
            (DropdownOption ({ id: Just (current), name: toRoman (current) }))
            (current + 1)
        ))

export const getLevelElements = (max: number) => getElements (max) (1)

export const getLevelElementsWithMin = (min: number) => (max: number) => getElements (max) (min)

export const getLevelElementsWithZero = (max: number) => getElements (max) (0)
