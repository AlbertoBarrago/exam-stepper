import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('./main'), { ssr: true });

export default function ExamPage() {
    return <ClientShell />;
}
