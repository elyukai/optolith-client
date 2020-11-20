type id;

[@bs.module "electron-devtools-installer"] [@bs.val]
external reactDeveloperTools: id = "REACT_DEVELOPER_TOOLS";

[@bs.module "electron-devtools-installer"] [@bs.val]
external reduxDevtools: id = "REDUX_DEVTOOLS";

[@bs.module "electron-devtools-installer"]
external install: array(id) => IO.t(string) = "default";
