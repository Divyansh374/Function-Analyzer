interface FunctionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  error: string | null;
}

export function FunctionInput({
  value,
  onChange,
  onAnalyze,
  error,
}: FunctionInputProps) {
  return (
    <section>
      <label htmlFor="function-input">f(x) = </label>

      <input
        id="function-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAnalyze();
          }
        }}
        placeholder="e.g. x^2 + 2*x + 1"
        spellCheck={false}
      />

      <button type="button" onClick={onAnalyze}>
        Analyze
      </button>

      {error && <p>{error}</p>}
    </section>
  );
}
