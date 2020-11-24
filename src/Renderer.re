Electron.WebFrame.setZoomFactor(1.0);
Electron.WebFrame.setVisualZoomLevelLimits(1.0, 1.0);

Webapi.Dom.document
|> Webapi.Dom.Document.querySelector("#bodywrapper")
|> Ley_Option.fmap(ReactDOM.render(<div> {React.string("Test")} </div>));

Electron.IpcRenderer.t->Ipc.FromMain.addListener(event =>
  fun
  | InitMinimal(supportedLocales, localeOrder, config, uiMessages) => {
      ();
    }
  | InitProgress(progress) => {
      ();
    }
  | InitDone(staticData) => {
      ();
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
    }
);
