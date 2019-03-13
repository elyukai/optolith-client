import * as React from 'react';

export interface SkillFillProps {
  addFillElement?: boolean;
}

export function SkillFill (props: SkillFillProps) {
  const { addFillElement } = props;

  if (addFillElement) {
    return (
      <div className="fill" />
    );
  }

  return null;
}
