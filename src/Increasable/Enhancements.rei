module Level1: {
  type t = {
    id: int,
    name: string,
    effect: string,
  };
};

module Level2: {
  type t = {
    id: int,
    name: string,
    effect: string,
    requiresLevel1: bool,
  };
};

module Level3: {
  type prerequisite =
    | First
    | Second;

  type t = {
    id: int,
    name: string,
    effect: string,
    requiresPrevious: option(prerequisite),
  };
};

type t = {
  levels: (Level1.t, Level2.t, Level3.t),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

type multilingual;

let decodeMultilingual: Json.Decode.decoder(multilingual);

let resolveTranslations: (Locale.order, multilingual) => option(t);
