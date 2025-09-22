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
import { getAllResponses, getAllRegistrations } from '../services/db';
import surveys from '../data/surveys.json';
import registrations from '../data/registrations.json';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    padding: 'clamp(0.5rem, 4vw, 2rem)',
  },
  title: {
    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
    margin: '0 0 1rem 0',
    textAlign: 'center',
    '@media (max-width: 480px)': {
      textAlign: 'left',
    },
  },
  chartContainer: {
    height: 'clamp(300px, 60vh, 400px)',
    marginTop: 'clamp(1rem, 4vw, 2rem)',
    backgroundColor: 'var(--colorNeutralBackground1)',
    padding: 'clamp(0.5rem, 3vw, 1rem)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
      height: 'clamp(250px, 50vh, 350px)',
    },
    '@media (max-width: 480px)': {
      height: 'clamp(200px, 45vh, 300px)',
      padding: '0.5rem',
    },
  },
  chartTitle: {
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    margin: '0 0 1rem 0',
    textAlign: 'center',
    '@media (max-width: 480px)': {
      textAlign: 'left',
      fontSize: '1.1rem',
    },
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '1.5rem',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: tokens.colorBrandForeground1,
    margin: '0',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: tokens.colorNeutralForeground2,
    margin: '0.5rem 0 0 0',
  },
});

interface ChartData {
  name: string;
  responses: number;
}

interface StatsData {
  totalSurveys: number;
  totalRegistrations: number;
  totalSurveyResponses: number;
  totalRegistrationSubmissions: number;
}

export const AnalyticsPage: React.FC = () => {
  const styles = useStyles();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [registrationData, setRegistrationData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalSurveys: 0,
    totalRegistrations: 0,
    totalSurveyResponses: 0,
    totalRegistrationSubmissions: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch survey responses
      const allResponses = await getAllResponses();
      const surveyResponseCounts = allResponses.reduce((acc, response) => {
        acc[response.surveyId] = (acc[response.surveyId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const surveyData = surveys.map((survey) => ({
        name: survey.title,
        responses: surveyResponseCounts[survey.id] || 0,
      }));

      // Fetch registration data
      const allRegistrationSubmissions = await getAllRegistrations();
      const registrationCounts = allRegistrationSubmissions.reduce((acc, registration) => {
        acc[registration.registrationId] = (acc[registration.registrationId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const regData = registrations.map((registration) => ({
        name: registration.title,
        responses: registrationCounts[registration.id] || 0,
      }));

      // Add Student Registration Form data
      const studentRegistrationCount = registrationCounts['student-registration-form'] || 0;
      regData.push({
        name: 'Student Registration Form',
        responses: studentRegistrationCount,
      });

      setChartData(surveyData);
      setRegistrationData(regData);
      setStats({
        totalSurveys: surveys.length,
        totalRegistrations: registrations.length + 1, // +1 for student form
        totalSurveyResponses: allResponses.length,
        totalRegistrationSubmissions: allRegistrationSubmissions.length,
      });
    };
    fetchData();
  }, []);

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Analytics Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3 className={styles.statNumber}>{stats.totalSurveys}</h3>
          <p className={styles.statLabel}>Total Surveys</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statNumber}>{stats.totalSurveyResponses}</h3>
          <p className={styles.statLabel}>Survey Responses</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statNumber}>{stats.totalRegistrations}</h3>
          <p className={styles.statLabel}>Registration Types</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statNumber}>{stats.totalRegistrationSubmissions}</h3>
          <p className={styles.statLabel}>Registration Submissions</p>
        </div>
      </div>

      {/* Survey Responses Chart */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Responses per Survey</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ 
              top: 20, 
              right: window.innerWidth < 480 ? 10 : 30, 
              left: window.innerWidth < 480 ? 10 : 20, 
              bottom: window.innerWidth < 480 ? 40 : 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={window.innerWidth < 480 ? 10 : 12}
              angle={window.innerWidth < 480 ? -45 : 0}
              textAnchor={window.innerWidth < 480 ? 'end' : 'middle'}
              height={window.innerWidth < 480 ? 80 : 60}
              interval={0}
            />
            <YAxis 
              allowDecimals={false} 
              fontSize={window.innerWidth < 480 ? 10 : 12}
            />
            <Tooltip 
              contentStyle={{
                fontSize: window.innerWidth < 480 ? '12px' : '14px',
                padding: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth < 480 ? '12px' : '14px',
              }}
            />
            <Bar dataKey="responses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Registration Submissions Chart */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Registration Submissions</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={registrationData}
            margin={{ 
              top: 20, 
              right: window.innerWidth < 480 ? 10 : 30, 
              left: window.innerWidth < 480 ? 10 : 20, 
              bottom: window.innerWidth < 480 ? 40 : 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={window.innerWidth < 480 ? 10 : 12}
              angle={window.innerWidth < 480 ? -45 : 0}
              textAnchor={window.innerWidth < 480 ? 'end' : 'middle'}
              height={window.innerWidth < 480 ? 80 : 60}
              interval={0}
            />
            <YAxis 
              allowDecimals={false} 
              fontSize={window.innerWidth < 480 ? 10 : 12}
            />
            <Tooltip 
              contentStyle={{
                fontSize: window.innerWidth < 480 ? '12px' : '14px',
                padding: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: window.innerWidth < 480 ? '12px' : '14px',
              }}
            />
            <Bar dataKey="responses" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
