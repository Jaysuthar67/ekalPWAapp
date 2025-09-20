import React, { useState, useEffect } from 'react';
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
    position: 'relative',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  content: {
    ...shorthands.overflow('auto'),
    ...shorthands.padding('clamp(0.5rem, 4vw, 2rem)'),
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    '@media (max-width: 768px)': {
      ...shorthands.padding('1rem', '0.5rem'),
    },
    '@media (max-width: 480px)': {
      ...shorthands.padding('0.5rem', '0.25rem'),
    },
  },
  overlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '999',
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
});

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const styles = useStyles();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsNavCollapsed(true); // Auto-collapse on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Set initial state
    if (isMobile) {
      setIsNavCollapsed(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const toggleNav = () => setIsNavCollapsed(p => !p);

  const closeNav = () => setIsNavCollapsed(true);

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsNavCollapsed(true);
    }
  };

  const getGridColumns = () => {
    if (isMobile) {
      return '1fr';
    }
    return isNavCollapsed ? '48px 1fr' : '250px 1fr';
  };

  return (
    <div className={styles.root}>
      <Header isNavCollapsed={isNavCollapsed} toggleNav={toggleNav} />
      <div className={styles.main} style={{ gridTemplateColumns: getGridColumns() }}>
        <Navigation isCollapsed={isNavCollapsed} closeNav={closeNav} />
        <main className={styles.content}>
          {children}
          <PWAInstallPopup />
        </main>
        {/* Mobile overlay */}
        {isMobile && !isNavCollapsed && (
          <div 
            className={styles.overlay}
            onClick={handleOverlayClick}
            style={{ display: 'block' }}
          />
        )}
      </div>
    </div>
  );
};
