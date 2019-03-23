import { remote } from 'electron';
import * as React from 'react';
import { translate, UIMessagesObject } from '../App/Utils/I18n';
import { Just, Maybe } from '../utils/dataUtils';
import { AvatarWrapper } from './AvatarWrapper';
import { BorderButton } from './BorderButton';
import { Dialog, DialogProps } from './DialogNew';

export interface AvatarChangeProps extends DialogProps {
  locale: UIMessagesObject;
  title?: string;
  setPath (path: string): void;
}

export interface AvatarChangeState {
  url: string;
  fileValid: boolean;
}

export class AvatarChange extends React.Component<AvatarChangeProps, AvatarChangeState> {
  state = {
    fileValid: false,
    url: '',
  };

  selectFile = () => {
    const extensions = ['jpeg', 'png', 'jpg'];
    remote.dialog.showOpenDialog (
      remote.getCurrentWindow (),
      {
        filters: [{ name: translate (this.props.locale, 'avatarchange.dialog.image'), extensions }],
      },
      fileNames => {
        if (fileNames) {
          const fileName = fileNames[0];
          const splitted = fileName.split ('.');
          if (extensions.includes (splitted[splitted.length - 1])) {
            this.setState ({ fileValid: true, url: `file://${fileName.replace (/\\/g, '/')}` });
          }
          else {
            this.setState ({ fileValid: false, url: '' });
          }
        }
      }
    );
  }

  load = () => {
    const { setPath } = this.props;
    const { url } = this.state;
    setPath (url);
  }

  componentWillReceiveProps (nextProps: AvatarChangeProps) {
    if (nextProps.isOpened === false && this.props.isOpened === true) {
      this.setState ({
        fileValid: false,
        url: '',
      });
    }
  }

  render () {
    const { locale, title } = this.props;
    const { fileValid, url } = this.state;

    return (
      <Dialog
        {...this.props}
        id="avatar-change"
        title={title || translate (locale, 'avatarchange.title')}
        buttons={[
          {
            disabled: fileValid === false || url === '',
            label: translate (locale, 'avatarchange.actions.change'),
            onClick: this.load,
          },
        ]}
        >
        <BorderButton
          label={translate (locale, 'avatarchange.actions.selectfile')}
          onClick={this.selectFile}
          />
        <AvatarWrapper
          src={
            Just (url)
              .bind (
                Maybe.ensure (unsafeUrl => fileValid === true && unsafeUrl !== '')
              )
          }
          />
        {fileValid === false && url !== '' && (
          <p>{translate (locale, 'avatarchange.view.invalidfile')}</p>
        )}
      </Dialog>
    );
  }
}