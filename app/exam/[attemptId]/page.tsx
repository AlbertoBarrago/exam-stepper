import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('././Exam'), { ssr: true });

export default function ExamPage() {
  return <ClientShell />;
}
