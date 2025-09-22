import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  Button,
  ProgressBar,
  Text,
  Input,
  RadioGroup,
  Radio,
  Checkbox,
  Textarea,
  Slider,
  Dropdown,
  Option,
  Field,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  CheckmarkRegular,
} from '@fluentui/react-icons';
import surveys from '../data/surveys.json';
import { addResponse } from '../services/db';

const useStyles = makeStyles({
  root: {
    maxWidth: '800px',
    ...shorthands.margin('auto'),
    ...shorthands.padding('clamp(0.5rem, 4vw, 2rem)'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('1.5rem'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('1rem', '0.5rem'),
      ...shorthands.gap('1rem'),
    },
    '@media (max-width: 480px)': {
      ...shorthands.padding('0.75rem', '0.25rem'),
      ...shorthands.gap('0.75rem'),
    },
  },
  title: {
    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
    margin: '0',
    textAlign: 'center',
    '@media (max-width: 480px)': {
      textAlign: 'left',
    },
  },
  questionContainer: {
    ...shorthands.padding('clamp(1rem, 4vw, 1.5rem)'),
    ...shorthands.border('1px', 'solid', 'var(--colorNeutralStroke1)'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: 'var(--colorNeutralBackground1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '@media (max-width: 480px)': {
      ...shorthands.padding('0.75rem'),
    },
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    ...shorthands.gap('1rem'),
    marginTop: '1rem',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      ...shorthands.gap('0.75rem'),
    },
  },
  navigationButton: {
    minWidth: '56px',
    minHeight: '56px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      opacity: '0.4',
      transform: 'none',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    '& svg': {
      fontSize: '24px',
      fontWeight: '700',
    },
    '@media (max-width: 480px)': {
      minWidth: '48px',
      minHeight: '48px',
      width: '48px',
      height: '48px',
      '& svg': {
        fontSize: '20px',
      },
    },
  },
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('0.5rem'),
    ...shorthands.padding('0', '0.5rem'),
  },
  progressText: {
    textAlign: 'center',
    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    '@media (max-width: 480px)': {
      textAlign: 'left',
    },
  },
  questionField: {
    '& .fui-Field__label': {
      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
      lineHeight: '1.4',
      marginBottom: '1rem',
    },
  },
  inputControls: {
    '& .fui-Input': {
      minHeight: '44px',
      fontSize: '16px', // Prevents zoom on iOS
    },
    '& .fui-Textarea': {
      fontSize: '16px',
      minHeight: '120px',
    },
    '& .fui-Radio': {
      marginBottom: '0.5rem',
      '& .fui-Radio__label': {
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      },
    },
    '& .fui-Checkbox': {
      marginBottom: '0.5rem',
      '& .fui-Checkbox__label': {
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      },
    },
  },
});

const QuestionRenderer: React.FC<{ question: any; answer: any; onChange: (answer: any) => void; }> = ({ question, answer, onChange }) => {
    switch (question.type) {
        case 'text':
            return <Input 
              value={answer || ''} 
              onChange={(_, data) => onChange(data.value)} 
              placeholder="Type your answer..."
              style={{ fontSize: '16px', minHeight: '44px' }}
            />;
        case 'textarea':
            return <Textarea 
              value={answer || ''} 
              onChange={(_, data) => onChange(data.value)} 
              placeholder="Type your detailed answer..."
              style={{ minHeight: '120px', fontSize: '16px' }}
            />;
        case 'rating':
            return <div style={{ padding: '0.5rem 0' }}>
              <Slider 
                min={1} 
                max={question.options} 
                value={answer || 1} 
                onChange={(_, data) => onChange(data.value)}
                style={{ minHeight: '44px' }}
              />
            </div>;
        case 'multiple_choice':
            return (
                <RadioGroup value={answer} onChange={(_, data) => onChange(data.value)}>
                    {question.options.map((opt: string) => (
                      <Radio 
                        key={opt} 
                        value={opt} 
                        label={opt} 
                        style={{ marginBottom: '0.75rem', minHeight: '44px' }}
                      />
                    ))}
                </RadioGroup>
            );
        case 'checkboxes':
            const handleCheckboxChange = (option: string, checked: boolean) => {
                const currentAnswers = answer || [];
                if (checked) {
                    onChange([...currentAnswers, option]);
                } else {
                    onChange(currentAnswers.filter((a: string) => a !== option));
                }
            };
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    maxWidth: '100%'
                }}>
                    {question.options.map((opt: string) => (
                        <Checkbox 
                          key={opt} 
                          label={opt} 
                          checked={(answer || []).includes(opt)} 
                          onChange={(_, data) => handleCheckboxChange(opt, data.checked as boolean)}
                          style={{
                            width: '100%',
                            alignItems: 'flex-start',
                            minHeight: '44px',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                        />
                    ))}
                </div>
            );
        case 'dropdown':
            return (
                <Dropdown 
                  value={answer} 
                  onOptionSelect={(_, data) => onChange(data.optionValue)}
                  style={{ minHeight: '44px' }}
                >
                    {question.options.map((opt: string) => <Option key={opt} value={opt}>{opt}</Option>)}
                </Dropdown>
            );
        default:
            return <Text>Unsupported question type.</Text>;
    }
};


export const SurveyTakingPage: React.FC = () => {
  const styles = useStyles();
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const survey = surveys.find((s) => s.id === surveyId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  if (!survey) {
    return <div>Survey not found.</div>;
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / survey.questions.length;

  const handleAnswerChange = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = async () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit logic
      if (surveyId) {
        await addResponse({
          surveyId,
          answers,
          completed: true,
        });
        navigate('/thank-you');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{survey.title}</h2>
      <div className={styles.progressBarContainer}>
        <Text className={styles.progressText}>Progress: {currentQuestionIndex + 1} of {survey.questions.length}</Text>
        <ProgressBar value={progress} />
      </div>

      {/* Top Navigation */}
      <div className={styles.navigation}>
        <Button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          className={styles.navigationButton}
          icon={<ChevronLeftRegular />}
          title="Previous Question"
        />
        <Button 
          appearance="primary" 
          onClick={handleNext}
          className={styles.navigationButton}
          icon={currentQuestionIndex === survey.questions.length - 1 ? <CheckmarkRegular /> : <ChevronRightRegular />}
          title={currentQuestionIndex === survey.questions.length - 1 ? 'Submit Survey' : 'Next Question'}
        />
      </div>

      <div className={styles.questionContainer}>
        <Field 
          label={currentQuestion.text} 
          required
          className={styles.questionField}
        >
          <div className={styles.inputControls}>
            <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
            />
          </div>
        </Field>
      </div>

      {/* Bottom Navigation */}
      <div className={styles.navigation}>
        <Button 
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
          className={styles.navigationButton}
          icon={<ChevronLeftRegular />}
          title="Previous Question"
        />
        <Button 
          appearance="primary" 
          onClick={handleNext}
          className={styles.navigationButton}
          icon={currentQuestionIndex === survey.questions.length - 1 ? <CheckmarkRegular /> : <ChevronRightRegular />}
          title={currentQuestionIndex === survey.questions.length - 1 ? 'Submit Survey' : 'Next Question'}
        />
      </div>
    </div>
  );
};
