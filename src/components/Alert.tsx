import { remote } from 'electron';
import * as localShortcut from 'electron-localshortcut';
import * as React from 'react';
import { Action } from 'redux';
import { Alert as AlertOptions, ViewAlertButton } from '../types/data';
import { UIMessagesObject } from '../types/ui';
import { Maybe } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { Dialog } from './DialogNew';

export interface AlertProps {
  locale: UIMessagesObject;
  options: Maybe<AlertOptions>;
  close (): void;
  dispatch (action: Action): void;
}

export function Alert (props: AlertProps) {
  const { close, dispatch, options: maybeOptions, locale } = props;
  let buttons: ViewAlertButton[] | undefined;
  let message;
  let title;
  let onClose: (() => void) | undefined;

  if (!Maybe.isJust (maybeOptions)) {
    return null;
  }

  const options = Maybe.fromJust (maybeOptions);

  const {
    buttons: buttonsOption = [{ label: 'OK', autoWidth: true }],
    message: messageOption,
    title: titleOption,
    confirm,
    confirmYesNo,
    onClose: onCloseOption
  } = options;

  buttons = (confirm ? [
    {
      label: confirmYesNo ? translate (locale, 'yes') : translate (locale, 'ok'),
      dispatchOnClick: confirm.resolve
    },
    {
      label: confirmYesNo ? translate (locale, 'no') : translate (locale, 'cancel'),
      dispatchOnClick: confirm.reject
    }
  ] : buttonsOption).map (e => {
    const { dispatchOnClick, ...other } = e;

    return { ...other, onClick: () => {
      if (dispatchOnClick) {
        dispatch (dispatchOnClick);
      }
    }};
  });

  message = messageOption;
  title = titleOption;
  onClose = onCloseOption;

  const currentWindow = remote.getCurrentWindow ();

  const closeEnhanced = () => {
    if (localShortcut.isRegistered (currentWindow, 'Enter')) {
      localShortcut.unregister (currentWindow, 'Enter');
    }
    if (onClose) {
      onClose ();
    }
    close ();
  };

  if (buttons && buttons.length === 1) {
    localShortcut.register (currentWindow, 'Enter', () => {
      localShortcut.unregister (currentWindow, 'Enter');
      closeEnhanced ();
    });
  }

  return (
    <Dialog
      close={closeEnhanced}
      buttons={buttons}
      isOpened={typeof options === 'object'}
      className="alert"
      title={title}
      >
      {message}
    </Dialog>
  );
}
