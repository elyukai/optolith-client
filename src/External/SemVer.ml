(** [semver] package bindings *)

external prerelease : string -> Js.Json.t array option = "prerelease"
  [@@bs.module "semver"] [@@bs.return nullable]
(** Returns an array of prerelease components, or null if none exist. Example:
    [prerelease "1.2.3-alpha.1"] -> [|`String "alpha", `Int 1|] *)
