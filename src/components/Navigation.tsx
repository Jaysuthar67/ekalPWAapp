import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { bundleIcon, Home24Filled, Home24Regular, ChartMultiple24Filled, ChartMultiple24Regular, DocumentData24Filled, DocumentData24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.borderRight('1px', 'solid', 'var(--colorNeutralStroke1)'),
    ...shorthands.padding('1rem', '0.5rem'),
    ...shorthands.gap('0.5rem'),
    transition: 'width 0.2s ease-in-out',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('0.75rem'),
    ...shorthands.padding('0.5rem', '1rem'),
    ...shorthands.borderRadius('4px'),
    textDecorationLine: 'none',
    color: 'var(--colorNeutralForeground1)',
    '&.active': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
      fontWeight: 'bold',
    },
  },
  linkText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
});

const HomeIcon = bundleIcon(Home24Filled, Home24Regular);
const AnalyticsIcon = bundleIcon(ChartMultiple24Filled, ChartMultiple24Regular);
const ReportsIcon = bundleIcon(DocumentData24Filled, DocumentData24Regular);

interface NavigationProps {
  isCollapsed: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isCollapsed }) => {
  const styles = useStyles();

  return (
    <nav className={styles.root} style={{ width: isCollapsed ? '48px' : '250px' }}>
      <NavLink to="/" className={styles.link}>
        <HomeIcon />
        {!isCollapsed && <span className={styles.linkText}>Survey List</span>}
      </NavLink>
      <NavLink to="/analytics" className={styles.link}>
        <AnalyticsIcon />
        {!isCollapsed && <span className={styles.linkText}>Analytics</span>}
      </NavLink>
      <NavLink to="/reports" className={styles.link}>
        <ReportsIcon />
        {!isCollapsed && <span className={styles.linkText}>Reports</span>}
      </NavLink>
    </nav>
  );
};
