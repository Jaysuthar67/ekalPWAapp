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
import surveys from '../data/surveys.json';
import { addResponse } from '../services/db';

const useStyles = makeStyles({
  root: {
    maxWidth: '800px',
    ...shorthands.margin('auto'),
    ...shorthands.padding('2rem'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('1.5rem'),
  },
  questionContainer: {
    ...shorthands.padding('1.5rem'),
    ...shorthands.border('1px', 'solid', '#e0e0e0'), // Replace with theme token
    ...shorthands.borderRadius('8px'),
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('0.5rem'),
  },
});

const QuestionRenderer: React.FC<{ question: any; answer: any; onChange: (answer: any) => void; }> = ({ question, answer, onChange }) => {
    switch (question.type) {
        case 'text':
            return <Input value={answer || ''} onChange={(_, data) => onChange(data.value)} placeholder="Type your answer..." />;
        case 'textarea':
            return <Textarea value={answer || ''} onChange={(_, data) => onChange(data.value)} placeholder="Type your detailed answer..." style={{ minHeight: '120px' }}/>;
        case 'rating':
            return <Slider min={1} max={question.options} value={answer || 1} onChange={(_, data) => onChange(data.value)} />;
        case 'multiple_choice':
            return (
                <RadioGroup value={answer} onChange={(_, data) => onChange(data.value)}>
                    {question.options.map((opt: string) => <Radio key={opt} value={opt} label={opt} />)}
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
                <div>
                    {question.options.map((opt: string) => (
                        <Checkbox key={opt} label={opt} checked={(answer || []).includes(opt)} onChange={(_, data) => handleCheckboxChange(opt, data.checked as boolean)} />
                    ))}
                </div>
            );
        case 'dropdown':
            return (
                <Dropdown value={answer} onOptionSelect={(_, data) => onChange(data.optionValue)}>
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
      <h2>{survey.title}</h2>
      <div className={styles.progressBarContainer}>
        <Text>Progress: {currentQuestionIndex + 1} of {survey.questions.length}</Text>
        <ProgressBar value={progress} />
      </div>

      <div className={styles.questionContainer}>
        <Field label={currentQuestion.text} required>
            <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
            />
        </Field>
      </div>

      <div className={styles.navigation}>
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button appearance="primary" onClick={handleNext}>
          {currentQuestionIndex === survey.questions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
