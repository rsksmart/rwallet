import storage from '../../../common/storage';

export const WRONG_ATTEMPTS_STEPS = {
  step1: {
    maxAttempts: 6,
    waitingMinutes: 1,
  },
  step2: {
    maxAttempts: 7,
    waitingMinutes: 5,
  },
  step3: {
    maxAttempts: 8,
    waitingMinutes: 15,
  },
  step4: {
    maxAttempts: 10,
    waitingMinutes: 60,
  },
};

export const clearWrongAttempts = () => {
  try {
    storage.setLastPasscodeAttempt(0);
    storage.setWrongPasscodeCounter(0);
  } catch (error) {
    console.error('Error cleaning wrong attempts', error);
  }
};

// returns most accurate WRONG_ATTEMPTS step value according to the current number of consecutive wrong attempts
export const getClosestStep = ({ numberOfAttempts }) => {
  let lastStep = WRONG_ATTEMPTS_STEPS.step1;
  let lastStepDiff = numberOfAttempts - lastStep.maxAttempts;

  Object.values(WRONG_ATTEMPTS_STEPS).forEach((step) => {
    const currentDiff = numberOfAttempts - step.maxAttempts;

    if (currentDiff >= 0 && lastStepDiff > currentDiff) {
      lastStepDiff = currentDiff;
      lastStep = step;
    }
  });
  return lastStep;
};

export const getTimerString = ({ milliseconds }) => {
  if (!milliseconds) return '';
  const minutes = Math.floor(milliseconds / 60 / 1000).toString().padStart(2, '0');
  const seconds = Math.floor((milliseconds % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
