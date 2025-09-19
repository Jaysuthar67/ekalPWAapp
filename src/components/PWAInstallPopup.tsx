import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';
import { usePWAInstall } from '../hooks/usePWAInstall';

const useStyles = makeStyles({
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('1rem'),
    ...shorthands.padding('1rem'),
  },
  icon: {
    fontSize: '48px',
    color: 'var(--colorBrandForeground1)',
  },
});

export const PWAInstallPopup: React.FC = () => {
  const styles = useStyles();
  const { canInstall, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (canInstall) {
      // Open the dialog after a short delay to not be too intrusive
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const handleInstallClick = () => {
    install();
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(_, data) => !data.open && handleDismiss()}>
      <DialogSurface>
        <DialogBody>
          <div className={styles.dialogBody}>
            <ArrowDownload24Regular className={styles.icon} />
            <DialogTitle>Install the Ekal Survey App</DialogTitle>
            <p>
              For a better experience, install this application on your device.
              It's fast, works offline, and is easily accessible from your home screen.
            </p>
            <DialogActions>
              <Button appearance="outline" onClick={handleDismiss}>Not now</Button>
              <Button appearance="primary" onClick={handleInstallClick}>Install</Button>
            </DialogActions>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
