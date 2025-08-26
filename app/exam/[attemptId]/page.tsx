import dynamic from 'next/dynamic';
import Loader from '@/components/common/Loader';

const ClientShell = dynamic(() => import('./steps/Exam'), {
  ssr: true,
  loading: () => <Loader message="Loading exam..." />,
});

export default function ExamPage() {
  return <ClientShell />;
}
