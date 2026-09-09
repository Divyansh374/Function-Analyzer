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
    <div className="function-input">
      <label htmlFor="function-input">Enter a function</label>

      <div className="input-row">
        <span className="function-prefix">f(x) = </span>

        <input
          id="function-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onAnalyze();
            }
          }}
          placeholder="x^2 + 2*x + 1"
          spellCheck={false}
        />

        <button type="button" onClick={onAnalyze}>
          Analyze
        </button>
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
