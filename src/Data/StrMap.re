module StrMap = Data_Map.Make(String);

include StrMap;

type strmap('a) = t('a);
