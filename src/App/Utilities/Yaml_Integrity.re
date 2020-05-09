module Entity = {
  let uniquePairs = xs =>
    List.fold_right(
      ((k, v), mp) =>
        IntMap.member(k, mp)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(k) ++ "is set twice",
              ),
            )
          : IntMap.insert(k, v, mp),
      xs,
      IntMap.empty,
    );

  let uniqueList = xs =>
    List.fold_right(
      (x, s) =>
        IntSet.member(x, s)
          ? raise(
              Json.Decode.DecodeError(
                "toMapIntegrity: Key " ++ Js.Int.toString(x) ++ "is set twice",
              ),
            )
          : IntSet.insert(x, s),
      xs,
      IntSet.empty,
    );
};
