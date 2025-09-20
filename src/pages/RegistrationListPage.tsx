import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Button,
  Badge,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { getAllRegistrations } from '../services/db';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    ...shorthands.gap('clamp(0.5rem, 2vw, 1rem)'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('0.75rem'),
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('0.5rem'),
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(0.5rem, 3vw, 1rem)',
    ...shorthands.gap('1rem'),
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  title: {
    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
    margin: '0',
    flex: '1',
    minWidth: '0',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    cursor: 'pointer',
    ...shorthands.transition('all', '0.2s', 'ease-in-out'),
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow16,
    },
  },
  cardContent: {
    flex: '1',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('12px', '16px', '16px', '16px'),
    ...shorthands.gap('1rem'),
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      ...shorthands.gap('0.75rem'),
    },
  },
  startButton: {
    '@media (max-width: 480px)': {
      width: '100%',
    },
  },
  responseCount: {
    textAlign: 'right',
    '@media (max-width: 480px)': {
      textAlign: 'center',
    },
  },
});

const RegistrationListPage: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [completedRegistrations, setCompletedRegistrations] = useState(0);

  useEffect(() => {
    const fetchRegistrationCount = async () => {
      try {
        const allRegistrations = await getAllRegistrations();
        setCompletedRegistrations(allRegistrations.length);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
        setCompletedRegistrations(0);
      }
    };

    fetchRegistrationCount();
  }, []);

  const handleStartRegistration = () => {
    navigate(`/registration/student-form`);
  };

  // Create a single registration item to display
  const registrationItem = {
    id: 'student-registration',
    title: 'Student Registration Form',
    description: 'Register for Adarsh Sanch programs and services',
    fieldCount: 16
  };

  return (
    <div>
      <div className={classes.header}>
        <h2 className={classes.title}>Registration Portal</h2>
      </div>

      <div className={classes.root}>
        <Card key={registrationItem.id} className={classes.card}>
          <div className={classes.cardContent}>
            <CardHeader
              header={<Text weight="semibold">{registrationItem.title}</Text>}
              description={<Badge color="informative">{registrationItem.fieldCount} fields</Badge>}
            />
            <CardPreview>
              <Text>
                {registrationItem.description}
              </Text>
            </CardPreview>
          </div>
          <div className={classes.cardFooter}>
            <Button 
              appearance="primary" 
              className={classes.startButton}
              onClick={handleStartRegistration}
            >
              Start Registration
            </Button>
            <Text size={200} className={classes.responseCount}>
              Responses: {completedRegistrations}
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationListPage;