let (localeOrder, uiMessages, database): (
  Locale.Order.t,
  Messages.t,
  DatabaseReader.t,
) = WorkerThreads.Inside.workerData;

type message =
  | Progress(float)
  | Finished(Static.t);

let staticData =
  DatabaseParser.decodeFiles(
    ~onProgress=
      progress =>
        WorkerThreads.Inside.parentPort->WorkerThreads.Inside.postMessage(
          Progress(progress),
        ),
    localeOrder,
    uiMessages,
    database,
  );

WorkerThreads.Inside.parentPort->WorkerThreads.Inside.postMessage(
  Finished(staticData),
);
