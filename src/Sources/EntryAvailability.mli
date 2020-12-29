(** Availability checking and working with source refs.

    This modules provides functions to check if entries are available to use
    based on their source refs (that doesnt include checking prerequites and
    other required checks) and to display their source refs efficiently. *)

val isAvailable :
  ('a -> PublicationRef.t list) ->
  Publication.t Ley_IntMap.t ->
  Hero.Rules.t ->
  'a ->
  bool
(** [isAvailable acc staticPublications rules entry] returns if the given entry
    [entry] is available based on the hero's set of active rules [rules]. The
    accessor function [acc] returns all source refs for the entry. *)

val isAvailableNull :
  ('a -> PublicationRef.t list) ->
  Publication.t Ley_IntMap.t ->
  Hero.Rules.t ->
  'a ->
  bool
(** [isAvailableNull] is like [isAvailable], but it returns [true] if the entry has no source refs. *)

val isAvailableNullPred :
  ('a -> PublicationRef.t list) ->
  ('a -> bool) ->
  Publication.t Ley_IntMap.t ->
  Hero.Rules.t ->
  'a ->
  bool
(** [isAvailableNullPred acc pred staticPublications rules entry] is like
    [isAvailableNull], but it also returns [true] if the predicate [pred],
    applied to the entry, returns [true]. *)

val isFromCore :
  ('a -> PublicationRef.t list) -> Publication.t Ley_IntMap.t -> 'a -> bool
(** [isFromCore acc staticPublications entry] returns if the given entry [entry]
    is from a core publication. The accessor function [acc] returns all source
    refs for the entry. *)

(* module Grouping: {
  (**
   * `showSources staticData excludeSrcss srcss` converts a list of lists of
   * source refs `srcss` into a displayable string. If `excludeScrss` contains any
   * list with source refs, their referenced pages are excluded from the result.
   *)
  let showGroupedSources:
    (
      Static.t,
      list(PublicationRef.t list),
      list(PublicationRef.t list)
    ) ->
    string;
}; *)
