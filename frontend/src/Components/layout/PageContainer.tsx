import type { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    maxWidth?: string;
}

export function PageContainer({
    children,
    maxWidth = '300px',
}: PageContainerProps): React.JSX.Element {
    return (
        <main style={{ maxWidth, margin: '50px auto', textAlign: 'center' }}>
            {children}
        </main>
    );
}
