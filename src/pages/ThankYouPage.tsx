import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Text, makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    ...shorthands.padding('clamp(2rem, 8vw, 5rem)', 'clamp(1rem, 4vw, 2rem)'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    ...shorthands.gap('1.5rem'),
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    color: 'var(--colorPaletteDarkGreenForeground1)',
    margin: '0',
  },
  message: {
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    color: 'var(--colorNeutralForeground2)',
    margin: '0',
    maxWidth: '500px',
    lineHeight: '1.5',
  },
  buttonContainer: {
    marginTop: 'clamp(1rem, 4vw, 2rem)',
  },
  backButton: {
    minWidth: '200px',
    minHeight: '44px',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    '@media (max-width: 480px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
});

export const ThankYouPage: React.FC = () => {
  const styles = useStyles();
  
  return (
    <div className={styles.root}>
      <Text as="h2" className={styles.title}>Thank you for your submission!</Text>
      <Text className={styles.message}>Your feedback is valuable to us and helps improve our services.</Text>
      <div className={styles.buttonContainer}>
        <Link to="/">
          <Button appearance="primary" className={styles.backButton}>
            Back to Survey List
          </Button>
        </Link>
      </div>
    </div>
  );
};
