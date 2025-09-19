import { Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { SurveyListPage } from './pages/SurveyListPage';
import { SurveyTakingPage } from './pages/SurveyTakingPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SurveyListPage />} />
        <Route path="/survey/:surveyId" element={<SurveyTakingPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
