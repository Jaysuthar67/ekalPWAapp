import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  Input,
  Dropdown,
  Option,
  Card,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { PersonAdd24Regular, ArrowLeft24Regular, Add24Regular } from '@fluentui/react-icons';
import { saveRegistrationResponse } from '../services/db';

interface FormData {
  fname: string;
  lname: string;
  gender: string;
  fathername: string;
  occupation: string;
  dob: string;
  qualification: string;
  addhar: string;
  mobilenumber: string;
  emailId: string;
  financialbackground: string;
  village: string;
  block: string;
  district: string;
  state: string;
  enrollment: string;
}

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('20px'),
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    textAlign: 'center',
    ...shorthands.margin('0', '0', '30px', '0'),
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    ...shorthands.margin('0', '0', '10px', '0'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
  },
  formCard: {
    ...shorthands.padding('40px'),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    borderRadius: tokens.borderRadiusLarge,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    ...shorthands.margin('0', '0', '32px', '0'),
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  input: {
    width: '100%',
    fontSize: '16px',
  },
  dropdown: {
    width: '100%',
    fontSize: '16px',
  },
  radioGroup: {
    display: 'flex',
    gap: '16px',
    ...shorthands.margin('8px', '0', '0', '0'),
  },
  dateInput: {
    width: '100%',
    fontSize: '16px',
    fontFamily: 'inherit',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    ...shorthands.margin('32px', '0', '0', '0'),
  },
  submitButton: {
    fontSize: '16px',
    ...shorthands.padding('12px', '32px'),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  secondaryButton: {
    fontSize: '16px',
    ...shorthands.padding('12px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  successMessage: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
    ...shorthands.padding('12px', '16px'),
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    ...shorthands.margin('0', '0', '20px', '0'),
  },
  // Mobile styles
  containerMobile: {
    ...shorthands.padding('15px'),
  },
  formCardMobile: {
    ...shorthands.padding('24px'),
  },
  formGridMobile: {
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  titleMobile: {
    fontSize: '24px',
  },
});

const StudentRegistrationForm: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    fname: '',
    lname: '',
    gender: '',
    fathername: '',
    occupation: '',
    dob: '',
    qualification: '',
    addhar: '',
    mobilenumber: '',
    emailId: '',
    financialbackground: '',
    village: '',
    block: '',
    district: '',
    state: '',
    enrollment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (action: 'close' | 'continue') => {
    // Basic validation
    const requiredFields = ['fname', 'lname', 'gender', 'fathername', 'mobilenumber', 'village'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await saveRegistrationResponse({
        registrationId: 'student-registration-form',
        responses: formData,
        completedAt: new Date().toISOString(),
      });
      
      if (action === 'close') {
        // Navigate back to registration main page
        navigate('/registration');
      } else {
        // Clear form for another registration
        setFormData({
          fname: '',
          lname: '',
          gender: '',
          fathername: '',
          occupation: '',
          dob: '',
          qualification: '',
          addhar: '',
          mobilenumber: '',
          emailId: '',
          financialbackground: '',
          village: '',
          block: '',
          district: '',
          state: '',
          enrollment: '',
        });
        // Show success message
        setSuccessMessage('Registration saved successfully! You can now enter another registration.');
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Error saving registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text className={classes.title}>
          <PersonAdd24Regular />
          Student Registration Form
        </Text>
        <Text className={classes.subtitle}>
          Please fill in all the required information for student registration
        </Text>
      </div>

      <Card className={classes.formCard}>
        {successMessage && (
          <div className={classes.successMessage}>
            {successMessage}
          </div>
        )}
        <div className={classes.formGrid}>
          {/* First Name */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>First Name</Text>
            <Input
              className={classes.input}
              value={formData.fname}
              onChange={(e) => handleInputChange('fname', e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Last Name</Text>
            <Input
              className={classes.input}
              value={formData.lname}
              onChange={(e) => handleInputChange('lname', e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          {/* Gender */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Gender</Text>
            <Dropdown
              className={classes.dropdown}
              placeholder="Select gender"
              value={formData.gender}
              onOptionSelect={(_, data) => handleInputChange('gender', data.optionValue as string)}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Dropdown>
          </div>

          {/* Father's Name */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Father's Name</Text>
            <Input
              className={classes.input}
              value={formData.fathername}
              onChange={(e) => handleInputChange('fathername', e.target.value)}
              placeholder="Enter father's name"
            />
          </div>

          {/* Occupation */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Occupation</Text>
            <Input
              className={classes.input}
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              placeholder="Enter occupation"
            />
          </div>

          {/* Date of Birth */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Date of Birth</Text>
            <input
              type="date"
              className={classes.dateInput}
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${tokens.colorNeutralStroke1}`,
                borderRadius: tokens.borderRadiusMedium,
                fontSize: '16px',
              }}
            />
          </div>

          {/* Qualification */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Qualification</Text>
            <Input
              className={classes.input}
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              placeholder="Enter qualification"
            />
          </div>

          {/* Aadhar Number */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Aadhar Number</Text>
            <Input
              className={classes.input}
              type="number"
              value={formData.addhar}
              onChange={(e) => handleInputChange('addhar', e.target.value)}
              placeholder="Enter Aadhar number"
            />
          </div>

          {/* Mobile Number */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Mobile Number</Text>
            <Input
              className={classes.input}
              type="number"
              value={formData.mobilenumber}
              onChange={(e) => handleInputChange('mobilenumber', e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>

          {/* Email ID */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Email Id</Text>
            <Input
              className={classes.input}
              type="text"
              value={formData.emailId}
              onChange={(e) => handleInputChange('emailId', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {/* Financial Background */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Financial Background</Text>
            <Dropdown
              className={classes.dropdown}
              placeholder="Select financial background"
              value={formData.financialbackground}
              onOptionSelect={(_, data) => handleInputChange('financialbackground', data.optionValue as string)}
            >
              <Option value="APL">APL</Option>
              <Option value="BPL">BPL</Option>
            </Dropdown>
          </div>

          {/* Village */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Village</Text>
            <Input
              className={classes.input}
              value={formData.village}
              onChange={(e) => handleInputChange('village', e.target.value)}
              placeholder="Enter village name"
            />
          </div>

          {/* Block */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Block</Text>
            <Input
              className={classes.input}
              value={formData.block}
              onChange={(e) => handleInputChange('block', e.target.value)}
              placeholder="Enter block name"
            />
          </div>

          {/* District */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>District</Text>
            <Input
              className={classes.input}
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              placeholder="Enter district name"
            />
          </div>

          {/* State */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>State</Text>
            <Dropdown
              className={classes.dropdown}
              placeholder="Select state"
              value={formData.state}
              onOptionSelect={(_, data) => handleInputChange('state', data.optionValue as string)}
            >
              <Option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</Option>
              <Option value="Andhra Pradesh">Andhra Pradesh</Option>
              <Option value="Arunachal Pradesh">Arunachal Pradesh</Option>
              <Option value="Assam">Assam</Option>
              <Option value="Bihar">Bihar</Option>
              <Option value="Chandigarh">Chandigarh</Option>
              <Option value="Chhattisgarh">Chhattisgarh</Option>
              <Option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</Option>
              <Option value="Daman and Diu">Daman and Diu</Option>
              <Option value="Delhi">Delhi</Option>
              <Option value="Goa">Goa</Option>
              <Option value="Gujarat">Gujarat</Option>
              <Option value="Haryana">Haryana</Option>
              <Option value="Himachal Pradesh">Himachal Pradesh</Option>
              <Option value="Jammu and Kashmir">Jammu and Kashmir</Option>
              <Option value="Jharkhand">Jharkhand</Option>
              <Option value="Karnataka">Karnataka</Option>
              <Option value="Kerala">Kerala</Option>
              <Option value="Ladakh">Ladakh</Option>
              <Option value="Lakshadweep">Lakshadweep</Option>
              <Option value="Madhya Pradesh">Madhya Pradesh</Option>
              <Option value="Maharashtra">Maharashtra</Option>
              <Option value="Manipur">Manipur</Option>
              <Option value="Meghalaya">Meghalaya</Option>
              <Option value="Mizoram">Mizoram</Option>
              <Option value="Nagaland">Nagaland</Option>
              <Option value="Odisha">Odisha</Option>
              <Option value="Puducherry">Puducherry</Option>
              <Option value="Punjab">Punjab</Option>
              <Option value="Rajasthan">Rajasthan</Option>
              <Option value="Sikkim">Sikkim</Option>
              <Option value="Tamil Nadu">Tamil Nadu</Option>
              <Option value="Telangana">Telangana</Option>
              <Option value="Tripura">Tripura</Option>
              <Option value="Uttar Pradesh">Uttar Pradesh</Option>
              <Option value="Uttarakhand">Uttarakhand</Option>
              <Option value="West Bengal">West Bengal</Option>
            </Dropdown>
          </div>

          {/* Enrollment */}
          <div className={classes.fieldGroup}>
            <Text className={classes.label}>Enrollment</Text>
            <Input
              className={classes.input}
              value={formData.enrollment}
              onChange={(e) => handleInputChange('enrollment', e.target.value)}
              placeholder="Enter enrollment number"
              disabled
            />
          </div>
        </div>

        <div className={classes.submitContainer}>
          <Button
            className={classes.secondaryButton}
            appearance="secondary"
            size="large"
            icon={<ArrowLeft24Regular />}
            onClick={() => handleSubmit('close')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Close'}
          </Button>
          <Button
            className={classes.submitButton}
            appearance="primary"
            size="large"
            icon={<Add24Regular />}
            onClick={() => handleSubmit('continue')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StudentRegistrationForm;