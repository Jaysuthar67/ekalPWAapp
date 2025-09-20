import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Checkbox,
  Dropdown,
  Option,
  Card,
  makeStyles,
  shorthands,
  tokens,
  ProgressBar,
} from '@fluentui/react-components';
import {
  ChevronLeft24Filled,
  ChevronRight24Filled,
  Checkmark24Filled,
} from '@fluentui/react-icons';
import registrations from '../data/registrations.json';
import { saveRegistrationResponse } from '../services/db';

interface RegistrationQuestion {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'rating' | 'multiple_choice' | 'checkboxes' | 'dropdown';
  options?: string[];
}

interface Registration {
  id: string;
  title: string;
  description: string;
  questions: RegistrationQuestion[];
}

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('20px'),
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto'),
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    textAlign: 'center',
    ...shorthands.margin('0', '0', '30px', '0'),
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: tokens.colorBrandForeground1,
    ...shorthands.margin('0', '0', '10px', '0'),
  },
  description: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    ...shorthands.margin('0', '0', '20px', '0'),
  },
  progressContainer: {
    ...shorthands.margin('0', '0', '30px', '0'),
  },
  progressText: {
    textAlign: 'center',
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    ...shorthands.margin('0', '0', '10px', '0'),
  },
  questionCard: {
    ...shorthands.padding('32px'),
    ...shorthands.margin('0', '0', '30px', '0'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow8,
    borderRadius: tokens.borderRadiusLarge,
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground1,
    ...shorthands.margin('0', '0', '20px', '0'),
    lineHeight: '1.5',
  },
  input: {
    width: '100%',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    fontSize: '16px',
    resize: 'vertical',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dropdown: {
    width: '100%',
    fontSize: '16px',
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin('30px', '0'),
  },
  navigationTopContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin('0', '0', '20px', '0'),
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: `2px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: '20px',
    ':hover': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      transform: 'scale(1.05)',
    },
    ':disabled': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground4,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
    border: `2px solid ${tokens.colorPaletteGreenBorder1}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: '20px',
    ':hover': {
      backgroundColor: tokens.colorPaletteGreenBackground2,
      transform: 'scale(1.05)',
    },
  },
  questionNumber: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    fontWeight: '500',
  },
});

const RegistrationTakingPage: React.FC = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const navigate = useNavigate();
  const classes = useStyles();

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const foundRegistration = registrations.find((s) => s.id === registrationId);
    if (foundRegistration) {
      setRegistration(foundRegistration as Registration);
    } else {
      navigate('/registration');
    }
  }, [registrationId, navigate]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (registration && currentQuestionIndex < registration.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!registration) return;

    setIsSubmitting(true);
    try {
      await saveRegistrationResponse({
        registrationId: registration.id,
        responses,
        completedAt: new Date().toISOString(),
      });
      navigate('/registration/thank-you');
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Error saving registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: RegistrationQuestion) => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            className={classes.input}
            value={currentValue || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
          />
        );

      case 'textarea':
        return (
          <Textarea
            className={classes.textarea}
            value={currentValue || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your detailed answer here..."
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            className={classes.radioGroup}
            value={currentValue || ''}
            onChange={(_, data) => handleResponseChange(question.id, data.value)}
          >
            {question.options?.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        return (
          <div className={classes.checkboxContainer} style={{ display: 'flex', flexDirection: 'column' }}>
            {question.options?.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={currentValue?.includes?.(option) || false}
                onChange={(_, data) => {
                  const currentArray = currentValue || [];
                  if (data.checked) {
                    handleResponseChange(question.id, [...currentArray, option]);
                  } else {
                    handleResponseChange(question.id, currentArray.filter((item: string) => item !== option));
                  }
                }}
              />
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Dropdown
            className={classes.dropdown}
            placeholder="Select an option..."
            value={currentValue || ''}
            onOptionSelect={(_, data) => handleResponseChange(question.id, data.optionValue)}
          >
            {question.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        );

      default:
        return <Text>Unsupported question type</Text>;
    }
  };

  if (!registration) {
    return <div>Loading...</div>;
  }

  const currentQuestion = registration.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / registration.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === registration.questions.length - 1;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>{registration.title}</Text>
        <Text className={classes.description}>{registration.description}</Text>
      </div>

      <div className={classes.progressContainer}>
        <Text className={classes.progressText}>
          Question {currentQuestionIndex + 1} of {registration.questions.length}
        </Text>
        <ProgressBar value={progress} />
      </div>

      <div className={classes.navigationTopContainer}>
        <Button
          className={classes.navButton}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          appearance="subtle"
        >
          <ChevronLeft24Filled />
        </Button>

        <Text className={classes.questionNumber}>
          {currentQuestionIndex + 1} / {registration.questions.length}
        </Text>

        {!isLastQuestion ? (
          <Button
            className={classes.navButton}
            onClick={handleNext}
            appearance="subtle"
          >
            <ChevronRight24Filled />
          </Button>
        ) : (
          <Button
            className={classes.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
            appearance="subtle"
          >
            <Checkmark24Filled />
          </Button>
        )}
      </div>

      <Card className={classes.questionCard}>
        <Text className={classes.questionText}>{currentQuestion.text}</Text>
        {renderQuestion(currentQuestion)}
      </Card>

      <div className={classes.navigationContainer}>
        <Button
          className={classes.navButton}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          appearance="subtle"
        >
          <ChevronLeft24Filled />
        </Button>

        <Text className={classes.questionNumber}>
          {currentQuestionIndex + 1} / {registration.questions.length}
        </Text>

        {!isLastQuestion ? (
          <Button
            className={classes.navButton}
            onClick={handleNext}
            appearance="subtle"
          >
            <ChevronRight24Filled />
          </Button>
        ) : (
          <Button
            className={classes.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
            appearance="subtle"
          >
            <Checkmark24Filled />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegistrationTakingPage;