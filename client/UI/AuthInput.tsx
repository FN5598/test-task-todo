type AuthFieldProps = {
  autoComplete: string;
  error?: string;
  id: string;
  label: string;
  placeholder: string;
  type?: "email" | "password" | "text";
};

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  error,
  placeholder,
}: AuthFieldProps) {
  return (
    <label
      className="grid gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.13em] text-muted-foreground"
      htmlFor={id}
    >
      {label}
      <input
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className="h-12 w-full border bg-card px-3 text-base normal-case tracking-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-red-600 aria-invalid:ring-red-600"
        id={id}
        name={id}
        placeholder={placeholder}
        required
        type={type}
      />
      {error ? (
        <span
          className="normal-case tracking-normal text-red-600"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
