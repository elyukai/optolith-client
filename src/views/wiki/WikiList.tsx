import * as R from 'ramda';
import * as React from 'react';
import { ListView } from '../../components/List';
import { Entry, NameBySex } from '../../types/wiki';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { getRoman } from '../../utils/NumberUtils';
import { isActivatableWikiObj, isProfession, isSpecialAbility } from '../../utils/WikiUtils';
import { WikiListItem } from './WikiListItem';

export interface WikiListProps {
  list: List<Entry>;
  sex?: 'm' | 'f';
  currentInfoId?: string;
  showInfo (id: string): void;
}

export class WikiList extends React.Component<WikiListProps> {
  shouldComponentUpdate (nextProps: WikiListProps) {
    return nextProps.list !== this.props.list
      || nextProps.sex !== this.props.sex
      || nextProps.currentInfoId !== this.props.currentInfoId;
  }

  render () {
    const { list, sex = 'm' } = this.props;

    return (
      <ListView>
        {
          list && list
            .map (item => {
              const id = item.get ('id');

              const name = R.pipe (
                (rawName: string | Record<NameBySex>) => rawName instanceof Record
                  ? rawName.get (sex)
                  : rawName,
                rawName => {
                  if (isProfession (item)) {
                    const maybeSubname = item.lookup ('subname');

                    return Maybe.fromMaybe (rawName)
                                           (maybeSubname.fmap (
                                             subname => subname instanceof Record
                                               ? subname.get (sex)
                                               : subname
                                           ));
                  }

                  if (isSpecialAbility (item)) {
                    return Maybe.fromMaybe (rawName) (item.lookup ('nameInWiki'));
                  }

                  return rawName;
                },
                rawName => isActivatableWikiObj (item)
                  ? Maybe.fromMaybe (rawName)
                                    (item
                                      .lookup ('tiers')
                                      .fmap (levels => `${rawName} I-${getRoman (levels)}`))
                  : rawName
              ) (item.get ('name'));

              return (
                <WikiListItem {...this.props} id={id} key={id} name={name} />
              );
            })
            .toArray ()
        }
      </ListView>
    );
  }
}
