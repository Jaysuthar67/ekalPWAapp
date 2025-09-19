import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAllResponses } from '../services/db';
import surveys from '../data/surveys.json';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    padding: '2rem',
  },
  chartContainer: {
    height: '400px',
    marginTop: '2rem',
  },
});

interface ChartData {
  name: string;
  responses: number;
}

export const AnalyticsPage: React.FC = () => {
  const styles = useStyles();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allResponses = await getAllResponses();
      const counts = allResponses.reduce((acc, response) => {
        acc[response.surveyId] = (acc[response.surveyId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const data = surveys.map((survey) => ({
        name: survey.title,
        responses: counts[survey.id] || 0,
      }));
      setChartData(data);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.root}>
      <h2>Analytics Dashboard</h2>
      <div className={styles.chartContainer}>
        <h3>Responses per Survey</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="responses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
