type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

let decode: (list(string), Js.Json.t) => Ley_Option.t(t);
