import type { ReactNode } from 'react';

interface StatusMessageProps {
    children: ReactNode;
    tone?: 'success' | 'error' | 'neutral';
}

const colors = { success: 'green', error: 'crimson', neutral: 'inherit' };

export function StatusMessage({
    children,
    tone = 'neutral',
}: StatusMessageProps): React.JSX.Element {
    return (
        <p
            role={tone === 'error' ? 'alert' : 'status'}
            style={{ fontWeight: 'bold', color: colors[tone] }}
        >
            {children}
        </p>
    );
}
