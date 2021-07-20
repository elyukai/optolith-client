open Node.WorkerThreads

type worker_data = Locale.Order.t * DatabaseReader.Entities.t

let (locale_order, entities) : worker_data = worker_data

type message =
  | Progress of float
  | Finished of Static.t
  | Error of Decoders_bs.Decode.error

let static_data =
  DatabaseDecoder.Entities.decode_files
    ~set_progress:(fun progress ->
      parent_port |. MessagePort.post_message (Progress progress))
    ~log_err:(fun err ->
      parent_port |. MessagePort.post_message (Error err : message))
    locale_order () entities

let () = parent_port |. MessagePort.post_message (Finished static_data)
