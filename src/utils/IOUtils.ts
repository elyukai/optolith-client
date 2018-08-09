import { remote } from 'electron';
import * as fs from 'fs';

export const readFile = (path: string, encoding: string = 'utf8') => {
  return new Promise<string | Buffer>((resolve, reject) => {
    fs.readFile(path, encoding, (error, data) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(data);
      }
    });
  });
};

export const readDir = (path: string) => {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, (error, data) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(data);
      }
    });
  });
};

export const writeFile = (path: string, data: any) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, error => {
      if (error) {
        reject(error);
      }
      else {
        resolve();
      }
    });
  });
};

/**
 * Prints windows' web page as PDF with Chromium's preview printing custom settings.
 */
export const windowPrintToPDF = (
  options: Electron.PrintToPDFOptions,
  window: Electron.BrowserWindow = remote.getCurrentWindow(),
) => {
  return new Promise<Buffer>((resolve, reject) => {
    window.webContents.printToPDF(options, (error, data) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(data);
      }
    });
  });
};

/**
 * Shows a native save dialog.
 */
export const showSaveDialog = (
  options: Electron.SaveDialogOptions,
  window: Electron.BrowserWindow = remote.getCurrentWindow(),
) => {
  return new Promise<string | undefined>(resolve => {
    remote.dialog.showSaveDialog(window, options, filename => {
      resolve(filename);
    });
  });
};

/**
 * Shows a native open dialog.
 */
export const showOpenDialog = (
  options: Electron.OpenDialogOptions,
  window: Electron.BrowserWindow = remote.getCurrentWindow(),
) => {
  return new Promise<string[] | undefined>(resolve => {
    remote.dialog.showOpenDialog(window, options, filenames => {
      if (filenames) {
        resolve(filenames);
      }
      resolve();
    });
  });
};

export const getSystemLocale = () => {
  const systemLocale = remote.app.getLocale();

  if (systemLocale.match(/^de/)) {
    return 'de-DE';
  }
  else if (systemLocale.match(/^nl/)) {
    return 'nl-BE';
  }

  return 'en-US';
};

const byteTags = ['', 'K', 'M', 'G', 'T'];

export const bytify = (number: number, localeId: string) => {
  let tier = 0;

  while (number > 1023 && tier < byteTags.length) {
    tier++;
    number /= 1024;
  }

  const rounded = Math.round(number * 10);
  const localizedNumber = (rounded / 10).toLocaleString(localeId);

  return `${localizedNumber} ${byteTags[tier]}B`;
};
