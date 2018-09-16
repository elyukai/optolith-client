import * as classNames from 'classnames';
import { existsSync } from 'fs';
import * as React from 'react';
import { Maybe } from '../utils/dataUtils';
import { isBase64Image } from '../utils/RegexUtils';

export interface AvatarProps {
  className?: string;
  hasWrapper?: boolean;
  img?: boolean;
  src: Maybe<string>;
  validPath?: boolean;
  onClick? (): void;
}

export function Avatar (props: AvatarProps) {
  const { className: inheritedClassName, hasWrapper, img, onClick, src: maybeSrc } = props;

  const {
    validPath = Maybe.elem (true)
                           (maybeSrc
                            .fmap (
                              src => src.length > 0
                                && (
                                  isBase64Image (src)
                                  || existsSync (src.replace (/file:[\\\/]+/, ''))
                                )
                            )),
  } = props;

  const className = classNames (
    !hasWrapper ? inheritedClassName : undefined,
    {
      'avatar': true,
      'no-avatar': !hasWrapper && !validPath,
    }
  );

  return img ? (
    <img
      className={className}
      src={Maybe.fromMaybe ('') (maybeSrc.bind (Maybe.ensure (() => validPath)))}
      onClick={onClick}
      alt=""
      />
  ) : (
    <div
      className={className}
      style={
        validPath
          ? { backgroundImage: `url("${Maybe.fromMaybe ('') (maybeSrc)}")` }
          : undefined
      }
      onClick={onClick}
      />
  );
}
