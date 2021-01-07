Electron.WebFrame.setZoomFactor(1.0);
Electron.WebFrame.setVisualZoomLevelLimits(1.0, 1.0);

module Test = {
  [@react.component]
  let make = () => {
    let (progress, setProgress) = React.useState(() => 0.0);

    React.useEffect(() => {
      let listener = event =>
        fun
        | Ipc.InitMinimal(supportedLocales, localeOrder, config, uiMessages) => {
            setProgress(_ => 0.0);
            Js.Console.log("InitMinimal");
          }
        | InitProgress(progress) => {
            setProgress(_ => InitProgress.getAbsoluteProgress(progress));
            switch (progress) {
            | UILoaded => Js.Console.log("InitProgress.UILoaded")
            | DatabaseLoaded(percent) =>
              Js.Console.log(
                "InitProgress.DatabaseLoaded: " ++ Js.Float.toString(percent),
              )
            | DatabaseParsed(percent) =>
              Js.Console.log(
                "InitProgress.DatabaseParsed: " ++ Js.Float.toString(percent),
              )
            };
          }
        | InitDone(staticData) => {
            setProgress(_ => 1.0);
            Js.Console.log("InitDone");
          }
        | UpdateNotAvailable => {
            ();
          }
        | UpdateAvailable(updateInfo) => {
            ();
          }
        | DownloadProgress(progressInfo) => {
            ();
          }
        | AutoUpdaterError(exn) => {
            ();
          };

      Electron.IpcRenderer.t->Ipc.FromMain.addListener(listener);

      Some(
        () => Electron.IpcRenderer.t->Ipc.FromMain.removeListener(listener),
      );
    });

    <div>
      <h2> {React.string("Test")} </h2>
      <p className="featured">
        {React.string(
           "Progress: "
           ++ Js.Float.toString(
                Js.Math.floor_float(progress *. 10.0) /. 10.0,
              ),
         )}
      </p>
    </div>;
  };
};

Webapi.Dom.document
|> Webapi.Dom.Document.querySelector("#bodywrapper")
|> Ley_Option.fmap(ReactDOM.render(<Test />))
|> ignore;
