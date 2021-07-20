type 'a t = 'a list

include Functor.T with type 'a t := 'a t

include Applicative.T with type 'a t := 'a t

include Applicative.Alternative.T with type 'a t := 'a t

include Monad.T with type 'a t := 'a t

include Foldable.T with type 'a t := 'a t

module Index : sig
  val indexed : 'a list -> (int * 'a) list
  (** [indexed] pairs each element with its index.

      {[
      indexed "hello" = [(0,'h'),(1,'e'),(2,'l'),(3,'l'),(4,'o')]
      ]} *)

  val deleteAt : int -> 'a list -> 'a list
  (** [deleteAt] deletes the element at an index.

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val deleteAtPair : int -> 'a list -> 'a option * 'a list
  (** [deleteAtPair] deletes the element at an index and returns a [Just] of the
      deleted element together with the remaining list.

      If the index is negative or exceeds list length, the original list will be
      returned, together with [Nothing] representing no deleted element. *)

  val setAt : int -> 'a -> 'a list -> 'a list
  (** [setAt] sets the element at the index.

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val modifyAt : int -> ('a -> 'a) -> 'a list -> 'a list
  (** [modifyAt] applies a function to the element at the index.

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val updateAt : int -> ('a -> 'a Option.t) -> 'a list -> 'a list
  (** [updateAt] applies a function to the element at the index, and then either
      replaces the element or deletes it (if the function has returned
      [Nothing]).

      If the index is negative or exceeds list length, the original list will be
      returned. *)

  val insertAt : int -> 'a -> 'a list -> 'a list
  (** [insertAt] inserts an element at the given position:

      [(insertAt i x xs) !! i == x]

      If the index is negative or exceeds list length, the original list will be
      returned. (If the index is equal to the list length, the insertion can be
      carried out.) *)

  (* Maps *)

  val imap : (int -> 'a -> 'b) -> 'a list -> 'b list
  (** [imap f xs] is the list obtained by applying [f] to each element of [xs].
      *)

  (* Folds *)

  val ifoldr : (int -> 'a -> 'b -> 'b) -> 'b -> 'a list -> 'b
  (** Right-associative fold of a structure. *)

  val ifoldl : ('a -> int -> 'b -> 'a) -> 'a -> 'b list -> 'a
  (** Left-associative fold of a structure. *)

  val iall : (int -> 'a -> bool) -> 'a list -> bool
  (** Determines whether all elements of the structure satisfy the predicate. *)

  val iany : (int -> 'a -> bool) -> 'a list -> bool
  (** Determines whether any element of the structure satisfies the predicate.
      *)

  val iconcatMap : (int -> 'a -> 'b list) -> 'a list -> 'b list
  (** [iconcatMap f x] maps the function [f] over all the elements of container
      [x] and concatenates the resulting lists. *)

  val ifilter : (int -> 'a -> bool) -> 'a list -> 'a list
  (** [ifilter], applied to a predicate and a list, returns the list of those
      elements that satisfy the predicate. *)

  val ipartition : (int -> 'a -> bool) -> 'a list -> 'a list * 'a list
  (** The [ipartition] function takes a predicate a list and returns the pair of
      lists of elements which do and do not satisfy the predicate, respectively.

      {[
      partition ([elem] "aeiou") "Hello World!" = ("eoo","Hll Wrld!")
      ]} *)

  (* Search *)

  val ifind : (int -> 'a -> bool) -> 'a list -> 'a option
  (** The [find] function takes a predicate and a structure and returns the
      leftmost element of the structure matching the predicate, or [Nothing] if
      there is no such element. *)

  val ifindIndex : (int -> 'a -> bool) -> 'a list -> int option
  (** The [ifindIndex] function takes a predicate and a list and returns the
      index of the first element in the list satisfying the predicate, or
      [Nothing] if there is no such element. *)

  val ifindIndices : (int -> 'a -> bool) -> 'a list -> int list
  (** The [findIndices] function extends [findIndex], by returning the indices
      of all elements satisfying the predicate, in ascending order. *)
end

(* Basic Functions *)

val cons : 'a -> 'a list -> 'a list
(** Prepends an element to the list. *)

val ( ^ ) : 'a list -> 'a list -> 'a list
(** Append two lists. *)

val append : 'a list -> 'a list -> 'a list
(** Append two lists. *)

val head : 'a list -> 'a
(** Extract the first element of a list, which must be non-empty. *)

val last : 'a list -> 'a
(** Extract the last element of a list, which must be finite and non-empty. *)

val tail : 'a list -> 'a list
(** Extract the elements after the head of a list, which must be non-empty. *)

val init : 'a list -> 'a list
(** Return all the elements of a list except the last one. The list must be
    non-empty. *)

val uncons : 'a list -> ('a * 'a list) option
(** Decompose a list into its head and tail. If the list is empty, returns
    [Nothing]. If the list is non-empty, returns [Just (x, xs)], where [x] is
    the head of the list and [xs] its tail. *)

(* List transformations *)

val map : ('a -> 'b) -> 'a t -> 'b t
(** [map f xs] is the list obtained by applying [f] to each element of [xs]. *)

val reverse : 'a t -> 'a list
(** [reverse xs] returns the elements of [xs] in reverse order. [xs] must be
    finite. *)

val intersperse : 'a -> 'a list -> 'a list
(** The intersperse function takes an element and a list and 'intersperses' that
    element between the elements of the list. For example,

    {[
    intersperse ',' "abcde" == "a,b,c,d,e"
    ]} *)

val intercalate : string -> string list -> string
(** [intercalate xs xss] is equivalent to [(concat (intersperse xs xss))]. It
    inserts the list [xs] in between the lists in [xss] and concatenates the
    result. *)

val permutations : 'a list -> 'a list t
(** The [permutations] function returns the list of all permutations of the
    argument.

    {[
    permutations "abc" = ["abc","bac","cba","bca","cab","acb"]
    ]}

    If the given list is empty, an empty list is returned by this function. *)

(* Scans *)

val scanl : ('a -> 'b -> 'a) -> 'a -> 'b list -> 'a list
(** [scanl :: (b -> a -> b) -> b -> [a] -> [b]]

    scanl is similar to foldl, but returns a list of successive reduced values
    from the left:

    {[
    f z [x1, x2, ...] == [z, z [f] x1, (z [f] x1) [f] x2, ...]
    ]}

    Note that

    {[
    (scanl f z xs) == foldl f z xs.
    ]} *)

(* Accumulating Maps *)

val mapAccumL : ('a -> 'b -> 'a * 'c) -> 'a -> 'b list -> 'a * 'c list
(** The [mapAccumL] function behaves like a combination of [fmap] and [foldl];
    it applies a function to each element of a structure, passing an
    accumulating parameter from left to right, and returning a final value of
    this accumulator together with the new structure. *)

val mapAccumR : ('a -> 'b -> 'a * 'c) -> 'a -> 'b list -> 'a * 'c list
(** The [mapAccumR] function behaves like a combination of [fmap] and [foldr];
    it applies a function to each element of a structure, passing an
    accumulating parameter from right to left, and returning a final value of
    this accumulator together with the new structure. *)

(* Infinite Lists *)

val replicate : int -> 'a -> 'a list
(** [replicate n x] is a list of length [n] with [x] the value of every element.
    It is an instance of the more general [genericReplicate], in which [n] may
    be of any integral type. *)

(* Unfolding *)

val unfoldr : ('a -> ('b * 'a) option) -> 'a -> 'b list
(** The [unfoldr] function is a 'dual' to [foldr]: while [foldr] reduces a list
    to a summary value, [unfoldr] builds a list from a seed value. The function
    takes the element and returns [Nothing] if it is done producing the list or
    returns [Just (a,b)], in which case, [a] is a prepended to the list and [b]
    is used as the next element in a recursive call. For example,

    {[
    iterate f == unfoldr (\x -> Just (x, f x))
    ]}

    In some cases, unfoldr can undo a foldr operation:

    {[
    unfoldr f' (foldr f z xs) == xs
    ]}

    if the following holds:

    {[
    f' (f x y) = Just (x,y)
    f' z       = Nothing
    ]}

    A simple use of unfoldr:

    {[
    unfoldr (fun b -> if b == 0 then Nothing else Just (b, b-1)) 10 = [10,9,8,7,6,5,4,3,2,1]
    ]}
 *)

(* Extracting sublists *)

val take : int -> 'a list -> 'a list
(** [take n], applied to a list [xs], returns the prefix of [xs] of length [n],
    or [xs] itself if [n > length xs]. *)

val drop : int -> 'a list -> 'a list
(** [drop n xs] returns the suffix of [xs] after the first [n] elements, or
    [[]] if [n > length x]. *)

val splitAt : int -> 'a list -> 'a list * 'a list
(** [splitAt n xs] returns a tuple where first element is [xs] prefix of length
    [n] and second element is the remainder of the list. *)

(* Predicates *)

val isInfixOf : string -> string -> bool
(** The [isInfixOf] function takes two strings and returns [True] if the first
    string is contained, wholly and intact, anywhere within the second.

    {[
    >>> isInfixOf "Haskell" "I really like Haskell."
    True
    ]}

    {[
    >>> isInfixOf "Ial" "I really like Haskell."
    False
    ]} *)

(* Searching by equality *)

val lookup : 'a -> ('a * 'b) t -> 'b Option.t
(** [lookup key assocs] looks up a key in an association list. *)

val filter : ('a -> bool) -> 'a t -> 'a list
(** [filter], applied to a predicate and a list, returns the list of those
    elements that satisfy the predicate. *)

val partition : ('a -> bool) -> 'a t -> 'a list * 'a list
(** The [partition] function takes a predicate a list and returns the pair of
    lists of elements which do and do not satisfy the predicate, respectively.

    {[
    partition ([elem] "aeiou") "Hello World!" = ("eoo","Hll Wrld!")
    ]} *)

val ( !! ) : 'a list -> int -> 'a
(** List index (subscript) operator, starting from 0. If the index is invalid,
    raises and expection, otherwise [a]. *)

val subscript : 'a list -> int -> 'a
(** List index (subscript) operator, starting from 0. If the index is invalid,
    raises and expection, otherwise [a]. *)

val elemIndex : 'a -> 'a list -> int Option.t
(** The [elemIndex] function returns the index of the first element in the
    given list which is equal (by [==]) to the query element, or [Nothing] if
    there is no such element. *)

val elemIndices : 'a -> 'a list -> int list
(** The [elemIndices] function extends [elemIndex], by returning the indices of
    all elements equal to the query element, in ascending order. *)

val findIndex : ('a -> bool) -> 'a list -> int Option.t
(** The [findIndex] function takes a predicate and a list and returns the index
    of the first element in the list satisfying the predicate, or [Nothing] if
    there is no such element. *)

val findIndices : ('a -> bool) -> 'a list -> int list
(** The [findIndices] function extends [findIndex], by returning the indices of
    all elements satisfying the predicate, in ascending order. *)

(* Zipping and unzipping lists *)

val zip : 'a list -> 'b list -> ('a * 'b) list
(** [zip] takes two lists and returns a list of corresponding pairs. If one
    input list is short, excess elements of the longer list are discarded. *)

val zipWith : ('a -> 'b -> 'c) -> 'a list -> 'b list -> 'c list
(** [zipWith] generalises [zip] by zipping with the function given as the first
    argument, instead of a tupling function. For example, [zipWith (+)] is
    applied to two lists to produce the list of corresponding sums. *)

(* Special lists *)

(* Functions on strings *)

val lines : Js.String.t -> Js.String.t list
(** [lines] breaks a string up into a list of strings at newline characters. The
    resulting strings do not contain newlines.

    Note that after splitting the string at newline characters, the last part of
    the string is considered a line even if it doesn't end with a newline. For
    example,

    {[
    lines "" = []
    lines "\n" = [""]
    lines "one" = ["one"]
    lines "one\n" = ["one"]
    lines "one\n\n" = ["one";""]
    lines "one\ntwo" = ["one";"two"]
    lines "one\ntwo\n" = ["one";"two"]
    ]}

    Thus [lines s] contains at least as many elements as newlines in [s].
 *)

(* "Set" operations *)

val nub : 'a t -> 'a t
(** The [nub] function removes duplicate elements from a list. In particular, it
    keeps only the first occurrence of each element. (The name [nub] means
    'essence'.) It is a special case of [nubBy], which allows the programmer to
    supply their own equality test. *)

val delete : 'a -> 'a list -> 'a list
(** [delete x] removes the first occurrence of [x] from its list argument. *)

val difference : 'a t -> 'a t -> 'a list
(** [xs \/ ys] returns the list [xs] with all elements in [ys] removed from
    [xs]. *)

val intersect : 'a t -> 'a t -> 'a list
(** The [intersect] function takes the list intersection of two lists. For
    example,

    {[
    intersect [1,2,3,4] [2,4,6,8] = [2,4]
    ]}

    If the first list contains duplicates, so will the result.

    {[
    intersect [1,2,2,3,4] [6,4,4,2] = [2,2,4]
    ]}

    It is a special case of [intersectBy], which allows the programmer to supply
    their own equality test. If the element is found in both the first and the
    second list, the element from the first list will be used. *)

val disjoint : 'a t -> 'a list -> bool
(** [disjoint xs ys] checks if the lists [xs] and [ys] are disjoint (i.e., their
    intersection is empty). *)

(* Ordered lists *)

val sortBy : ('a -> 'a -> int) -> 'a list -> 'a list
(** The [sortBy] function sorts all elements in the passed list using the passed
    comparison function. *)

(* Count by predicate *)

val countBy : ('a -> bool) -> 'a t -> int

val lengthMin : int -> 'a list -> bool
(** [lengthMin min xs] checks if the list [xs] has a minimum length of [min]. *)

val countMinBy : ('a -> bool) -> int -> 'a list -> bool
(** [countMinBy pred min xs] checks if the elements of list [xs] match the
    predicate [pred] a minimum of [min] times. *)

val countMin : 'a -> int -> 'a list -> bool
(** [countMin e min xs] checks if the element [e] occurs a minimum of [min]
    times in list [xs]. *)

val lengthMax : int -> 'a list -> bool
(** [lengthMax max xs] checks if the list [xs] has a maximum length of [max]. *)

val countMaxBy : ('a -> bool) -> int -> 'a list -> bool
(** [countMaxBy pred max xs] checks if the elements of list [xs] match the
    predicate [pred] a maximum of [max] times. *)

val countMax : 'a -> int -> 'a list -> bool
(** [countMax e max xs] checks if the element [e] occurs a maximum of [max]
    times in list [xs]. *)

(* Lists and arrays *)

val to_array : 'a list -> 'a array
(** Create an array from the list. *)

val of_array : 'a array -> 'a list
(** Create a list from the array. *)

module Extra : sig
  val lower : string -> string
  (** Convert a string to lower case. *)

  val trimStart : Js.String.t -> Js.String.t
  (** Remove spaces from the start of a string, see [trim]. *)

  val trimEnd : Js.String.t -> Js.String.t
  (** Remove spaces from the end of a string, see [trim]. *)

  val escapeRegex : Js.String.t -> Js.String.t
  (** Escape a string that may contain [Regex]-specific notation for use in
      regular expressions.

      {[
      escapeRegex "." == "\."
      escapeRegex "This (or that)." == "This \(or that\)\."
      ]} *)

  (* Splitting *)

  val splitOn : Js.String.t -> Js.String.t -> Js.String.t list
  (** Break a list into pieces separated by the first list argument, consuming
      the delimiter. An empty delimiter is invalid, and will cause an error to be
      raised. *)

  (* Basics *)

  val notNull : 'a t -> bool
  (** A composition of [not] and [null]: Checks if a list has at least one
      element. *)

  val notNullStr : Js.String.t -> bool
  (** A composition of [not] and [null]: Checks if a string is not empty. *)

  val list : 'a -> ('b -> 'b list -> 'a) -> 'b list -> 'a
  (** Non-recursive transform over a list, like [maybe].

      {[
      list 1 (\v _ -> v - 2) [5,6,7] == 3
      list 1 (\v _ -> v - 2) []      == 1
      nil cons xs -> maybe nil (uncurry cons) (uncons xs) == list nil cons xs
      ]} *)

  val unsnoc : 'a list -> ('a list * 'a) option
  (** If the list is empty returns [Nothing], otherwise returns the [init] and
      the [last]. *)

  val snoc : 'a list -> 'a -> 'a list
  (** Append an element to the end of a list, takes *O(n)* time. *)

  (* List operations *)

  val maximumOn : ('a -> int) -> 'a t -> 'a option
  (** A version of [maximum] where the comparison is done on some extracted
      value. *)

  val minimumOn : ('a -> int) -> 'a t -> 'a option
  (** A version of [minimum] where the comparison is done on some extracted
      value. *)

  val firstJust : ('a -> 'b option) -> 'a list -> 'b option
  (** Find the first element of a list for which the operation returns [Just],
      along with the result of the operation. Like [find] but useful where the
      function also computes some expensive information that can be reused.
      Particular useful when the function is monadic, see [firstJustM].

      {[
      firstJust id [Nothing,Just 3]  == Just 3
      firstJust id [Nothing,Nothing] == Nothing
      ]}  *)

  val replaceStr : string -> string -> string -> Js.String.t
  (** Replace a subsequence everywhere it occurs. The first argument must not be
      the empty string. *)

  val replaceStrRe : Js.Re.t -> string -> string -> Js.String.t
  (** [replace :: (Partial, Eq a) => RegExp -> [a] -> [a] -> [a]]

      Replace a subsequence. Use the [g] flag on the [RegExp] to replace all
      occurrences. *)
end

module Safe : sig
  val atMay : 'a list -> int -> 'a option
  (** Returns the element at the passed index. If the index is invalid (index
      negative or index >= list length), [Nothing] is returned, otherwise a
      [Just] of the found element. *)
end

module Decode : sig
  val one_or_many :
    'a Decoders_bs.Decode.decoder -> 'a list Decoders_bs.Decode.decoder
  (** [one_or_many decoder json] takes a JSON decoder and a JSON value. It
      decodes the JSON as a list where a single-element list can be represented
      as the element itself, which makes it easier to use in the database.

      {[
      one_or_many Decoders_bs.Decode.int {js|1|js} = [1]
      one_or_many Decoders_bs.Decode.int {js|[1, 2, 3]|js} = [1; 2; 3]
      ]} *)
end

module Infix : sig
  include Functor.Infix with type 'a t := 'a t

  include Applicative.Infix with type 'a t := 'a t

  include Applicative.Alternative.Infix with type 'a t := 'a t

  include Monad.Infix with type 'a t := 'a t
end
