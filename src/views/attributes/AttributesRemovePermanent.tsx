import * as React from 'react';
import { InputTextEvent } from '../../App/Models/Hero/heroTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { isNaturalNumber } from '../../App/Utils/RegexUtils';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { TextField } from '../../components/TextField';

export interface AttributesRemovePermanentProps extends DialogProps {
  locale: UIMessagesObject;
  remove (value: number): void;
}

export interface AttributesRemovePermanentState {
  value: string;
}

export class AttributesRemovePermanent
  extends React.Component<AttributesRemovePermanentProps, AttributesRemovePermanentState> {
  state = {
    value: '',
  };

  onChange = (event: InputTextEvent) => this.setState ({ value: event.target.value });
  remove = () => this.props.remove (Number.parseInt (this.state.value));

  render () {
    const { locale, ...other } = this.props;
    const { value } = this.state;

    return (
      <Dialog
        {...other}
        id="overview-add-ap"
        title={translate (locale, 'removepermanentenergypoints.title')}
        buttons={[
          {
            disabled: !isNaturalNumber (this.state.value),
            label: translate (locale, 'modal.actions.remove'),
            onClick: this.remove,
          },
          {
            label: translate (locale, 'modal.actions.cancel'),
          },
        ]}>
        <TextField
          hint={translate (locale, 'removepermanentenergypoints.inputhint')}
          value={value}
          onChange={this.onChange}
          fullWidth
          autoFocus
          />
      </Dialog>
    );
  }
}
