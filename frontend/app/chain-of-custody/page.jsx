'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

import Step1 from './Step1';
import Step2 from './Step2';
import Step4 from './Step4';
import Step5 from './Step5'; 
import Step6 from './Step6'; 
import Step7 from './Step7'; 
import Step8 from './Step8'; 
import ProgressStepper from './ProgressStepper';

export default function Page() {
  const methods = useForm({ mode: 'onChange' });
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skippedAnalytes, setSkippedAnalytes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

    if (!token || !role) {
      router.push('/customer-login');
    } else {
      setIsAuthenticated(true);
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
  const savedStep = parseInt(sessionStorage.getItem('currentStep'));
  if (savedStep && savedStep >= 1 && savedStep <= 8) {
    setStep(savedStep);
    sessionStorage.removeItem('currentStep');
  }
}, []);

  useEffect(() => {
  const skipped = sessionStorage.getItem("skippedAnalytes") === "true";
  setSkippedAnalytes(skipped);
}, []);

useEffect(() => {
  if (step === 8 && skippedAnalytes) {
    setSkippedAnalytes(false);
    sessionStorage.removeItem("skippedAnalytes");
  }
}, [step]);

const handleNext = () =>
  setStep((prev) => {
    if (prev === 2) return 4;
    return Math.min(prev + 1, 8);
  });

  const handleBack = () =>
  setStep((prev) => {
    if (prev === 4) return 2;
    if (prev === 7) return 4;
    if (prev === 6) return 5;
    if (prev === 5) return 4;
    return Math.max(prev - 1, 1);
  });

  const handleStepChange = (stepIndex) => setStep(stepIndex);

  const steps = {
    1: <Step1 onNext={handleNext} />,
    2: <Step2 onNext={handleNext} onBack={handleBack} />,
    4: <Step4 onNext={handleNext} onBack={handleBack} onStepChange={handleStepChange} />, 
    5: <Step5 onNext={handleNext} onBack={handleBack} />,
    6: <Step6 onBack={handleBack} onNext={handleNext} />,
    7: <Step7 onBack={handleBack} onNext={handleNext} />,
    8: <Step8 onBack={handleBack} onStepChange={handleStepChange} onSubmit={() => router.push("/checkout")}  />,
  };
  
  // Visual mapping for progress bar
  const getVisualStep = (realStep) => {
    switch (realStep) {
      case 1: return 1; // Client Info
      case 2: return 2; // Project Info
      case 4: return 3; // Analytes
      case 5: return 4; // Methods
      case 6: return 5; // Equipment Rental
      case 7: return 6; // Order Summary
      case 8: return 7; // Confirmation
      default: return 1;
    }
  };

  if (!isMounted || !isAuthenticated) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
          <div className="w-full h-screen overflow-y-hidden">
          <div className="w-full px-4 pt-6 max-w-4xl mx-auto">
            <ProgressStepper currentStep={getVisualStep(step)} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex justify-center p-4 overflow-y-auto max-h-[calc(100vh-10rem)]"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </form>
    </FormProvider>
  );
}