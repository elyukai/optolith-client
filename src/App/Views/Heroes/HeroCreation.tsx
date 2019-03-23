import * as React from 'react';
import { Sex } from '../../App/Models/Hero/heroTypeHelpers';
import { Book, ExperienceLevel } from '../../App/Models/Wiki/wikiTypeHelpers';
import { translate } from '../../App/Utils/I18n';
import { Checkbox } from '../../components/Checkbox';
import { Dialog, DialogProps } from '../../components/DialogNew';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Hr } from '../../components/Hr';
import { Scroll } from '../../components/Scroll';
import { Option, SegmentedControls } from '../../components/SegmentedControls';
import { TextField } from '../../components/TextField';
import { UIMessagesObject } from '../../types/ui';
import { List, Maybe, Nothing, OrderedMap, OrderedSet, Record } from '../../Utilities/dataUtils';

export interface HeroCreationProps extends DialogProps {
  locale: UIMessagesObject;
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>;
  sortedBooks: List<Record<Book>>;
  close (): void;
  createHero (
    name: string,
    sex: 'm' | 'f',
    el: string,
    enableAllRuleBooks: boolean,
    enabledRuleBooks: OrderedSet<string>
  ): void;
}

export interface HeroCreationState {
  name: string;
  sex: Maybe<'m' | 'f'>;
  el: Maybe<string>;
  enableAllRuleBooks: boolean;
  enabledRuleBooks: OrderedSet<string>;
}

export class HeroCreation extends React.Component<HeroCreationProps, HeroCreationState> {
  state: HeroCreationState = {
    name: '',
    enableAllRuleBooks: false,
    enabledRuleBooks: OrderedSet.empty (),
    sex: Nothing (),
    el: Nothing (),
  };

  changeName = (name: string) => this.setState (() => ({ name }));
  changeGender = (sex: Maybe<'m' | 'f'>) => this.setState (() => ({ sex }));
  changeEL = (el: Maybe<string>) => this.setState (() => ({ el }));
  create = () => {
    const { name, sex, el, enableAllRuleBooks, enabledRuleBooks } = this.state;

    if (name.length > 0 && Maybe.isJust (sex) && Maybe.isJust (el)) {
      this.props.createHero (
        name,
        Maybe.fromJust (sex),
        Maybe.fromJust (el),
        enableAllRuleBooks,
        enabledRuleBooks
      );
    }
  }

  clear = () => this.setState (() => ({ name: '', gender: Nothing (), el: Nothing () }));

  close = () => {
    this.props.close ();
    this.clear ();
  }

  switchEnableAllRuleBooks = (): void => {
    this.setState (prevState => ({ enableAllRuleBooks: !prevState.enableAllRuleBooks }));
  }

  switchEnableRuleBook = (id: string): void => {
    const { enabledRuleBooks } = this.state;

    this.setState (
      () => ({
        enabledRuleBooks: enabledRuleBooks .member (id)
          ? enabledRuleBooks .delete (id)
          : enabledRuleBooks .insert (id),
      })
    );
  }

  componentWillReceiveProps (nextProps: HeroCreationProps) {
    if (nextProps.isOpened === false && this.props.isOpened === true) {
      this.clear ();
    }
  }

  render () {
    const { experienceLevels: experienceLevelsMap, locale, sortedBooks, ...other } = this.props;
    const { enableAllRuleBooks, enabledRuleBooks } = this.state;

    const experienceLevels = experienceLevelsMap
      .elems ()
      .map (
        e => Record.ofMaybe<DropdownOption> ({
          id: e.lookup ('id'),
          name: `${e.get ('name')} (${e.get ('ap')} AP)`,
        })
      );

    return (
      <Dialog
        {...other}
        id="herocreation"
        title={translate (locale, 'herocreation.title')}
        close={this.close}
        buttons={[
          {
            disabled: this.state.name === '' || !this.state.sex || !this.state.el,
            label: translate (locale, 'herocreation.actions.start'),
            onClick: this.create,
            primary: true,
          },
        ]}
        >
        <TextField
          hint={translate (locale, 'herocreation.options.nameofhero')}
          value={this.state.name}
          onChangeString={this.changeName}
          fullWidth
          autoFocus
          />
        <SegmentedControls
          active={this.state.sex}
          onClick={this.changeGender}
          options={List.of (
            Record.of<Option<Sex>> ({
              value: 'm',
              name: translate (locale, 'herocreation.options.selectsex.male'),
            }),
            Record.of<Option<Sex>> ({
              value: 'f',
              name: translate (locale, 'herocreation.options.selectsex.female'),
            })
          )}
          />
        <Dropdown
          value={this.state.el}
          onChange={this.changeEL}
          options={experienceLevels}
          hint={translate (locale, 'herocreation.options.selectexperiencelevel')}
          fullWidth
          />
        <Hr/>
        <Scroll>
          <Checkbox
            checked={enableAllRuleBooks === true}
            onClick={this.switchEnableAllRuleBooks}
            label={translate (locale, 'rules.enableallrulebooks')}
            />
          {sortedBooks.map (e => {
            const isCore = ['US25001', 'US25002'].includes (e .get ('id'));

            return (
              <Checkbox
                key={e.get ('id')}
                checked={enableAllRuleBooks || enabledRuleBooks.member (e .get ('id')) || isCore}
                onClick={() => this.switchEnableRuleBook (e .get ('id'))}
                label={e .get ('name')}
                disabled={enableAllRuleBooks === true || isCore}
                />
            );
          })}
        </Scroll>
      </Dialog>
    );
  }
}
