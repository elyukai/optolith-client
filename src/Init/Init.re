let getSupportedLanguages = () => {
  IO.Infix.(
    Node.Path.join([|DatabaseReader.dataRoot, "SupportedLanguages.yml"|])
    |> IO.readFile
    <&> (
      data =>
        data |> DatabaseParser.Parser.parse |> Locale.Supported.Decode.map
    )
  );
};

let getConfig = () => {
  let filePath =
    Node.Path.join2(Electron.App.getPath(`userData), "config.yml");
  let filePathOld =
    Node.Path.join2(Electron.App.getPath(`userData), "config.json");

  IO.Infix.(
    IO.existsFile(filePath)
    >>= (
      isDefaultConfigPresent =>
        isDefaultConfigPresent
          ? IO.readFile(filePath)
            <&> (
              data => data |> DatabaseParser.Parser.parse |> AppConfig.Decode.t
            )
          : IO.existsFile(filePathOld)
            >>= (
              isOldConfigPresent =>
                isOldConfigPresent
                  ? IO.readFile(filePathOld)
                    <&> (
                      data =>
                        data
                        |> DatabaseParser.Parser.parse
                        |> AppConfig.Decode.Old.t
                    )
                  : IO.return(AppConfig.default)
            )
    )
  );
};

let getLocaleOrderFromConfig = (supportedLanguages, config: AppConfig.t) =>
  config.locales
  |> Locale.fromList
  // Remove all languages not supported and set a default is no order is
  // present.
  |> Locale.filterBySupported(
       Electron.App.getLocale()
       |> Locale.Supported.systemLocaleToId(supportedLanguages),
       supportedLanguages,
     );

let getUIMessages = localeOrder => {
  let preferredLocale = Locale.getPreferred(localeOrder);

  IO.Infix.(
    Node.Path.join([|
      DatabaseReader.dataRoot,
      "UI",
      preferredLocale ++ ".yml",
    |])
    |> IO.readFile
    <&> (
      data =>
        data
        |> DatabaseParser.Parser.parse
        |> Messages.Decode.t(preferredLocale)
    )
  );
};

let readDatabase = DatabaseReader.readFiles;

exception WorkerError(int, string);

let parseAndDecodeDatabase =
    (
      ~workerPath,
      ~workerData: (Locale.order, Messages.t, DatabaseReader.t),
      ~onProgress: float => unit,
    )
    : IO.t(Static.t) => {
  Js.Promise.make((~resolve, ~reject) => {
    let worker =
      WorkerThreads.Outside.createWithOptions(
        workerPath,
        {workerData: workerData},
      );

    worker->WorkerThreads.Outside.on(
      `message(
        fun
        | InitWorker.Progress(progress) => onProgress(progress)
        | Finished(data) => resolve(. data),
      ),
    );
    worker->WorkerThreads.Outside.on(`error(err => reject(. err)));
    worker->WorkerThreads.Outside.on(
      `exit(
        code =>
          reject(.
            WorkerError(
              code,
              "Worker stopped with exit code " ++ Ley_Int.show(code),
            ),
          ),
      ),
    );
  });
};

module Progress = {
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
};

let getInitialData =
    (~onMinimalDataReceived, ~initWorkerPath, ~onProgress: Progress.t => unit) => {
  IO.Infix.(
    getSupportedLanguages()
    >>= (
      supportedLanguages =>
        getConfig()
        >>= (
          config => {
            let localeOrder =
              getLocaleOrderFromConfig(supportedLanguages, config);

            getUIMessages(localeOrder)
            >>= (
              uiMessages => {
                onMinimalDataReceived(
                  ~supportedLanguages,
                  ~localeOrder,
                  ~config,
                  ~uiMessages,
                );

                readDatabase(~onProgress=percentage =>
                  onProgress(DatabaseLoaded(percentage))
                )
                >>= (
                  database =>
                    parseAndDecodeDatabase(
                      ~workerPath=initWorkerPath,
                      ~workerData=(localeOrder, uiMessages, database),
                      ~onProgress=percentage =>
                      onProgress(DatabaseParsed(percentage))
                    )
                );
              }
            );
          }
        )
    )
  );
};
