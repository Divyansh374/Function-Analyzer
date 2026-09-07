import { useState } from "react";

function App() {
  const [expression, setExpression] = useState("x^2");

  return (
    <main>
      <h1>Functionyzer</h1>

      <div>
        <label htmlFor="expression">f(x) = </label>
        <input
          id="expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter a function..."
        />

        <button>Analyze</button>
      </div>

      <p>Current function: {expression}</p>
    </main>
  );
}

export default App;
