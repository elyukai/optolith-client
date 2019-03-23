import * as React from 'react';
import { Advantage, Application, SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { UIMessages } from '../../../App/Utils/I18n';
import { sortStrings } from '../../../Utilities/FilterSortUtils';
import { WikiProperty } from '../WikiProperty';

export interface WikiApplicationsProps {
  advantages: Map<string, Advantage>;
  currentObject: {
    applications?: Application[];
    applicationsInput?: string;
  };
  locale: UIMessages;
  showNewApplications?: boolean;
  specialAbilities: Map<string, SpecialAbility>;
}

export function WikiApplications(props: WikiApplicationsProps): JSX.Element | null {
  const {
    advantages,
    currentObject: {
      applications,
      applicationsInput
    },
    locale,
    showNewApplications,
    specialAbilities,
  } = props;

  if (typeof applications === 'object') {
    if (showNewApplications) {
      const newApplications = applications.filter(e => {
        return typeof e.prerequisites === 'object' &&
          (advantages.has(e.prerequisites[0].id as string) ||
          specialAbilities.has(e.prerequisites[0].id as string));
      });

      if (newApplications.length === 0) {
        return null;
      }

      const sortedApplications = sortStrings(
        newApplications.map(e => e.name),
        locale.id,
      );

      return (
        <WikiProperty locale={locale} title="info.newapplications">
          {sortedApplications.intercalate(', ')}
        </WikiProperty>
      );
    }

    const defaultApplications = applications.filter(e => {
      return e.prerequisites === undefined;
    });

    const sortedApplications = sortStrings(
      defaultApplications.map(e => e.name),
      locale.id
    );

    return (
      <WikiProperty locale={locale} title="info.applications">
        {sortedApplications.intercalate(', ')}
        {applicationsInput && ', '}
        {applicationsInput}
      </WikiProperty>
    );
  }

  return null;
}
