import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('./ClientShell'), { ssr: true });

export default function ExamPage() {
    return <ClientShell />;
}
