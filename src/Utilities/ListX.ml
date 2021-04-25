type 'a t = 'a list

include (
  Functor.Make (struct
    type nonrec 'a t = 'a t

    let rec fmap f xs = match xs with [] -> [] | y :: ys -> f y :: fmap f ys
  end) :
    Functor.T with type 'a t := 'a t )

include (
  Applicative.Make (struct
    type nonrec 'a t = 'a t

    let pure x = [ x ]

    let fmap = fmap

    let rec ap fs xs =
      match fs with
      | [] -> []
      | gs -> (
          match xs with
          | [] -> []
          | x :: ys -> fmap (fun f -> f x) gs @ ap fs ys )
  end) :
    Applicative.T with type 'a t := 'a t )

include (
  Applicative.Alternative.Make (struct
    type nonrec 'a t = 'a t

    let empty = []

    let alt xs ys = match xs with [] -> ys | xs -> xs
  end) :
    Applicative.Alternative.T with type 'a t := 'a t )

include (
  Monad.Make (struct
    type nonrec 'a t = 'a t

    let pure = pure

    let fmap = fmap

    let rec bind f xs = match xs with [] -> [] | y :: ys -> f y @ bind f ys
  end) :
    Monad.T with type 'a t := 'a t )

include (
  Foldable.Make (struct
    type nonrec 'a t = 'a t

    let rec foldr f initial xs =
      match xs with [] -> initial | y :: ys -> f y (foldr f initial ys)

    let rec foldl f initial xs =
      match xs with [] -> initial | y :: ys -> foldl f (f initial y) ys

    let equal = ( == )
  end) :
    Foldable.T with type 'a t := 'a t )

module Index = struct
  let%private rec indexedAux i xs =
    match xs with [] -> [] | x :: xs -> (i, x) :: indexedAux (i + 1) xs

  let indexed xs = indexedAux 0 xs

  let rec deleteAt index xs =
    match index < 0 with
    | true -> xs
    | false -> (
        match xs with
        | [] -> []
        | _ :: xs when index == 0 -> xs
        | x :: xs -> x :: deleteAt (index - 1) xs )

  let rec deleteAtPair index xs =
    match index < 0 with
    | true -> (None, xs)
    | false -> (
        match xs with
        | [] -> (None, [])
        | x :: xs when index == 0 -> (Some x, xs)
        | x :: xs ->
            deleteAtPair (index - 1) xs |> Tuple.second (fun xs -> x :: xs) )

  let rec setAt index e xs =
    match index < 0 with
    | true -> xs
    | false -> (
        match xs with
        | [] -> []
        | _ :: xs when index == 0 -> e :: xs
        | x :: xs -> x :: setAt (index - 1) e xs )

  let rec modifyAt index f xs =
    match index < 0 with
    | true -> xs
    | false -> (
        match xs with
        | [] -> []
        | x :: xs when index == 0 -> f x :: xs
        | x :: xs -> x :: modifyAt (index - 1) f xs )

  let rec updateAt index f xs =
    match index < 0 with
    | true -> xs
    | false -> (
        match xs with
        | [] -> []
        | x :: xs when index == 0 -> Option.option xs (fun x' -> x' :: xs) (f x)
        | x :: xs -> x :: updateAt (index - 1) f xs )

  let rec insertAt index e xs =
    match index < 0 with
    | true -> xs
    | false -> (
        match xs with
        | [] -> []
        | xs when index == 0 -> e :: xs
        | x :: xs -> x :: insertAt (index - 1) e xs )

  let rec imapAux f i xs =
    match xs with [] -> [] | x :: xs -> f i x :: imapAux f (i + 1) xs

  let imap f xs = imapAux f 0 xs

  let ifoldr f initial xs =
    let rec ifoldr f index acc xs =
      match xs with
      | [] -> acc
      | x :: xs -> f index x (ifoldr f (index + 1) acc xs)
    in
    ifoldr f 0 initial xs

  let ifoldl f initial xs =
    let rec ifoldl f index acc xs =
      match xs with
      | [] -> acc
      | x :: xs -> ifoldl f (index + 1) (f acc index x) xs
    in
    ifoldl f 0 initial xs

  let rec iallAux f index xs =
    match xs with
    | [] -> true
    | x :: xs -> f index x && iallAux f (index + 1) xs

  let iall f xs = iallAux f 0 xs

  let rec ianyAux f index xs =
    match xs with
    | [] -> false
    | x :: xs -> f index x || ianyAux f (index + 1) xs

  let iany f xs = ianyAux f 0 xs

  let rec iconcatMapAux f index xs =
    match xs with
    | [] -> []
    | x :: xs -> f index x @ iconcatMapAux f (index + 1) xs

  let iconcatMap f xs = iconcatMapAux f 0 xs

  let ifilter pred xs =
    ifoldr
      (fun i x acc -> match pred i x with true -> x :: acc | false -> acc)
      [] xs

  let ipartition pred xs =
    ifoldr
      (fun i x ->
        match pred i x with
        | true -> Tuple.first (fun acc -> x :: acc)
        | false -> Tuple.second (fun acc -> x :: acc))
      ([], []) xs

  let rec ifindAux pred index xs =
    match xs with
    | [] -> None
    | x :: xs -> (
        match pred index x with
        | true -> Some x
        | false -> ifindAux pred (index + 1) xs )

  let ifind pred xs = ifindAux pred 0 xs

  let rec ifindIndexAux pred index xs =
    match xs with
    | [] -> None
    | x :: xs -> (
        match pred index x with
        | true -> Some index
        | false -> ifindIndexAux pred (index + 1) xs )

  let ifindIndex pred xs = ifindIndexAux pred 0 xs

  let rec ifindIndicesAux pred i xs =
    match xs with
    | [] -> []
    | x :: xs -> (
        match pred i x with
        | true -> i :: ifindIndicesAux pred (i + 1) xs
        | false -> ifindIndicesAux pred (i + 1) xs )

  let ifindIndices pred xs = ifindIndicesAux pred 0 xs
end

let cons = List.cons

let ( ^ ) = Pervasives.( @ )

let append = ( ^ )

let head = function
  | [] ->
      invalid_arg
        "head does only work on non-empty lists. If you do not know whether \
         the list is empty or not, use listToMaybe instead."
  | x :: _ -> x

let rec last = function
  | [] -> invalid_arg "last does only work on non-empty lists."
  | x :: xs -> ( match xs with [] -> x | _ :: xs -> last xs )

let tail = function
  | [] -> invalid_arg "tail does only work on non-empty lists."
  | _ :: xs -> xs

let rec init = function
  | [] -> invalid_arg "init does only work on non-empty lists."
  | x :: xs -> ( match xs with [] -> [] | _ -> x :: init xs )

let uncons = function [] -> None | x :: xs -> Some (x, xs)

let map = fmap

let reverse xs = foldl (Function.flip cons) [] xs

let rec intersperse sep xs =
  match xs with
  | [] -> []
  | [ x ] -> [ x ]
  | x :: xs -> x :: sep :: intersperse sep xs

let rec intercalate separator xs =
  match xs with
  | [] -> ""
  | [ x ] -> x
  | x :: xs ->
      x |> Pervasives.( ^ ) separator
      |> Pervasives.( ^ ) (intercalate separator xs)

let%private permutationsPick xs =
  Index.imap (fun i x -> (x, Index.deleteAt i xs)) xs

let rec permutations xs =
  match xs with
  | [] -> []
  | [ x ] -> [ [ x ] ]
  | xs ->
      xs |> permutationsPick
      |> concatMap (fun (x', xs') -> map (cons x') (permutations xs'))

let rec scanl f initial xs =
  initial :: (match xs with [] -> [] | y :: ys -> scanl f (f initial y) ys)

let rec mapAccumL f initial ls =
  match ls with
  | [] -> (initial, [])
  | x :: xs ->
      let init, y = f initial x in
      let acc, ys = mapAccumL f init xs in
      (acc, y :: ys)

let rec mapAccumR f initial ls =
  match ls with
  | [] -> (initial, [])
  | x :: xs ->
      let init, ys = mapAccumR f initial xs in
      let acc, y = f init x in
      (acc, y :: ys)

let rec replicate len x =
  match len > 0 with true -> x :: replicate (len - 1) x | false -> []

let rec unfoldr f seed =
  seed |> f |> function
  | Some (value, newSeed) -> value :: unfoldr f newSeed
  | None -> []

let rec take n xs =
  match n <= 0 with
  | true -> []
  | false -> ( match xs with [] -> [] | x :: xs -> x :: take (n - 1) xs )

let rec drop n xs =
  match n <= 0 with
  | true -> xs
  | false -> ( match xs with [] -> [] | _ :: xs -> drop (n - 1) xs )

let rec splitAt n xs =
  match n <= 0 with
  | true -> ([], xs)
  | false -> (
      match xs with
      | [] -> ([], xs)
      | x :: xs ->
          let fsts, snds = splitAt (n - 1) xs in
          (x :: fsts, snds) )

let isInfixOf (x : string) (y : string) = Js.String.includes y x

let elem = elem

let notElem = notElem

let lookup k xs =
  let open Option.Infix in
  find (fun (k', _) -> k == k') xs <&> snd

let filter pred xs =
  foldr
    (fun x -> match pred x with true -> cons x | false -> Function.id)
    [] xs

let partition pred xs =
  foldr
    (fun x ->
      match pred x with
      | true -> Tuple.first (cons x)
      | false -> Tuple.second (cons x))
    ([], []) xs

let ( !! ) = List.nth

let subscript = ( !! )

let rec elemIndex e xs =
  match xs with
  | [] -> None
  | x :: xs -> (
      match e == x with
      | true -> Some 0
      | false -> Option.Infix.( <$> ) Int.succ (elemIndex e xs) )

let rec elemIndicesAux e i xs =
  match xs with
  | [] -> []
  | x :: xs -> (
      match e == x with
      | true -> i :: elemIndicesAux e (i + 1) xs
      | false -> elemIndicesAux e (i + 1) xs )

let elemIndices e xs = elemIndicesAux e 0 xs

let rec findIndex pred xs =
  match xs with
  | [] -> None
  | x :: xs -> (
      match pred x with
      | true -> Some 0
      | false -> Option.Infix.( <$> ) Int.succ (findIndex pred xs) )

let rec findIndicesAux pred i xs =
  match xs with
  | [] -> []
  | x :: xs -> (
      match pred x with
      | true -> i :: findIndicesAux pred (i + 1) xs
      | false -> findIndicesAux pred (i + 1) xs )

let findIndices pred xs = findIndicesAux pred 0 xs

let rec zip xs ys =
  match (xs, ys) with x :: xs, y :: ys -> (x, y) :: zip xs ys | _ -> []

let rec zipWith f xs ys =
  match (xs, ys) with x :: xs, y :: ys -> f x y :: zipWith f xs ys | _ -> []

let lines x =
  match Js.String.length x == 0 with
  | true -> []
  | false ->
      x
      |> Js.String.replaceByRe [%re "/\\n$/u"] ""
      |> Js.String.splitByRe [%re "/\\n/u"]
      |> Array.to_list |> Option.catOptions

let nub xs =
  foldr
    (fun x acc -> match notElem x acc with true -> x :: acc | false -> acc)
    [] xs

let rec delete e xs =
  match xs with
  | [] -> []
  | x :: xs -> ( match e == x with true -> xs | false -> delete e xs )

let difference xs ys = filter (Function.flip notElem ys) xs

let intersect xs ys = filter (Function.flip elem ys) xs

let rec disjoint xs ys =
  match (xs, ys) with
  | [], _ | _, [] -> true
  | xs, y :: ys -> notElem y xs && disjoint xs ys

let sortBy f = List.sort (fun a b -> f a b)

let countBy f xs = foldr (fun x -> if f x then Int.succ else Function.id) 0 xs

let rec lengthMin min xs =
  match xs with [] -> min <= 0 | _ :: xs -> lengthMin (min - 1) xs

let rec countMinBy pred min xs =
  match xs with
  | [] -> min <= 0
  | x :: xs ->
      min <= 0
      || countMinBy pred (match pred x with true -> min - 1 | false -> min) xs

let countMin e = countMinBy (( == ) e)

let rec lengthMax max xs =
  match max < 0 with
  | true -> false
  | false -> ( match xs with [] -> true | _ :: xs -> lengthMax (max - 1) xs )

let rec countMaxBy pred max xs =
  match max < 0 with
  | true -> false
  | false -> (
      match xs with
      | [] -> true
      | x :: xs ->
          countMaxBy pred
            (match pred x with true -> max - 1 | false -> max)
            xs )

let countMax e = countMaxBy (( == ) e)

let to_array = Array.of_list

let of_array = Array.to_list

module Extra = struct
  let lower str = String.lowercase_ascii str

  let trimStart str = str |> Js.String.replaceByRe [%re "/^\\s+/u"] ""

  let trimEnd str = str |> Js.String.replaceByRe [%re "/\\s+$/u"] ""

  let escapeRegex =
    Js.String.replaceByRe [%re "/[.*+?^${}()|[\\]\\\\]/gu"] "\\$&"

  let splitOn del x = Js.String.split del x |> Array.to_list

  let notNull xs = xs |> null |> not

  let notNullStr xs = xs |> Js.String.length |> ( < ) 0

  let list def f xs = match xs with [] -> def | x :: xs -> f x xs

  let rec unsnoc xs =
    match xs with
    | [] -> None
    | [ x ] -> Some ([], x)
    | x :: xs -> (
        match unsnoc xs with Some (a, b) -> Some (x :: a, b) | None -> None )

  let rec snoc xs x = match xs with [] -> [ x ] | x :: xs -> x :: snoc xs x

  let maximumOn f xs =
    foldr
      (fun x (m, max) ->
        x |> f |> fun res ->
        match res > max with true -> (Some x, res) | false -> (m, max))
      (None, Js.Int.min) xs
    |> Tuple.fst

  let minimumOn f xs =
    foldr
      (fun x (m, min) ->
        x |> f |> fun res ->
        match res < min with true -> (Some x, res) | false -> (m, min))
      (None, Js.Int.max) xs
    |> Tuple.fst

  let rec firstJust pred xs =
    match xs with
    | [] -> None
    | x :: xs -> (
        match pred x with Some _ as res -> res | None -> firstJust pred xs )

  let replaceStr (old_subseq : string) (new_subseq : string) (x : string) =
    Js.String.replaceByRe
      (Js.Re.fromStringWithFlags (escapeRegex old_subseq) ~flags:"gu")
      new_subseq x

  let replaceStrRe old_subseq_rx (new_subseq : string) (x : string) =
    Js.String.replaceByRe old_subseq_rx new_subseq x
end

module Safe = struct
  let atMay xs i = match i < 0 with true -> None | false -> List.nth_opt xs i
end

module Decode = struct
  let one_or_many decoder =
    Json.Decode.oneOf
      [ decoder |> Json.Decode.map pure; Json.Decode.list decoder ]
end

module Infix = struct
  include (
    Functor.MakeInfix (struct
      type nonrec 'a t = 'a t

      let fmap = fmap
    end) :
      Functor.Infix with type 'a t := 'a t )

  include (
    Applicative.MakeInfix (struct
      type nonrec 'a t = 'a t

      let pure = pure

      let fmap = fmap

      let rec ap fs xs =
        match fs with
        | [] -> []
        | gs -> (
            match xs with
            | [] -> []
            | x :: ys -> fmap (fun f -> f x) gs @ ap fs ys )
    end) :
      Applicative.Infix with type 'a t := 'a t )

  include (
    Applicative.Alternative.MakeInfix (struct
      type nonrec 'a t = 'a t

      let empty = []

      let alt xs ys = match xs with [] -> ys | xs -> xs
    end) :
      Applicative.Alternative.Infix with type 'a t := 'a t )

  include (
    Monad.MakeInfix (struct
      type nonrec 'a t = 'a t

      let pure = pure

      let fmap = fmap

      let rec bind f xs = match xs with [] -> [] | y :: ys -> f y @ bind f ys
    end) :
      Monad.Infix with type 'a t := 'a t )
end
