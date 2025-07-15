import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('./ClientShell'));

export default function ExamPage() {
    return <ClientShell />;
}
