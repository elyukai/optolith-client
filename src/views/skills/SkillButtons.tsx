import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItemButtons } from '../../components/ListItemButtons';

export interface SkillButtonsProps {
  activateDisabled?: boolean;
  addDisabled?: boolean;
  ic?: number;
  id: string;
  isNotActive?: boolean;
  removeDisabled?: boolean;
  sr?: number;
  activate? (): void;
  addPoint? (): void;
  removePoint? (): void;
  selectForInfo (id: string): void;
}

export function SkillButtons (props: SkillButtonsProps) {
  const {
    activateDisabled,
    addDisabled,
    ic,
    id,
    isNotActive,
    removeDisabled,
    sr,
    activate,
    addPoint,
    removePoint,
    selectForInfo,
  } = props;

  const boundSelectForInfo = () => selectForInfo (id);

  const getRemoveIcon = () => ic && sr === 0 && !removeDisabled || !ic ? '\uE90b' : '\uE909';

  return (
    <ListItemButtons>
      {isNotActive ? (
        <IconButton
          icon="&#xE916;"
          onClick={activate}
          disabled={activateDisabled}
          flat
          />
      ) : (
        <>
          {addPoint && (
            <IconButton
              icon="&#xE908;"
              onClick={addPoint}
              disabled={addDisabled}
              flat
              />
          )}
          {removePoint && (
            <IconButton
              icon={getRemoveIcon ()}
              onClick={removePoint}
              disabled={removeDisabled}
              flat
              />
          )}
        </>
      )}
      <IconButton
        icon="&#xE912;"
        onClick={boundSelectForInfo}
        flat
        />
    </ListItemButtons>
  );
}
