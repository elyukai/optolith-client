import * as React from 'react';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { isInteger, isNaturalNumber } from '../../App/Utils/RegexUtils';
import { Dialog } from '../../components/DialogNew';
import { TextField } from '../../components/TextField';
import { InputTextEvent } from '../../types/data';

interface Props {
  locale: UIMessagesObject;
  isOpened: boolean;
  isRemovingEnabled: boolean;
  addAdventurePoints (ap: number): void;
  close (): void;
}

interface State {
  value: string;
}

export class OverviewAddAP extends React.Component<Props, State> {
  state = {
    value: '',
  };

  onChange = (event: InputTextEvent) => this.setState ({ value: event.target.value });
  addAP = () => this.props.addAdventurePoints (Number.parseInt (this.state.value));

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isOpened === false && this.props.isOpened === true) {
      this.setState ({
        value: '',
      });
    }
  }

  render () {
    const { isRemovingEnabled, locale } = this.props;
    const { value } = this.state;

    return (
      <Dialog
        {...this.props}
        id="overview-add-ap"
        title={translate (locale, 'addadventurepoints.title')}
        buttons={[
          {
            disabled: isRemovingEnabled
              ? !isInteger (value)
              : (!isNaturalNumber (value) || Number.parseInt (value) < 1),
            label: translate (locale, 'addadventurepoints.actions.add'),
            onClick: this.addAP,
          },
          {
            label: translate (locale, 'addadventurepoints.actions.cancel'),
          },
        ]}
        >
        <TextField
          hint={translate (locale, 'addadventurepoints.options.adventurepoints')}
          value={value}
          onChange={this.onChange}
          fullWidth
          />
      </Dialog>
    );
  }
}
