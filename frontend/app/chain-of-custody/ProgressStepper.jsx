'use client';

import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = [
  'Client Info',
  'Project & Location Info',
  'Analytes',
  'Methods',
  'Quantity',
  'Equipment Rental',
  'Order Summary',
];

export default function ProgressStepper({ currentStep }) {
  return (
    <div className="mb-8 mt-8">
      <Stepper
        activeStep={currentStep - 1}
        alternativeLabel
        sx={{
          '& .MuiStepIcon-root.Mui-active': {
            color: '#003883',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: '#003883',
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: '#003883',
            fontWeight: 'bold',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}