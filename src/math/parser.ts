import type { Expression, Token } from "./types";

const OPERATORS = new Set(["+", "-", "*", "/", "^"]);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i: number = 0;

  while (i < input.length) {
    const char: string = input[i];

    // Ignore whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number
    if (/[0-9.]/.test(char)) {
      let value: string = "";

      while (i < input.length && /[0-9.]/.test(input[i])) {
        value += input[i];
        i++;
      }

      if ((value.match(/\./g) ?? []).length > 1) {
        throw new Error(`Invalid number: ${value}`);
      }

      tokens.push({
        type: "number",
        value,
      });

      continue;
    }

    // Identifier
    if (/[a-zA-Z]/.test(char)) {
      let value = "";

      while (i < input.length && /[a-zA-Z]/.test(input[i])) {
        value += input[i];
        i++;
      }

      tokens.push({
        type: "identifier",
        value,
      });

      continue;
    }

    // Operators
    if (OPERATORS.has(char)) {
      tokens.push({
        type: "identifier",
        value: char,
      });

      i++;
      continue;
    }

    if (char === "(") {
      tokens.push({
        type: "leftBrac",
        value: char,
      });

      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({
        type: "rightBrac",
        value: char,
      });

      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}

class Parser {
  private position = 0;
  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Expression {
    if (this.tokens.length === 0) {
      throw new Error("Expression cannot be empty");
    }

    const expression = this.parseAdditive();

    if (this.position < this.tokens.length) {
      const token = this.tokens[this.position];

      throw new Error(`Unexpected token: "${token.value}"`);
    }

    return expression;
  }

  private parseAdditive(): Expression {
    let left = this.parseMultiplicative();

    while (this.matchOperator("+") || this.matchOperator("-")) {
      const operator = this.previous().value as "+" | "-";
      const right = this.parseMultiplicative();

      left = {
        type: "binary",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplicative(): Expression {
    let left = this.parseExponent();

    while (this.matchOperator("*") || this.matchOperator("/")) {
      const operator = this.previous().value as "*" | "/";
      const right = this.parseExponent();

      left = {
        type: "binary",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseExponent(): Expression {
    let left = this.parseUnary();

    if (this.matchOperator("^")) {
      const right = this.parseExponent();

      left = {
        type: "binary",
        operator: "^",
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): Expression {
    if (this.matchOperator("-")) {
      return {
        type: "unary",
        operator: "-",
        operand: this.parseUnary(),
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    const token = this.peek();

    if (!token) {
      throw new Error("Unexpected end of expression");
    }

    if (token.type === "number") {
      this.position++;

      return {
        type: "number",
        value: Number(token.value),
      };
    }

    if (token.type === "identifier") {
      this.position++;

      if (token.value === "x") {
        return {
          type: "variable",
          name: "x",
        };
      }

      throw new Error(`Unknown identifier: "${token.value}"`);
    }

    if (token.type === "leftBrac") {
      this.position++;

      const expression = this.parseAdditive();

      if (!this.matchType("rightBrac")) {
        throw new Error('Expected ")"');
      }

      return expression;
    }

    throw new Error(`Unexpected token: "${token.value}"`);
  }

  private matchOperator(operator: string): boolean {
    const token = this.peek();

    if (token?.type === "operator" && token.value === operator) {
      this.position++;
      return true;
    }

    return false;
  }

  private matchType(type: Token["type"]): boolean {
    const token = this.peek();

    if (token?.type === type) {
      this.position++;
      return true;
    }

    return false;
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private previous(): Token {
    return this.tokens[this.position - 1];
  }
}

export function parse(input: string): Expression {
  return new Parser(tokenize(input)).parse();
}
