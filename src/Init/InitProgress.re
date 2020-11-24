type t =
  | UILoaded
  | DatabaseLoaded(float)
  | DatabaseParsed(float);

let getAbsoluteProgress =
  fun
  | UILoaded => 0.0
  | DatabaseLoaded(percent) => percent *. 0.5
  | DatabaseParsed(1.0) => 1.0
  | DatabaseParsed(percent) => 0.5 +. percent *. 0.5;
