import PermissionTask from '@/components/steps/PermissionTask';
import { NextTypes } from '@/types/commonTypes';

export default function PermissionStep({ onNextAction }: NextTypes) {
  return <PermissionTask onNextAction={onNextAction} />;
}
