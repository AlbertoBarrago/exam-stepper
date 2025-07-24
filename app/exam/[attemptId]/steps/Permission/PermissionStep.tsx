import PermissionTask from '@/components/steps/PermissionTask';

type PermissionStepProps = {
  onNextAction: () => void;
};

export default function PermissionStep({ onNextAction }: PermissionStepProps) {
  return <PermissionTask onNextAction={onNextAction} />;
}
