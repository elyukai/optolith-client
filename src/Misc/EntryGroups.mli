val getFromGroup :
  ('a -> int) -> int -> ('a * 'b) Ley_IntMap.t -> ('a * 'b) Ley_IntMap.t
(** [getFromGroup getGroup group pairs] gets entries from a certain [group].
    [getGroup] returns the group from the static entry, which the [group] is
    checked against and [pairs] is a list of pairs, where the first element is
    the static entry and the second element the corresponding hero entry, if
    available. *)

val getActiveFromGroup :
  ('a -> bool) ->
  ('b -> int) ->
  int ->
  ('b * 'a option) Ley_IntMap.t ->
  ('b * 'a option) Ley_IntMap.t
(** [getActiveFromGroup isActive getGroup group pairs] gets entries from a
    certain [group]. [isActive] is a function to check if the hero entry is
    active, [getGroup] returns the group from the static entry, which the
    [group] is checked against and [pairs] is a list of pairs, where the first
    element is the static entry and the second element the corresponding hero
    entry, if available. *)

val countActiveFromGroup :
  ('a -> bool) -> ('b -> int) -> int -> ('b * 'a option) Ley_IntMap.t -> int
(** [countActiveFromGroup isActive getGroup group pairs] counts active entries
    from a certain [group]. [isActive] is a function to check if the hero entry
    is active, [getGroup] returns the group from the static entry, which the
    [group] is checked against and [pairs] is a list of pairs, where the first
    element is the static entry and the second element the corresponding hero
    entry, if available. *)

val countActiveFromGroups :
  ('a -> bool) ->
  ('b -> int) ->
  int list ->
  ('b * 'a option) Ley_IntMap.t ->
  int
(** [countActiveFromGroups isActive getGroup groups pairs] counts active entries
    from certain [groups]. [isActive] is a function to check if the hero entry
    is active, [getGroup] returns the group from the static entry, which the
    [groups] are checked against and [pairs] is a list of pairs, where the first
    element is the static entry and the second element the corresponding hero
    entry, if available. *)

val hasActiveFromGroup :
  ('b -> bool) -> ('a -> int) -> int -> ('a * 'b option) Ley_IntMap.t -> bool
(** [hasActiveFromGroup isActive getGroup group pairs] checks if there is at
    least one active entry from a certain [group]. [isActive] is a function to
    check if the hero entry is active, [getGroup] returns the group from the
    static entry, which the [group] is checked against and [pairs] is a list of
    pairs, where the first element is the static entry and the second element
    the corresponding hero entry, if available. *)

val hasActiveFromGroups :
  ('b -> bool) ->
  ('a -> int) ->
  int list ->
  ('a * 'b option) Ley_IntMap.t ->
  bool
(** [hasActiveFromGroups isActive getGroup groups pairs] checks if there is at
    least one active entry from certain [groups]. [isActive] is a function to
    check if the hero entry is active, [getGroup] returns the group from the
    static entry, which the [groups] are checked against and [pairs] is a list
    of pairs, where the first element is the static entry and the second element
    the corresponding hero entry, if available. *)
