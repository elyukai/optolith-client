import * as React from 'react';

export interface MainContentProps {
  children?: React.ReactNode;
}

export function MainContent(props: MainContentProps) {
  const { children } = props;
  return (
    <main className="main-content">
      {children}
    </main>
  );
}
