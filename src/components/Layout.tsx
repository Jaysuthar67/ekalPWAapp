import React, { useState } from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { PWAInstallPopup } from './PWAInstallPopup';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    height: '100vh',
    ...shorthands.overflow('hidden'),
  },
  main: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    ...shorthands.overflow('hidden'),
  },
  content: {
    ...shorthands.overflow('auto'),
    ...shorthands.padding('2rem'),
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
});

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const styles = useStyles();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const toggleNav = () => setIsNavCollapsed(p => !p);

  return (
    <div className={styles.root}>
      <Header isNavCollapsed={isNavCollapsed} toggleNav={toggleNav} />
      <div className={styles.main} style={{ gridTemplateColumns: isNavCollapsed ? '48px 1fr' : '250px 1fr' }}>
        <Navigation isCollapsed={isNavCollapsed} />
        <main className={styles.content}>
          {children}
          <PWAInstallPopup />
        </main>
      </div>
    </div>
  );
};
