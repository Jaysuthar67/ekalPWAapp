import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Text } from '@fluentui/react-components';

export const ThankYouPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <Text as="h2">Thank you for your submission!</Text>
      <Text>Your feedback is valuable to us.</Text>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">
          <Button appearance="primary">Back to Survey List</Button>
        </Link>
      </div>
    </div>
  );
};
