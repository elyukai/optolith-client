let isUpdaterEnabled = () => {
  switch (Os.platform()) {
  | `win32 => Electron.App.isPackaged
  | _ => false
  };
};
