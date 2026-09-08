export type TokenType =
  | "number"
  | "identifier"
  | "operator"
  | "leftBrac"
  | "rightBrac";

export interface Token {
  type: TokenType;
  value: string;
}

export type Expression =
  | {
      type: "number";
      value: number;
    }
  | {
      type: "variable";
      name: "x";
    }
  | {
      type: "binary";
      operator: "+" | "-" | "*" | "/" | "^";
      left: Expression;
      right: Expression;
    }
  | {
      type: "unary";
      operator: "-";
      operand: Expression;
    }
  | {
      type: "function";
      name: "sin" | "cos" | "tan" | "sqrt" | "log" | "abs";
      argument: Expression;
    };
