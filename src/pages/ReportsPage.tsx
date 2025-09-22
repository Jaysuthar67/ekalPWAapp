import React, { useEffect, useState } from 'react';
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  createTableColumn,
  makeStyles,
  shorthands,
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Card,
  Text,
} from '@fluentui/react-components';
import { Eye24Regular, DocumentTable24Regular, PersonAdd24Regular, ArrowLeft24Regular } from '@fluentui/react-icons';
import type { TableColumnDefinition } from '@fluentui/react-components';
import { getAllResponses, getAllRegistrations } from '../services/db';
import surveys from '../data/surveys.json';

// Helper function to get question text by ID
const getQuestionText = (questionId: string): string => {
  const survey = surveys.find(s => s.id === 'baseline-survey-adarsh-sanch');
  const question = survey?.questions.find(q => q.id === questionId);
  return question?.text || questionId;
};

// Helper function to map registration field names to proper labels
const getRegistrationFieldLabel = (fieldName: string): string => {
  const fieldLabels: Record<string, string> = {
    fname: 'First Name',
    lname: 'Last Name', 
    gender: 'Gender',
    fathername: "Father's Name",
    occupation: 'Occupation',
    dob: 'Date of Birth',
    qualification: 'Qualification',
    addhar: 'Aadhar Number',
    mobilenumber: 'Mobile Number',
    emailId: 'Email Id',
    financialbackground: 'Financial Background',
    village: 'Village',
    block: 'Block',
    district: 'District',
    state: 'State',
    enrollment: 'Enrollment'
  };
  return fieldLabels[fieldName] || fieldName;
};

const useStyles = makeStyles({
  root: {
    padding: 'clamp(0.5rem, 4vw, 2rem)',
  },
  title: {
    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
    margin: '0 0 2rem 0',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      fontSize: 'clamp(1.1rem, 5vw, 1.6rem)',
      margin: '0 0 1.5rem 0',
    },
    '@media (max-width: 480px)': {
      fontSize: 'clamp(1rem, 6vw, 1.4rem)',
      margin: '0 0 1rem 0',
    },
  },
  backButton: {
    marginBottom: '1rem',
  },
  tilesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('2rem'),
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('1.5rem'),
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      ...shorthands.gap('1rem'),
      ...shorthands.padding('0', '0.5rem'),
    },
  },
  reportTile: {
    display: 'flex',
    flexDirection: 'column',
    height: '200px',
    cursor: 'pointer',
    ...shorthands.transition('all', '0.2s', 'ease-in-out'),
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
    '@media (max-width: 768px)': {
      height: '180px',
    },
    '@media (max-width: 480px)': {
      height: '160px',
      ':hover': {
        transform: 'none', // Disable hover transform on mobile
      },
    },
  },
  surveyTile: {
    backgroundColor: '#fff3cd', // Light yellow/warning (Bootstrap warning-like)
    color: '#856404',
    ...shorthands.border('2px', 'solid', '#ffeaa7'),
    ...shorthands.borderRadius('12px'),
    ':hover': {
      backgroundColor: '#ffeaa7',
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 30px rgba(133, 100, 4, 0.2)',
    },
  },
  registrationTile: {
    backgroundColor: '#f8d7da', // Light pink/danger (Bootstrap danger-like)
    color: '#721c24',
    ...shorthands.border('2px', 'solid', '#f1b0b7'),
    ...shorthands.borderRadius('12px'),
    ':hover': {
      backgroundColor: '#f1b0b7',
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 30px rgba(114, 28, 36, 0.2)',
    },
  },
  tileContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    ...shorthands.padding('2rem'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('1.5rem'),
    },
    '@media (max-width: 480px)': {
      ...shorthands.padding('1rem'),
    },
  },
  tileIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    '@media (max-width: 768px)': {
      fontSize: '3rem',
      marginBottom: '0.75rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
    },
  },
  surveyTileIcon: {
    color: '#856404', // Dark yellow to match survey tile
  },
  registrationTileIcon: {
    color: '#721c24', // Dark pink/red to match registration tile
  },
  tileTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    '@media (max-width: 768px)': {
      fontSize: '1.2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '1.1rem',
    },
  },
  tileCount: {
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-1px',
    '@media (max-width: 768px)': {
      fontSize: '2.2rem',
    },
    '@media (max-width: 480px)': {
      fontSize: '2rem',
    },
  },
  tableContainer: {
    ...shorthands.overflow('auto'),
    backgroundColor: 'var(--colorNeutralBackground1)',
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '@media (max-width: 768px)': {
      fontSize: '0.85rem',
      ...shorthands.margin('0', '-0.5rem'), // Full width on mobile
    },
    '@media (max-width: 480px)': {
      fontSize: '0.75rem',
      ...shorthands.borderRadius('0px'), // Remove border radius on small mobile
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
  },
  mobileMessage: {
    textAlign: 'center',
    ...shorthands.padding('1rem'),
    backgroundColor: 'var(--colorNeutralBackground2)',
    ...shorthands.borderRadius('8px'),
    marginBottom: '1rem',
  },
  dialogGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '1.5rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1rem',
    },
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      gap: '0.75rem',
    },
  },
  fieldItem: {
    flex: '1 1 calc(50% - 1rem)',
    minWidth: '300px',
    padding: '1rem',
    backgroundColor: 'var(--colorNeutralBackground2)',
    borderRadius: '12px',
    border: '1px solid var(--colorNeutralStroke2)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden', // Prevent content overflow
    '@media (max-width: 768px)': {
      flex: '1 1 100%',
      minWidth: 'auto',
    },
  },
  fieldLabel: {
    fontWeight: '600',
    color: 'var(--colorNeutralForeground1)',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  },
  fieldValue: {
    color: 'var(--colorNeutralForeground2)',
    fontSize: '1rem',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dialogSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.75rem',
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
      gap: '0.5rem',
    },
  },
  summaryCard: {
    padding: '1rem',
    backgroundColor: 'var(--colorBrandBackground2)',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '0', // Important for proper text wrapping
    overflow: 'hidden',
  },
  summaryLabel: {
    fontSize: '0.85rem',
    color: 'var(--colorNeutralForeground2)',
    marginBottom: '0.25rem',
    wordWrap: 'break-word',
  },
  summaryValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--colorNeutralForeground1)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
});

type ResponseItem = {
  survey: string;
  respondent: string;
  status: string;
  submittedDate: string;
  duration: string;
  rawData?: any; // For storing complete response data
};

type RegistrationItem = {
  type: string;
  name: string;
  email: string;
  mobile: string;
  village: string;
  submittedDate: string;
  rawData?: any; // For storing complete registration data
};

export const ReportsPage: React.FC = () => {
  const styles = useStyles();
  const [surveyItems, setSurveyItems] = useState<ResponseItem[]>([]);
  const [registrationItems, setRegistrationItems] = useState<RegistrationItem[]>([]);
  const [viewMode, setViewMode] = useState<'tiles' | 'surveys' | 'registrations'>('tiles');
  const [selectedSurveyItem, setSelectedSurveyItem] = useState<ResponseItem | null>(null);
  const [selectedRegistrationItem, setSelectedRegistrationItem] = useState<RegistrationItem | null>(null);
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Track mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewSurveyDetails = (item: ResponseItem) => {
    setSelectedSurveyItem(item);
    setIsSurveyDialogOpen(true);
  };

  const handleViewRegistrationDetails = (item: RegistrationItem) => {
    setSelectedRegistrationItem(item);
    setIsRegistrationDialogOpen(true);
  };

  const surveyColumns: TableColumnDefinition<ResponseItem>[] = [
    createTableColumn<ResponseItem>({
      columnId: 'survey',
      compare: (a, b) => a.survey.localeCompare(b.survey),
      renderHeaderCell: () => 'Survey',
      renderCell: (item) => item.survey,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'respondent',
      compare: (a, b) => a.respondent.localeCompare(b.respondent),
      renderHeaderCell: () => 'Respondent',
      renderCell: (item) => item.respondent,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (item) => item.status,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'submittedDate',
      compare: (a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
      renderHeaderCell: () => 'Submitted Date',
      renderCell: (item) => item.submittedDate,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'duration',
      compare: (a, b) => a.duration.localeCompare(b.duration),
      renderHeaderCell: () => 'Duration',
      renderCell: (item) => item.duration,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'actions',
      renderHeaderCell: () => 'Actions',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<Eye24Regular />}
          onClick={() => handleViewSurveyDetails(item)}
          title="View Details"
        />
      ),
    }),
  ];

  // Mobile-optimized survey columns (fewer columns for better mobile experience)
  const surveyMobileColumns: TableColumnDefinition<ResponseItem>[] = [
    createTableColumn<ResponseItem>({
      columnId: 'respondent',
      compare: (a, b) => a.respondent.localeCompare(b.respondent),
      renderHeaderCell: () => 'Respondent',
      renderCell: (item) => item.respondent,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (item) => item.status,
    }),
    createTableColumn<ResponseItem>({
      columnId: 'actions',
      renderHeaderCell: () => 'View',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<Eye24Regular />}
          onClick={() => handleViewSurveyDetails(item)}
          title="View Details"
        />
      ),
    }),
  ];

  const registrationColumns: TableColumnDefinition<RegistrationItem>[] = [
    createTableColumn<RegistrationItem>({
      columnId: 'type',
      compare: (a, b) => a.type.localeCompare(b.type),
      renderHeaderCell: () => 'Registration Type',
      renderCell: (item) => item.type,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Name',
      renderCell: (item) => item.name,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'email',
      compare: (a, b) => a.email.localeCompare(b.email),
      renderHeaderCell: () => 'Email',
      renderCell: (item) => item.email,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'mobile',
      compare: (a, b) => a.mobile.localeCompare(b.mobile),
      renderHeaderCell: () => 'Mobile',
      renderCell: (item) => item.mobile,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'village',
      compare: (a, b) => a.village.localeCompare(b.village),
      renderHeaderCell: () => 'Village',
      renderCell: (item) => item.village,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'submittedDate',
      compare: (a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
      renderHeaderCell: () => 'Submitted Date',
      renderCell: (item) => item.submittedDate,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'actions',
      renderHeaderCell: () => 'Actions',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<Eye24Regular />}
          onClick={() => handleViewRegistrationDetails(item)}
          title="View Details"
        />
      ),
    }),
  ];

  // Mobile-optimized registration columns (fewer columns for better mobile experience)
  const registrationMobileColumns: TableColumnDefinition<RegistrationItem>[] = [
    createTableColumn<RegistrationItem>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Name',
      renderCell: (item) => item.name,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'mobile',
      compare: (a, b) => a.mobile.localeCompare(b.mobile),
      renderHeaderCell: () => 'Mobile',
      renderCell: (item) => item.mobile,
    }),
    createTableColumn<RegistrationItem>({
      columnId: 'actions',
      renderHeaderCell: () => 'View',
      renderCell: (item) => (
        <Button
          appearance="subtle"
          icon={<Eye24Regular />}
          onClick={() => handleViewRegistrationDetails(item)}
          title="View Details"
        />
      ),
    }),
  ];

  useEffect(() => {
    const fetchData = async () => {
      // Fetch survey responses
      const responses = await getAllResponses();
      const surveyMap = new Map(surveys.map((s) => [s.id, s.title]));

      const formattedSurveyItems = responses.map((r, index) => ({
        survey: surveyMap.get(r.surveyId) || 'Unknown Survey',
        respondent: `User #${index + 1}`, // Fake data for privacy
        status: r.completed ? 'Completed' : 'Partial',
        submittedDate: new Date(r.submittedAt).toLocaleDateString(),
        duration: '5m 30s', // Fake data
        rawData: r, // Store complete response data
      }));

      // Fetch registration data
      const registrations = await getAllRegistrations();
      const formattedRegistrationItems = registrations.map((r) => ({
        type: r.registrationId === 'student-registration-form' ? 'Student Registration' : r.registrationId,
        name: `${r.responses.fname || ''} ${r.responses.lname || ''}`.trim() || 'Unknown',
        email: r.responses.emailId || 'Not provided',
        mobile: r.responses.mobilenumber || 'Not provided',
        village: r.responses.village || 'Not provided',
        submittedDate: new Date(r.completedAt).toLocaleDateString(),
        rawData: r, // Store complete registration data
      }));

      setSurveyItems(formattedSurveyItems);
      setRegistrationItems(formattedRegistrationItems);
    };

    fetchData();
  }, []);

  const handleTileClick = (reportType: 'surveys' | 'registrations') => {
    setViewMode(reportType);
  };

  const handleBackToTiles = () => {
    setViewMode('tiles');
  };

  return (
    <div className={styles.root}>
      {viewMode === 'tiles' ? (
        // Tiles View
        <>
          <h2 className={styles.title}>Reports Dashboard</h2>
          <div className={styles.tilesContainer}>
            {/* Survey Reports Tile */}
            <Card className={`${styles.reportTile} ${styles.surveyTile}`} onClick={() => handleTileClick('surveys')}>
              <div className={styles.tileContent}>
                <DocumentTable24Regular className={`${styles.tileIcon} ${styles.surveyTileIcon}`} />
                <Text className={styles.tileTitle}>Survey Reports</Text>
                <Text className={styles.tileCount}>{surveyItems.length}</Text>
                <Text style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                  Total Responses
                </Text>
              </div>
            </Card>

            {/* Registration Reports Tile */}
            <Card className={`${styles.reportTile} ${styles.registrationTile}`} onClick={() => handleTileClick('registrations')}>
              <div className={styles.tileContent}>
                <PersonAdd24Regular className={`${styles.tileIcon} ${styles.registrationTileIcon}`} />
                <Text className={styles.tileTitle}>Registration Reports</Text>
                <Text className={styles.tileCount}>{registrationItems.length}</Text>
                <Text style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
                  Total Registrations
                </Text>
              </div>
            </Card>
          </div>
        </>
      ) : (
        // Table View
        <>
          <Button 
            className={styles.backButton}
            appearance="subtle" 
            icon={<ArrowLeft24Regular />} 
            onClick={handleBackToTiles}
          >
            Back to Reports
          </Button>
          <h2 className={styles.title}>
            {viewMode === 'surveys' ? 'Survey Responses' : 'Registration Reports'}
          </h2>

          <div className={styles.mobileMessage}>
            <p>Total {viewMode === 'surveys' ? 'Survey Responses' : 'Registrations'}: {viewMode === 'surveys' ? surveyItems.length : registrationItems.length}</p>
          </div>

          <div className={styles.tableContainer}>
            {viewMode === 'surveys' ? (
              <DataGrid items={surveyItems} columns={isMobile ? surveyMobileColumns : surveyColumns} sortable selectionMode="multiselect">
                <DataGridHeader>
                  <DataGridRow>
                    {(column) => (
                      <DataGridHeaderCell key={column.columnId}>
                        {column.renderHeaderCell()}
                      </DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<ResponseItem>>
                  {({ item, rowId }) => (
                    <DataGridRow<ResponseItem> key={rowId}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            ) : (
              <DataGrid items={registrationItems} columns={isMobile ? registrationMobileColumns : registrationColumns} sortable selectionMode="multiselect">
                <DataGridHeader>
                  <DataGridRow>
                    {(column) => (
                      <DataGridHeaderCell key={column.columnId}>
                        {column.renderHeaderCell()}
                      </DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<RegistrationItem>>
                  {({ item, rowId }) => (
                    <DataGridRow<RegistrationItem> key={rowId}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            )}
          </div>
        </>
      )}

      {/* Survey Details Dialog */}
      {selectedSurveyItem && (
        <Dialog open={isSurveyDialogOpen} onOpenChange={(_, data) => setIsSurveyDialogOpen(data.open)}>
          <DialogSurface 
            aria-labelledby="survey-dialog-title" 
            style={{ 
              maxWidth: '95vw', 
              width: 'min(1200px, 95vw)', 
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <DialogTitle 
              id="survey-dialog-title" 
              style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: 'var(--colorBrandForeground1)',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--colorNeutralStroke2)',
                margin: '0',
                flexShrink: 0
              }}
            >
              📊 Survey Response Details
            </DialogTitle>
            <DialogContent 
              style={{ 
                overflowY: 'auto', 
                flex: 1,
                padding: '0',
                maxHeight: 'calc(90vh - 140px)' // Account for title and actions
              }}
            >
              <DialogBody style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '0' }}>
                  {/* Summary Section */}
                  <div className={styles.dialogSummary}>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Survey Name</div>
                      <div className={styles.summaryValue}>{selectedSurveyItem.survey}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Respondent</div>
                      <div className={styles.summaryValue}>{selectedSurveyItem.respondent}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Status</div>
                      <div className={styles.summaryValue}>{selectedSurveyItem.status}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Submitted</div>
                      <div className={styles.summaryValue}>{selectedSurveyItem.submittedDate}</div>
                    </div>
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '2px solid var(--colorNeutralStroke2)', margin: '0' }} />
                  
                  {/* Responses Section */}
                  <div>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--colorNeutralForeground1)', fontSize: '1.2rem' }}>
                      📝 Complete Survey Responses
                    </h3>
                    <div className={styles.dialogGrid}>
                      {selectedSurveyItem.rawData?.answers && Object.entries(selectedSurveyItem.rawData.answers).map(([questionId, answer]) => (
                        <div key={questionId} className={styles.fieldItem}>
                          <div className={styles.fieldLabel}>{getQuestionText(questionId)}</div>
                          <div className={styles.fieldValue}>{String(answer)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
            <DialogActions 
              style={{ 
                padding: '1rem 1.5rem', 
                borderTop: '1px solid var(--colorNeutralStroke2)',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button 
                appearance="primary" 
                onClick={() => setIsSurveyDialogOpen(false)}
                style={{ minWidth: '100px' }}
              >
                Close
              </Button>
            </DialogActions>
          </DialogSurface>
        </Dialog>
      )}

      {/* Registration Details Dialog */}
      {selectedRegistrationItem && (
        <Dialog open={isRegistrationDialogOpen} onOpenChange={(_, data) => setIsRegistrationDialogOpen(data.open)}>
          <DialogSurface 
            aria-labelledby="registration-dialog-title" 
            style={{ 
              maxWidth: '95vw', 
              width: 'min(1200px, 95vw)', 
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <DialogTitle 
              id="registration-dialog-title" 
              style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: 'var(--colorBrandForeground1)',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--colorNeutralStroke2)',
                margin: '0',
                flexShrink: 0
              }}
            >
              👤 Registration Details
            </DialogTitle>
            <DialogContent 
              style={{ 
                overflowY: 'auto', 
                flex: 1,
                padding: '0',
                maxHeight: 'calc(90vh - 140px)' // Account for title and actions
              }}
            >
              <DialogBody style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '0' }}>
                  {/* Summary Section */}
                  <div className={styles.dialogSummary}>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Registration Type</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.type}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Full Name</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.name}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Email</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.email}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Mobile</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.mobile}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Village</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.village}</div>
                    </div>
                    <div className={styles.summaryCard}>
                      <div className={styles.summaryLabel}>Submitted</div>
                      <div className={styles.summaryValue}>{selectedRegistrationItem.submittedDate}</div>
                    </div>
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '2px solid var(--colorNeutralStroke2)', margin: '0' }} />
                  
                  {/* Complete Registration Information */}
                  <div>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--colorNeutralForeground1)', fontSize: '1.2rem' }}>
                      📋 Complete Registration Information
                    </h3>
                    <div className={styles.dialogGrid}>
                      {selectedRegistrationItem.rawData?.responses && Object.entries(selectedRegistrationItem.rawData.responses)
                        .filter(([, value]) => value && String(value).trim() !== '') // Only show non-empty fields
                        .map(([fieldName, value]) => (
                        <div key={fieldName} className={styles.fieldItem}>
                          <div className={styles.fieldLabel}>{getRegistrationFieldLabel(fieldName)}</div>
                          <div className={styles.fieldValue}>{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogBody>
            </DialogContent>
            <DialogActions 
              style={{ 
                padding: '1rem 1.5rem', 
                borderTop: '1px solid var(--colorNeutralStroke2)',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button 
                appearance="primary" 
                onClick={() => setIsRegistrationDialogOpen(false)}
                style={{ minWidth: '100px' }}
              >
                Close
              </Button>
            </DialogActions>
          </DialogSurface>
        </Dialog>
      )}
    </div>
  );
};