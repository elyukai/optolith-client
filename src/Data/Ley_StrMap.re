module StrMap = Ley_Map.Make(String);

include StrMap;

type strmap('a) = t('a);
