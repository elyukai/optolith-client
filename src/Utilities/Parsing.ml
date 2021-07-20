module Infix = struct
  let ( >>=:: ) fst rest = Decoders_bs.Decode.uncons rest fst
end

type ('id, 'a) make_assoc =
  Locale.Order.t -> ('id * 'a) option Decoders_bs.Decode.decoder
