import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  shorthands,
  Card,
  CardHeader,
  CardPreview,
  Button,
  Text,
  Badge,
} from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import surveys from '../data/surveys.json';
import { getAllResponses } from '../services/db';
import { usePWAInstall } from '../hooks/usePWAInstall';

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
  installButton: {
    flexShrink: '0',
    '@media (max-width: 480px)': {
      width: '100%',
      marginTop: '0.5rem',
    },
  },
  card: {
    ...shorthands.padding('clamp(0.75rem, 3vw, 1rem)'),
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    },
  },
  cardContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '1rem',
    ...shorthands.gap('0.5rem'),
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

export const SurveyListPage: React.FC = () => {
  const styles = useStyles();
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const { canInstall, install } = usePWAInstall();

  useEffect(() => {
    const fetchResponseCounts = async () => {
      const allResponses = await getAllResponses();
      const counts = allResponses.reduce((acc, response) => {
        acc[response.surveyId] = (acc[response.surveyId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setResponseCounts(counts);
    };
    fetchResponseCounts();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Available Surveys</h2>
        {canInstall && (
          <Button
            icon={<ArrowDownload24Regular />}
            appearance="primary"
            onClick={install}
            className={styles.installButton}
          >
            Install App
          </Button>
        )}
      </div>
      <div className={styles.root}>
        {surveys.map((survey) => (
          <Card key={survey.id} className={styles.card}>
            <div className={styles.cardContent}>
              <CardHeader
                header={<Text weight="semibold">{survey.title}</Text>}
                description={<Badge color="informative">{survey.questions.length} questions</Badge>}
              />
              <CardPreview>
                  <Text>
                      This is a survey about {survey.title.toLowerCase()}.
                  </Text>
              </CardPreview>
            </div>
            <div className={styles.cardFooter}>
              <Link to={`/survey/${survey.id}`}>
                <Button appearance="primary" className={styles.startButton}>Start Survey</Button>
              </Link>
              <Text size={200} className={styles.responseCount}>
                Responses: {responseCounts[survey.id] || 0}
              </Text> 
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
