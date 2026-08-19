import { StatusMessage } from '../../../Components/ui/StatusMessage';

interface SecretDataResultProps {
    message?: string;
    error?: Error | null;
}

export function SecretDataResult({
    message,
    error,
}: SecretDataResultProps): React.JSX.Element | null {
    if (message) return <StatusMessage tone="success">{message}</StatusMessage>;
    if (error)
        return (
            <StatusMessage tone="error">
                Failed to fetch data: {error.message}
            </StatusMessage>
        );
    return null;
}
