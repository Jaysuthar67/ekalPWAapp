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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('1rem'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  card: {
    ...shorthands.padding('1rem'),
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
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
        <h2>Available Surveys</h2>
        {canInstall && (
          <Button
            icon={<ArrowDownload24Regular />}
            appearance="primary"
            onClick={install}
          >
            Install App
          </Button>
        )}
      </div>
      <div className={styles.root}>
        {surveys.map((survey) => (
          <Card key={survey.id} className={styles.card}>
            <CardHeader
              header={<Text weight="semibold">{survey.title}</Text>}
              description={<Badge color="informative">{survey.questions.length} questions</Badge>}
            />
            <CardPreview>
                <Text>
                    This is a survey about {survey.title.toLowerCase()}.
                </Text>
            </CardPreview>
            <div className={styles.cardFooter}>
              <Link to={`/survey/${survey.id}`}>
                <Button appearance="primary">Start Survey</Button>
              </Link>
              <Text size={200}>Responses: {responseCounts[survey.id] || 0}</Text> 
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
