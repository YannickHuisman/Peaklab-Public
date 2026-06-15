import type { PerformanceFormData } from '../types';
import { Step1Profile } from './Step1Profile';
import { Step2Goals } from './Step2Goals';
import { Step3Limitations } from './Step3Limitations';
import { Step4Recovery } from './Step4Recovery';
import { Step5Nutrition } from './Step5Nutrition';
import { Step7Training } from './Step7Training';
import { Step8Level } from './Step8Level';

interface StepRendererProps {
  step: number;
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
}

const STEP_COMPONENTS = {
  1: Step1Profile,
  2: Step2Goals,
  3: Step3Limitations,
  4: Step4Recovery,
  5: Step5Nutrition,
  6: Step7Training,
  7: Step8Level,
} as const;

export function StepRenderer({ step, formData, onChange }: StepRendererProps) {
  const Component = STEP_COMPONENTS[step as keyof typeof STEP_COMPONENTS];

  if (!Component) return null;

  return <Component formData={formData} onChange={onChange} />;
}
