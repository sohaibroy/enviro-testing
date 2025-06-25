'use client';

import { useRouter } from 'next/navigation'; //added
import Cookies from 'js-cookie'; // added
import React, { useState, useEffect } from 'react'; // modified
import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import ProgressStepper from './ProgressStepper';

export default function Page() {
  const methods = useForm({ mode: 'onChange' });
  const [step, setStep] = useState(1);
  const router = useRouter(); // added

  // added
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

  // Allow access only if token AND role exist
  if (!token || !role) {
    router.push('/customer-login');
  }
  }, []);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 6));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleStepChange = (stepIndex) => setStep(stepIndex);

  const steps = {
    1: <Step1 onNext={handleNext} />,
    2: <Step2 onNext={handleNext} onBack={handleBack} />,
    3: <Step3 onNext={handleNext} onBack={handleBack} />,
    4: <Step4 onNext={handleNext} onBack={handleBack} />,
    5: <Step5 onNext={handleNext} onBack={handleBack} />,
    6: <Step6 onBack={handleBack} onStepChange={handleStepChange} />,
    
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <div className="w-full h-screen overflow-hidden">
          <div className="w-full px-4 pt-6 max-w-4xl mx-auto">
            <ProgressStepper currentStep={step} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex justify-center p-4"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </form>
    </FormProvider>
  );
}
