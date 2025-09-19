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
    ...shorthands.padding('0.5rem', '2rem'),
    ...shorthands.borderBottom('1px', 'solid', 'var(--colorNeutralStroke1)'),
    height: '48px',
    backgroundColor: 'var(--colorNeutralBackground2)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('1rem'),
  },
  logo: {
    height: '32px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('1rem'),
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
        />
        <img src={logo} alt="Ekal Foundation Logo" className={styles.logo} />
        <h3>Ekal Foundation Survey</h3>
      </div>
      <div className={styles.right}>
        <Button
          icon={isDark ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        />
        <Menu>
          <MenuTrigger>
            <Avatar name="Demo User" size={32} />
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
