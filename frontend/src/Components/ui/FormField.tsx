interface FormFieldProps {
    id: string;
    label: string;
    type?: 'text' | 'password';
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function FormField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    disabled = false,
}: FormFieldProps): React.JSX.Element {
    return (
        <div>
            <label htmlFor={id}>{label}: </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required
            />
        </div>
    );
}
