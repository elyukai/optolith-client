let insertSpaceNotNull = x => String.length(x) > 0 ? x ++ " " : "";

let concatMsgValue = (msg, x) =>
  insertSpaceNotNull(msg)
  ++ (Js.Json.stringifyAny(x) |> Ley_Option.fromOption(""));

let trace = (msg: string, x) => {
  Js.Console.log(msg);
  x;
};

let traceId = (msg: string) => {
  Js.Console.log(msg);
  msg;
};

let traceShow = (a, b) => {
  Js.Console.log(a);
  b;
};

let traceShowId = x => {
  Js.Console.log(x);
  x;
};

let traceShowBoth = (a, b) => b |> traceShow(a) |> traceShowId;

let traceShowIdWhen = (print, x) =>
  print
    ? {
      Js.Console.log(x);
      x;
    }
    : x;

let traceIdWith = (f, x) => {
  Js.Console.log(f(x));
  x;
};

let traceShowWith = (msg, f, x) => {
  Js.Console.log(concatMsgValue(msg, f(x)));
  x;
};

let traceShowIdWith = (f, x) => {
  Js.Console.log(f(x));
  x;
};

let traceShowOn = (pred, msg, x) =>
  pred(x)
    ? {
      Js.Console.log(concatMsgValue(msg, x));
      x;
    }
    : x;
