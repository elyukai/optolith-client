import * as classNames from 'classnames';
import { existsSync } from 'fs';
import * as React from 'react';
import { isBase64Image } from '../App/Utils/RegexUtils';
import { Maybe } from '../utils/dataUtils';
import { Avatar } from './Avatar';

export interface AvatarWrapperProps {
  className?: string;
  children?: React.ReactNode;
  img?: boolean;
  src: Maybe<string>;
  onClick? (): void;
}

export function AvatarWrapper (props: AvatarWrapperProps) {
  const { children, img, onClick, src: maybeSrc } = props;
  let { className } = props;

  const validPath = Maybe.elem (true)
                               (maybeSrc
                                .fmap (
                                  src => src.length > 0
                                    && (
                                      isBase64Image (src)
                                      || existsSync (src.replace (/file:[\\\/]+/, ''))
                                    )
                                ));

  className = classNames (className, {
    'avatar-wrapper': true,
    'no-avatar': !validPath,
  });

  return (
    <div className={className} onClick={onClick}>
      {children}
      <Avatar img={img} src={maybeSrc} hasWrapper validPath={validPath} />
    </div>
  );
}
