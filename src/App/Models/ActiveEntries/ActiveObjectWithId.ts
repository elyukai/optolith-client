import { ActivatableSingleWithId as ActiveObjectWithId } from "../../Utilities/Activatable.gen"
import { ActiveObject } from "./ActiveObject"

export { ActiveObjectWithId }

export const toActiveObjectWithId = (id: number) =>
                                    (active: ActiveObject): ActiveObjectWithId =>
                                      ({
                                        id,
                                        options: active.options,
                                        level: active.level,
                                        customCost: active.customCost,
                                      })

export const fromActiveObjectWithId =
  (active: ActiveObjectWithId): ActiveObject => ({
                                                  customCost: active.customCost,
                                                  options: active.options,
                                                  level: active.level,
                                                })
