import dynamic from 'next/dynamic';

const ClientShell = dynamic(() => import('./Main'), { ssr: true });

export default function ExamPage() {
    return <ClientShell />;
}
