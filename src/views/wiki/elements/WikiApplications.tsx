import * as React from 'react';
import { Application } from '../../../types/wiki';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';
import { sortStrings } from '../../../utils/FilterSortUtils';

export interface WikiApplicationsProps {
  currentObject: {
    applications?: Application[];
    applicationsInput?: string;
  };
  locale: UIMessages;
  showNewApplications?: boolean;
}

export function WikiApplications(props: WikiApplicationsProps): JSX.Element | null {
  const {
    currentObject: {
      applications,
      applicationsInput
    },
    locale,
    showNewApplications,
  } = props;

  if (typeof applications === 'object') {
    if (showNewApplications) {
      const newApplications = applications.filter(e => {
        return typeof e.prerequisites === 'object';
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
          {sortedApplications.join(', ')}
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
        {sortedApplications.join(', ')}
        {applicationsInput && ', '}
        {applicationsInput}
      </WikiProperty>
    );
  }

  return null;
}
