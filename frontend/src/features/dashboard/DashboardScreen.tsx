import { PageContainer } from '../../Components/layout/PageContainer';
import { useAuth } from '../../auth/useAuth';
import { SecretDataResult } from './components/SecretDataResult';
import { useProtectedData } from './hooks/useProtectedData';

export function DashboardScreen(): React.JSX.Element {
    const { logout } = useAuth();
    const protectedData = useProtectedData();

    return (
        <PageContainer>
            <h2>Dashboard (this is a private area)</h2>
            <button
                onClick={() => protectedData.mutate()}
                disabled={protectedData.isPending}
            >
                {protectedData.isPending ? 'Loading...' : 'Fetch Secret Data'}
            </button>
            <SecretDataResult
                message={protectedData.data?.message}
                error={protectedData.isError ? protectedData.error : null}
            />
            <br />
            <button onClick={logout} style={{ marginTop: '20px' }}>
                Logout
            </button>
        </PageContainer>
    );
}
