import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('../../components/step/Main'), { ssr: true });

export default function ExamPage() {
    return <ClientShell />;
}
