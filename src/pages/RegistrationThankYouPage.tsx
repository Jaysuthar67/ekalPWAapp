import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Card,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { CheckmarkCircle48Filled, Home24Regular, PersonAdd24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('40px', '20px'),
    maxWidth: '600px',
    ...shorthands.margin('0', 'auto'),
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  card: {
    ...shorthands.padding('48px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusLarge,
    width: '100%',
    maxWidth: '500px',
  },
  iconContainer: {
    ...shorthands.margin('0', '0', '24px', '0'),
    display: 'flex',
    justifyContent: 'center',
  },
  successIcon: {
    fontSize: '48px',
    color: tokens.colorPaletteGreenForeground1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    ...shorthands.margin('0', '0', '16px', '0'),
  },
  subtitle: {
    fontSize: '18px',
    color: tokens.colorNeutralForeground2,
    ...shorthands.margin('0', '0', '32px', '0'),
    lineHeight: '1.6',
  },
  message: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground1,
    ...shorthands.margin('0', '0', '40px', '0'),
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  secondaryButton: {
    color: tokens.colorBrandForeground1,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

const RegistrationThankYouPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRegisterAgain = () => {
    navigate('/registration');
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.iconContainer}>
          <CheckmarkCircle48Filled className={classes.successIcon} />
        </div>
        
        <Text className={classes.title}>Registration Successful!</Text>
        
        <Text className={classes.subtitle}>
          Thank you for registering with Adarsh Sanch
        </Text>
        
        <Text className={classes.message}>
          Your registration has been successfully submitted. Our team will review your application 
          and contact you within 2-3 working days with further details about the programs you've 
          selected. Please keep your contact information updated.
          <br /><br />
          For any queries, please contact us at our office or through the provided contact numbers.
        </Text>
        
        <div className={classes.buttonContainer}>
          <Button
            className={classes.primaryButton}
            appearance="primary"
            icon={<Home24Regular />}
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
          
          <Button
            className={classes.secondaryButton}
            appearance="outline"
            icon={<PersonAdd24Regular />}
            onClick={handleRegisterAgain}
          >
            Register Again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationThankYouPage;