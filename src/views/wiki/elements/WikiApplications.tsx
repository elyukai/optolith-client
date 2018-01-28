import * as React from 'react';
import { Application } from '../../../types/wiki';
import { UIMessages } from '../../../utils/I18n';
import { WikiProperty } from '../WikiProperty';

export interface WikiApplicationsProps {
  currentObject: {
    applications?: Application[];
    applicationsInput?: string;
  };
  locale: UIMessages;
}

export function WikiApplications(props: WikiApplicationsProps) {
  const {
    currentObject: {
      applications,
      applicationsInput
    },
    locale
  } = props;

  return (
    <WikiProperty locale={locale} title="info.applications">
      {applications && applications.map(e => e.name).sort().join(', ')}
      {applications && applicationsInput && ', '}
      {applicationsInput}
    </WikiProperty>
  );
}
