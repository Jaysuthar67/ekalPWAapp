import React from 'react';
import {
  makeStyles,
  shorthands,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';
import { PanelLeftExpand24Regular, PanelLeftContract24Regular, WeatherMoon24Regular, WeatherSunny24Regular, ArrowDownload24Regular } from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import logo from '../assets/img/logo.png';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0.5rem', 'clamp(0.5rem, 4vw, 2rem)'),
    ...shorthands.borderBottom('1px', 'solid', 'var(--colorNeutralStroke1)'),
    height: '48px',
    backgroundColor: 'var(--colorNeutralBackground2)',
    minHeight: '48px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('clamp(0.5rem, 2vw, 1rem)'),
    flex: '1',
    minWidth: '0', // Allow flex items to shrink
  },
  logo: {
    height: 'clamp(24px, 6vw, 32px)',
    maxWidth: '100%',
  },
  title: {
    fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
    margin: '0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'none', // Hidden on mobile by default
    '@media (min-width: 768px)': {
      display: 'block',
    },
    '@media (min-width: 480px)': {
      display: 'block',
      fontSize: '1rem',
    },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('clamp(0.25rem, 2vw, 1rem)'),
    flexShrink: '0',
  },
  navButton: {
    minWidth: '44px',
    minHeight: '44px',
    padding: '0.5rem',
  },
  themeButton: {
    minWidth: '44px',
    minHeight: '44px',
    padding: '0.5rem',
    '@media (max-width: 480px)': {
      display: 'none', // Hide theme button on very small screens
    },
  },
  avatar: {
    cursor: 'pointer',
  },
});

interface HeaderProps {
  isNavCollapsed: boolean;
  toggleNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isNavCollapsed, toggleNav }) => {
  const styles = useStyles();
  const { toggleTheme, isDark } = useTheme();
  const { canInstall, install } = usePWAInstall();

  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <Button
          appearance="transparent"
          icon={isNavCollapsed ? <PanelLeftExpand24Regular /> : <PanelLeftContract24Regular />}
          onClick={toggleNav}
          aria-label="Toggle Navigation"
          className={styles.navButton}
        />
        <img src={logo} alt="Ekal Foundation Logo" className={styles.logo} />
        <h3 className={styles.title}>Ekal Foundation Survey</h3>
      </div>
      <div className={styles.right}>
        <Button
          appearance="transparent"
          icon={isDark ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={styles.themeButton}
        />
        <Menu>
          <MenuTrigger>
            <Avatar 
              name="Demo User" 
              size={window.innerWidth < 480 ? 28 : 32} 
              className={styles.avatar}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              {canInstall && (
                <MenuItem icon={<ArrowDownload24Regular />} onClick={install}>
                  Install App
                </MenuItem>
              )}
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  );
};
