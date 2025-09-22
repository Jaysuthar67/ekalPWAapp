import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { bundleIcon, Home24Filled, Home24Regular, DocumentData24Filled, DocumentData24Regular, PersonAdd24Filled, PersonAdd24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRight('1px', 'solid', 'var(--colorNeutralStroke1)'),
    ...shorthands.padding('1rem', '0.5rem'),
    ...shorthands.gap('0.5rem'),
    transition: 'width 0.2s ease-in-out',
    overflowX: 'hidden',
    '@media (max-width: 768px)': {
      position: 'fixed',
      left: '0',
      top: '48px', // Header height
      height: 'calc(100vh - 48px)',
      zIndex: '1000',
      backgroundColor: 'var(--colorNeutralBackground2)',
      ...shorthands.borderRight('1px', 'solid', 'var(--colorNeutralStroke1)'),
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('0.75rem'),
    ...shorthands.padding('0.75rem', '1rem'),
    ...shorthands.borderRadius('4px'),
    textDecorationLine: 'none',
    color: 'var(--colorNeutralForeground1)',
    minHeight: '44px', // Touch-friendly size
    transition: 'all 0.2s ease',
    '&.active': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
      fontWeight: 'bold',
    },
    '&:hover': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
    },
    '@media (max-width: 768px)': {
      ...shorthands.padding('1rem'),
      fontSize: '1.1rem',
    },
  },
  linkText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  icon: {
    flexShrink: '0',
    fontSize: '24px',
  }
});

const HomeIcon = bundleIcon(Home24Filled, Home24Regular);
const ReportsIcon = bundleIcon(DocumentData24Filled, DocumentData24Regular);
const RegistrationIcon = bundleIcon(PersonAdd24Filled, PersonAdd24Regular);

interface NavigationProps {
  isCollapsed: boolean;
  closeNav?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isCollapsed, closeNav }) => {
  const styles = useStyles();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = () => {
    if (isMobile && closeNav) {
      closeNav();
    }
  };

  const getNavWidth = () => {
    if (isMobile) {
      return isCollapsed ? '0px' : '250px';
    }
    return isCollapsed ? '48px' : '250px';
  };

  const getNavTransform = () => {
    if (isMobile && isCollapsed) {
      return 'translateX(-100%)';
    }
    return 'translateX(0)';
  };

  return (
    <nav 
      className={styles.root} 
      style={{ 
        width: getNavWidth(),
        transform: getNavTransform(),
      }}
    >
      <NavLink to="/" className={styles.link} onClick={handleNavClick}>
        <HomeIcon className={styles.icon} />
        {!isCollapsed && <span className={styles.linkText}>Survey List</span>}
      </NavLink>
      <NavLink to="/registration" className={styles.link} onClick={handleNavClick}>
        <RegistrationIcon className={styles.icon} />
        {!isCollapsed && <span className={styles.linkText}>Registration</span>}
      </NavLink>
      <NavLink to="/reports" className={styles.link} onClick={handleNavClick}>
        <ReportsIcon className={styles.icon} />
        {!isCollapsed && <span className={styles.linkText}>Reports</span>}
      </NavLink>
    </nav>
  );
};
