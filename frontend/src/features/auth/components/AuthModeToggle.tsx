interface AuthModeToggleProps {
    isLogin: boolean;
    disabled: boolean;
    onToggle: () => void;
}

export function AuthModeToggle({
    isLogin,
    disabled,
    onToggle,
}: AuthModeToggleProps): React.JSX.Element {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            style={{
                background: 'none',
                border: 'none',
                color: 'blue',
                cursor: 'pointer',
                marginTop: '10px',
            }}
        >
            {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
        </button>
    );
}
