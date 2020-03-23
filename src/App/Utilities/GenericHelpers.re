[@genType "OneOrMany"]
type oneOrMany('a) =
  | One('a)
  | Many(list('a));

[@genType "OneOrManyArr"]
type oneOrManyArr('a) =
  | One('a)
  | Many(array('a));
