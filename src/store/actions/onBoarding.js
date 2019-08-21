import {
  ON_BOARDING_STEP_COMPLETED,
} from '.';

export const onStepCompleted = step => ({ type: ON_BOARDING_STEP_COMPLETED, payload: step });
