module IM = Ley_IntMap
module L = Ley_List

let getFromGroup getGroup (group : int) pairs =
  IM.filter (fun (staticEntry, _) -> getGroup staticEntry == group) pairs

let getActiveFromGroup isActive getGroup (group : int) pairs =
  IM.filter
    (function
      | staticEntry, Some heroEntry ->
          getGroup staticEntry == group && isActive heroEntry
      | _ -> false)
    pairs

let countActiveFromGroup isActive getGroup (group : int) pairs =
  IM.countWith
    (function
      | staticEntry, Some heroEntry ->
          getGroup staticEntry == group && isActive heroEntry
      | _ -> false)
    pairs

let countActiveFromGroups isActive getGroup (groups : int list) pairs =
  IM.countWith
    (function
      | staticEntry, Some heroEntry ->
          L.elem (getGroup staticEntry) groups && isActive heroEntry
      | _ -> false)
    pairs

let hasActiveFromGroup isActive getGroup (group : int) pairs =
  IM.any
    (function
      | staticEntry, Some heroEntry ->
          getGroup staticEntry == group && isActive heroEntry
      | _ -> false)
    pairs

let hasActiveFromGroups isActive getGroup (groups : int list) pairs =
  IM.any
    (function
      | staticEntry, Some heroEntry ->
          L.elem (getGroup staticEntry) groups && isActive heroEntry
      | _ -> false)
    pairs
