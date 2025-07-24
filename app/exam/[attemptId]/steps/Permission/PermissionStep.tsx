import PermissionTask from "@/components/step/PermissionTask";

type PermissionStepProps = {
  onNextAction: () => void;
};

export default function PermissionStep({ onNextAction }: PermissionStepProps) {
  return <PermissionTask onNextAction={onNextAction} />;
}