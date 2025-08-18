import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('./steps/Exam'), { ssr: true });

export default function ExamPage() {
  return <ClientShell />;
}
